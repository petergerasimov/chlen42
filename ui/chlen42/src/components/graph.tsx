"use client";
import { useState, useRef, useLayoutEffect, useEffect } from "react";
import { ForceGraph3D } from "react-force-graph";
import LawData from "../../public/parsed.json";
import { CSS3DObject, CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer";
import * as THREE from "three";

interface NodesMap {
  [key: string]: {
    isSelected: boolean;
    draggableBox: THREE.Mesh;
    iframe?: HTMLDivElement;
  };
}

export default function Graph({ graphData }: { graphData: any }) {
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [gData, setGData] = useState(graphData);
  const [selectedNodes, setSelectedNodes] = useState<NodesMap>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef();

  useLayoutEffect(() => {
    if (containerRef.current === null) return;

    setWidth(containerRef.current.offsetWidth);
    setHeight(containerRef.current.offsetHeight);
  }, []);

  const findArticle = (id: string) => {
    for (const topic of LawData as Topic[]) {
      for (const article of topic) {
        if (article.id === id) {
          return article;
        }
      }
    }

    return null;
  };

  const constructArticleComponents = (id: string) => {
    const article = findArticle(id);

    if (!article) {
      return;
    }

    const div = document.createElement("div");
    const articleEl = document.createElement("div");
    articleEl.textContent = article.meta.text;
    articleEl.style.backgroundColor = "white";
    articleEl.style.color = "black";
    articleEl.style.padding = "5px";
    articleEl.style.border = "1px solid black";
    articleEl.style.borderRadius = "5px";

    const iframe = document.createElement("iframe");
    iframe.style.backgroundColor = "white";
    iframe.style.resize = "both";
    iframe.id = "article_iframe";

    for (const alinea of article.alineas) {
      const alineaEl = document.createElement("div");
      alineaEl.textContent = `(${alinea.id}) ${alinea.meta.text}`;

      for (const point of alinea.points) {
        const pointEl = document.createElement("div");
        pointEl.textContent = `${point.id}. ${point.meta.text}`;

        for (const letter of point.letters) {
          const letterEl = document.createElement("div");
          letterEl.textContent = `${letter.id}) ${letter.text}`;
          pointEl.appendChild(letterEl);
        }

        alineaEl.appendChild(pointEl);
      }

      articleEl.appendChild(alineaEl);
    }

    iframe.srcdoc = articleEl.innerHTML;
    //iframe.src = "https://www.google.com";
    console.log(iframe.offsetHeight, iframe.offsetWidth);
    div.appendChild(iframe);
    iframe.onload = () => {
      iframe.contentWindow.onresize = (ev) => {
        const width = iframe.contentWindow.innerWidth;
        const height = iframe.contentWindow.innerHeight;

        const box = selectedNodes[id].draggableBox.geometry;
        const boxWidth = box.parameters.width;
        const boxHeight = box.parameters.height;

        const scaleX = width / boxWidth;
        const scaleY = height / boxHeight;

        selectedNodes[id].draggableBox.scale.set(scaleX, scaleY, 1);
      };
    };
    return div;
  };

  const resetNodes = () => {
    for (const node of gData.nodes) {
      node.isVisible = true;
      node.color = 0xa2cade;
    }

    for (const link of gData.links) {
      link.isVisible = true;
    }

    setSelectedNodes([]);
    setGData({ ...gData });
  };

  const onNodeClick = (node) => {
    if (selectedNodes[node.id]) {
      delete selectedNodes[node.id];
    } else {
      const box = new THREE.BoxGeometry(300, 170, 1);
      const boxMesh = new THREE.Mesh(box, new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
      boxMesh.position.set(0, 10, 0);

      selectedNodes[node.id] = {
        isSelected: true,
        draggableBox: boxMesh,
      };
    }

    //selectedNodes[node.id] = !selectedNodes[node.id];
    console.log(Object.keys(selectedNodes));
    if (Object.keys(selectedNodes).length == 0) {
      resetNodes();
      return;
    }

    const neighbors = new Set();
    neighbors.add(node.id);

    for (const link of graphData.links) {
      //console.log(link.source.id, node.id);
      if (selectedNodes[link.source.id]) {
        neighbors.add(link.target.id);
        link.isVisible = true;
      } else if (selectedNodes[link.target.id]) {
        neighbors.add(link.source.id);
        link.isVisible = true;
      } else {
        link.isVisible = false;
      }
    }

    for (const n of graphData.nodes) {
      if (selectedNodes[n.id] || neighbors.has(n.id)) {
        n.isVisible = true;
        n.color = 0xff0000;
      } else {
        n.isVisible = false;
      }
    }

    setSelectedNodes(selectedNodes);
    setGData({ ...graphData });
  };

  const nodeToHTML = (node) => {
    let elem;
    if (selectedNodes[node.id]) {
      if (selectedNodes[node.id].iframe) {
        elem = selectedNodes[node.id].iframe;
      } else {
        elem = constructArticleComponents(node.id);
        selectedNodes[node.id].iframe = elem;
      }
      console.log("CUSTOM ELEME", elem);
    } else {
      //create three js sphere
      const geometry = new THREE.SphereGeometry(node.size, 10, 10);
      const material = new THREE.MeshBasicMaterial({
        color: 0xffff00,
      });
      return new THREE.Mesh(geometry, material);
    }

    // console.log(elem?.offsetWidth, elem?.offsetHeight);
    // const box = new THREE.BoxGeometry(300, 170, 1);
    // const boxMesh = new THREE.Mesh(box, new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
    // boxMesh.position.set(0, 10, 0);
    // boxMesh.geo

    const group = new THREE.Object3D();
    group.add(selectedNodes[node.id].draggableBox);
    group.add(new CSS3DObject(elem));
    return group;
  };

  const extraRenderers = [new CSS3DRenderer()];

  return (
    <div className="w-full h-full" ref={containerRef}>
      <ForceGraph3D
        ref={fgRef}
        numDimensions={2}
        graphData={gData}
        width={width}
        height={height}
        nodeId={"id"}
        nodeVal={"size"}
        nodeLabel={"id"}
        nodeAutoColorBy={"group"}
        nodeVisibility={"isVisible"}
        nodeOpacity={1}
        linkSource={"source"}
        linkTarget={"target"}
        linkDirectionalArrowLength={12}
        linkDirectionalArrowRelPos={0.75}
        linkOpacity={0.5}
        linkWidth={3}
        linkVisibility={"isVisible"}
        //dagMode={"radialin"}
        //onDagError={(error) => console.error(error)}
        onNodeClick={onNodeClick}
        extraRenderers={extraRenderers}
        nodeThreeObject={nodeToHTML}
        //nodeThreeObjectExtend={true}
        onNodeDragEnd={(node) => {
          node.fx = node.x;
          node.fy = node.y;
          node.fz = node.z;
        }}
      />
    </div>
  );
}
