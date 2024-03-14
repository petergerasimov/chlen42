"use client";
import { useState, useRef, useLayoutEffect, useEffect } from "react";
import { ForceGraph3D } from "react-force-graph";
import LawData from "../../public/parsed.json";
import { CSS2DObject, CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";

export default function Graph({ graphData }: { graphData: any }) {
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [gData, setGData] = useState(graphData);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef();

  useLayoutEffect(() => {
    if (containerRef.current === null) return;

    setWidth(containerRef.current.offsetWidth);
    setHeight(containerRef.current.offsetHeight);
  }, []);

  // useEffect(() => {
  //   const fg = fgRef.current;

  //   if (!fg) return;

  //   // Deactivate existing forces
  //   fg.d3Force("center", null);
  //   fg.d3Force("charge", null);

  //   // Add collision and bounding box forces
  //   fg.d3Force("collide", d3.forceCollide(4));
  //   fg.d3Force("box", () => {
  //     const SQUARE_HALF_SIDE = N * 2;

  //     nodes.forEach((node) => {
  //       const x = node.x || 0,
  //         y = node.y || 0;

  //       // bounce on box walls
  //       if (Math.abs(x) > SQUARE_HALF_SIDE) {
  //         node.vx *= -1;
  //       }
  //       if (Math.abs(y) > SQUARE_HALF_SIDE) {
  //         node.vy *= -1;
  //       }
  //     });
  //   });

  //   // Generate nodes
  //   const N = 80;
  //   const nodes = [...Array(N).keys()].map(() => ({
  //     // Initial velocity in random direction
  //     vx: Math.random() * 2 - 1,
  //     vy: Math.random() * 2 - 1,
  //   }));

  //   setGData({ nodes, links: [] });
  // }, []);

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

    const articleEl = document.createElement("div");
    articleEl.textContent = article.meta.text;

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

    return articleEl;
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
    if (selectedNodes.includes(node.id)) {
      resetNodes();
      return;
    }

    const neighbors = new Set();
    neighbors.add(node.id);

    setSelectedNodes([node.id, ...selectedNodes]);
    for (const link of graphData.links) {
      //console.log(link.source.id, node.id);
      if (link.source.id === node.id) {
        neighbors.add(link.target.id);
        link.isVisible = true;
      } else {
        link.isVisible = false;
      }
    }

    for (const n of graphData.nodes) {
      if (!neighbors.has(n.id)) {
        n.isVisible = false;
      } else {
        n.isVisible = true;
        n.color = 0xff0000;
      }
    }

    setGData({ ...graphData });
  };

  const nodeToHTML = (node) => {
    let elem;
    if (selectedNodes.includes(node.id)) {
      elem = constructArticleComponents(node.id);
      console.log("CUSTOM ELEME", elem);
    } else {
      console.log(node.id);
      elem = document.createElement("div");
      elem.textContent = node.id;
      elem.style.color = node.color;
      elem.className = "node-label";
    }

    return new CSS2DObject(elem);
  };

  const extraRenderers = [new CSS2DRenderer()];

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
        linkDirectionalArrowLength={8}
        linkDirectionalArrowRelPos={1}
        linkVisibility={"isVisible"}
        //dagMode={"radialin"}
        //onDagError={(error) => console.error(error)}
        onNodeClick={onNodeClick}
        extraRenderers={extraRenderers}
        nodeThreeObject={nodeToHTML}
        nodeThreeObjectExtend={true}
        onNodeDragEnd={(node) => {
          node.fx = node.x;
          node.fy = node.y;
          node.fz = node.z;
        }}
      />
    </div>
  );
}
