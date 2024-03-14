"use client";
import { useState, useRef, useLayoutEffect, useEffect } from "react";
import { ForceGraph3D } from "react-force-graph";
import * as d3 from "d3-force";

export default function Graph({ graphData }: { graphData: any }) {
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [gData, setGData] = useState(graphData);
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

  return (
    <div className="w-full h-full" ref={containerRef}>
      <ForceGraph3D
        ref={fgRef}
        numDimensions={2}
        graphData={graphData}
        width={width}
        height={height}
        nodeId={"id"}
        nodeVal={"size"}
        nodeLabel={"id"}
        nodeAutoColorBy={"group"}
        nodeOpacity={1}
        linkSource={"source"}
        linkTarget={"target"}
        linkDirectionalArrowLength={8}
        linkDirectionalArrowRelPos={1}
        dagMode={"radialin"}
        onDagError={(error) => console.error(error)}
      />
    </div>
  );
}
