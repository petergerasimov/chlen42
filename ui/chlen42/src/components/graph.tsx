"use client";
import ReactFlow, { Background, BackgroundVariant } from "reactflow";
import "reactflow/dist/style.css";

//overwrite some css
import "./graph.css";

import CustomEdge from "./CustomEdge";
import CustomNode from "./CustomNode";
import ArticleNode from "./ArticleNode";
import { shallow } from "zustand/shallow";
import useStore, { selector } from "./store";

const edgeTypes = {
  "custom-edge": CustomEdge,
};
const nodeTypes = {
  "custom-node": CustomNode,
  "article-node": ArticleNode,
};

export default function Graph() {
  const { nodes, edges, onNodesChange, onEdgesChange } = useStore(selector, shallow);

  return (
    <div className="w-full h-screen">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        edgeTypes={edgeTypes}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background color="darkgray" variant={BackgroundVariant.Dots} />
      </ReactFlow>
    </div>
  );
}
