"use client";
import { useState, useRef, useLayoutEffect, useEffect, use } from "react";
import { ForceGraph3D } from "react-force-graph";
import LawData from "../../public/parsed.json";
import { CSS3DObject, CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer";
import ReactFlow, { useEdgesState, useNodesState } from "reactflow";
import "reactflow/dist/style.css";
import * as THREE from "three";
import { forceSimulation, forceManyBody, forceLink, forceX, forceY } from "d3-force";
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
import CustomNode from "./CustomNode";
import ArticleNode from "./ArticleNode";

const edgeTypes = {
  "custom-edge": CustomEdge,
};
const nodeTypes = {
  "custom-node": CustomNode,
  "article-node": ArticleNode,
};

// import GraphData from "../../public/flow-graph.json";

// const simulation = forceSimulation(GraphData.nodes)
//   .force("charge", forceManyBody().strength(-120))
//   .force("link", forceLink(GraphData.links).distance(100).strength(1).iterations(15))
//   .force("x", forceX())
//   .force("y", forceY())
//   .stop();

// simulation.tick(Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())));

// for (const node of GraphData.nodes) {
//   node.type = "custom-node";
//   node.position.x = node.x;
//   node.position.y = node.y;
// }
// for (const link of GraphData.links) {
//   link.type = "custom-edge";
//   link.source = link.source.id;
//   link.target = link.target.id;
// }
import { shallow } from "zustand/shallow";
import useStore from "./store";

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  updateNodeType: state.updateNodeType,
});

export default function Graph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, updateNodeType } = useStore(selector, shallow);

  // console.log("ONEONE", GraphData);

  // useEffect(() => {
  //   setNodes(GraphData.nodes);
  //   setEdges(GraphData.links);
  // }, []);
  // console.log(JSON.stringify(gData.links));
  //console.log(gData.links);
  //setEdges(gData.links);

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

  const onNodeClick = (event, node) => {
    console.log("TONI", node, findArticle(node.id));
    const article = findArticle(node.id);
    updateNodeType(node.id, "article-node", article);
    console.log(node);
  };

  return (
    <div className="w-full h-screen" ref={containerRef}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        //onNodeClick={onNodeClick}
        edgeTypes={edgeTypes}
        nodeTypes={nodeTypes}
        fitView
      />
    </div>
  );
}
