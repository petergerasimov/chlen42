"use client";
import { useState, useRef, useLayoutEffect, useEffect, use } from "react";
import { ForceGraph3D } from "react-force-graph";
import LawData from "../../public/parsed.json";
import { CSS3DObject, CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer";
import ReactFlow, { useEdgesState, useNodesState } from "reactflow";
import "reactflow/dist/style.css";
import * as THREE from "three";

//overwrite some css
import "./graph.css";

interface NodesMap {
  [key: string]: {
    isSelected: boolean;
    draggableBox: THREE.Mesh;
    iframe?: HTMLDivElement;
  };
}
import CustomEdge from "./CustomEdge";

const edgeTypes = {
  "custom-edge": CustomEdge,
};

export default function Graph({ graphData }: { graphData: any }) {
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [gData, setGData] = useState(graphData);
  const [selectedNodes, setSelectedNodes] = useState<NodesMap>({});
  const containerRef = useRef<HTMLDivElement>(null);
  // const fgRef = useRef();

  // for (const node of gData.nodes) {
  //   node.draggable = true;
  //   node.dragging = true;
  // }

  // useLayoutEffect(() => {
  //   if (containerRef.current === null) return;

  //   setWidth(containerRef.current.offsetWidth);
  //   setHeight(containerRef.current.offsetHeight);
  // }, []);

  // const findArticle = (id: string) => {
  //   for (const topic of LawData as Topic[]) {
  //     for (const article of topic) {
  //       if (article.id === id) {
  //         return article;
  //       }
  //     }
  //   }

  //   return null;
  // };

  // const constructArticleComponents = (id: string) => {
  //   const article = findArticle(id);

  //   if (!article) {
  //     return;
  //   }

  //   const div = document.createElement("div");
  //   const iframe = document.createElement("iframe");
  //   iframe.style.backgroundColor = "white";
  //   iframe.style.resize = "both";
  //   iframe.id = "article_iframe";
  //   iframe.src = "/article";

  //   div.appendChild(iframe);
  //   iframe.onload = () => {
  //     iframe.contentWindow.postMessage({ type: "article", article }, "http://localhost:3000");

  //     iframe.contentWindow.onresize = (ev) => {
  //       const width = iframe.contentWindow.innerWidth;
  //       const height = iframe.contentWindow.innerHeight;

  //       const box = selectedNodes[id].draggableBox.geometry;
  //       const boxWidth = box.parameters.width;
  //       const boxHeight = box.parameters.height;

  //       const scaleX = width / boxWidth;
  //       const scaleY = height / boxHeight;

  //       selectedNodes[id].draggableBox.scale.set(scaleX, scaleY, 1);
  //     };
  //   };
  //   return div;
  // };

  // const resetNodes = () => {
  //   for (const node of gData.nodes) {
  //     node.isVisible = true;
  //     node.color = 0xa2cade;
  //   }

  //   for (const link of gData.links) {
  //     link.isVisible = true;
  //   }

  //   setSelectedNodes([]);
  //   setGData({ ...gData });
  // };

  // const onNodeClick = (node) => {
  //   console.log(fgRef);
  //   if (selectedNodes[node.id]) {
  //     delete selectedNodes[node.id];
  //   } else {
  //     const box = new THREE.BoxGeometry(300, 170, 1);
  //     const boxMesh = new THREE.Mesh(box, new THREE.MeshBasicMaterial({ color: 0x52525b }));
  //     boxMesh.position.set(0, 10, 0);

  //     selectedNodes[node.id] = {
  //       isSelected: true,
  //       draggableBox: boxMesh,
  //     };
  //   }

  //   //selectedNodes[node.id] = !selectedNodes[node.id];
  //   console.log(Object.keys(selectedNodes));
  //   if (Object.keys(selectedNodes).length == 0) {
  //     resetNodes();
  //     return;
  //   }

  //   const neighbors = new Set();
  //   neighbors.add(node.id);

  //   for (const link of graphData.links) {
  //     //console.log(link.source.id, node.id);
  //     if (selectedNodes[link.source.id] || selectedNodes[link.target.id]) {
  //       neighbors.add(selectedNodes[link.source.id] ? link.target.id : link.source.id);
  //       link.isVisible = true;
  //       // link.color = 0xff0000;
  //       // link.__lineObj.material.color = new THREE.Color(0xff0000);
  //       // link.linkDirectionalParticles = 1;
  //       // console.log(link);
  //     } else {
  //       link.isVisible = false;
  //       //link.opacity = 0.5;
  //     }
  //   }

  //   for (const n of graphData.nodes) {
  //     if (selectedNodes[n.id] || neighbors.has(n.id)) {
  //       n.isVisible = true;
  //       n.color = 0xff0000;
  //       n.fx = n.x;
  //       n.fy = n.y;
  //       n.fz = n.z;
  //     } else {
  //       n.isVisible = false;
  //       //n.opacity = 0.1;
  //     }
  //   }

  //   setSelectedNodes(selectedNodes);
  //   setGData((graphData) => ({ ...graphData }));
  //   //fgRef.current.refresh();
  // };

  // const nodeToHTML = (node) => {
  //   let elem;
  //   if (selectedNodes[node.id]) {
  //     if (selectedNodes[node.id].iframe) {
  //       elem = selectedNodes[node.id].iframe;
  //     } else {
  //       elem = constructArticleComponents(node.id);
  //       selectedNodes[node.id].iframe = elem;
  //     }
  //     //console.log("CUSTOM ELEME", elem);
  //   } else {
  //     //create three js sphere
  //     const geometry = new THREE.SphereGeometry(node.size, 10, 10);
  //     //console.log(node.opacity);
  //     const material = new THREE.MeshBasicMaterial({
  //       color: node.color,
  //       opacity: node.opacity || 1,
  //       transparent: true,
  //     });
  //     return new THREE.Mesh(geometry, material);
  //   }

  //   // console.log(elem?.offsetWidth, elem?.offsetHeight);
  //   // const box = new THREE.BoxGeometry(300, 170, 1);
  //   // const boxMesh = new THREE.Mesh(box, new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
  //   // boxMesh.position.set(0, 10, 0);
  //   // boxMesh.geo

  //   const group = new THREE.Object3D();
  //   group.add(selectedNodes[node.id].draggableBox);
  //   group.add(new CSS3DObject(elem));
  //   return group;
  // };

  // const extraRenderers = [new CSS3DRenderer()];

  // const fixNodes = () => {
  //   console.log(gData.nodes[0]);
  //   for (const node of gData.nodes) {
  //     node.fx = node.x;
  //     node.fy = node.y;
  //     node.fz = node.z;
  //   }
  //   setGData({ ...gData });
  // };

  // const [dims, setDims] = useState<1 | 2 | 3>(2);
  // useEffect(() => {
  //   window.onkeydown = (ev) => {
  //     if (ev.key === "d") {
  //       const newDim = dims === 3 ? 1 : dims === 2 ? 3 : 2;
  //       setDims(newDim);
  //     }
  //   };

  //   return () => {
  //     window.onkeydown = null;
  //   };
  // }, [dims]);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    setNodes(gData.nodes);

    for (const link of gData.links) {
      link.type = "custom-edge";
    }
    setEdges(gData.links);
  }, []);

  return (
    <div className="w-full h-screen" ref={containerRef}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        edgeTypes={edgeTypes}
        fitView
      />
    </div>
  );
}
