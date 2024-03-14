"use client";
import { useState, useRef, useLayoutEffect } from "react";
import { ForceGraph3D } from "react-force-graph";

export default function Graph({ graphData }: { graphData: any }) {
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (containerRef.current === null) return;

    setWidth(containerRef.current.offsetWidth);
    setHeight(containerRef.current.offsetHeight);
  }, []);

  return (
    <div className="w-full h-full" ref={containerRef}>
      <ForceGraph3D
        graphData={graphData}
        width={width}
        height={height}
        nodeId={"id"}
        nodeVal={"size"}
        nodeLabel={"id"}
        nodeAutoColorBy={"group"}
        linkSource={"source"}
        linkTarget={"target"}
        linkDirectionalArrowLength={4}
        linkDirectionalArrowRelPos={1}
      />
    </div>
  );
}
