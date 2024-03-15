"use client";

import { create } from "zustand";
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";

import {
  forceSimulation,
  forceManyBody,
  forceLink,
  forceX,
  forceY,
} from "d3-force";
import GraphData from "../../public/flow-graph.json";

const simulation = forceSimulation(GraphData.nodes)
  .force("charge", forceManyBody().strength(-120))
  .force(
    "link",
    forceLink(GraphData.links).distance(500).strength(0.2).iterations(15)
  )
  .force("x", forceX())
  .force("y", forceY())
  .stop();

simulation.tick(
  Math.ceil(
    Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())
  )
);

for (const node of GraphData.nodes) {
  node.type = "custom-node";
  node.position.x = node.x;
  node.position.y = node.y;
}
for (const link of GraphData.links) {
  link.type = "custom-edge";
  link.source = link.source.id;
  link.target = link.target.id;
}

const initialNodes = GraphData.nodes;
const initialEdges = GraphData.links;

type RFState = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
};

const edgesById = initialEdges.reduce((acc, edge) => {
  acc[edge.id] = edge;
  return acc;
}, {});
const nodesById = initialNodes.reduce((acc, node) => {
  acc[node.id] = node;
  return acc;
}, {});
const selectedNodes: { [key: string]: boolean } = {};

export const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  updateNodeType: state.updateNodeType,
});

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useStore = create<RFState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  edgesById,
  nodesById,
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },
  setNodes: (nodes: Node[]) => {
    set({ nodes });
  },
  setEdges: (edges: Edge[]) => {
    set({ edges });
  },
  updateNodeType: (nodeId: string, type: string, article: Article) => {
    let hideAll = false;
    if (Object.keys(selectedNodes).length === 0) {
      hideAll = true;
    }

    if (selectedNodes[nodeId]) {
      delete selectedNodes[nodeId];

      //reset all nodes
      if (Object.keys(selectedNodes).length === 0) {
        set({
          nodes: get().nodes.map((node) => {
            return { ...node, hidden: false, type: "custom-node" };
          }),
          edges: get().edges.map((edge) => {
            return { ...edge, hidden: false };
          }),
        });
      }
    } else {
      selectedNodes[nodeId] = true;
      for (const node of get().edges) {
        node.hidden = true;
      }
    }

    //console.log("TEST");
    //console.log(selectedNodes);
    const neightbours = get()
      .edges.filter(
        (edge) => selectedNodes[edge.source] || selectedNodes[edge.target]
      )
      .map((edge) => (edge.source === nodeId ? edge.target : edge.source));

    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          if (selectedNodes[node.id]) {
            return {
              ...node,
              type,
              dragHandle: ".drag-handle",
              data: { ...node.data, article },
            };
          }
          return { ...node, type: "custom-node" };
        } else if (selectedNodes[node.id]) {
          return node;
        } else if (neightbours.includes(node.id)) {
          return { ...node, type: "custom-node", hidden: false };
        }

        return hideAll ? { ...node, hidden: true } : node;
      }),
      edges: get().edges.map((edge) => {
        if (
          (neightbours.includes(edge.source) || selectedNodes[edge.source]) &&
          (neightbours.includes(edge.target) || selectedNodes[edge.target])
        ) {
          return { ...edge, hidden: false };
        }

        return hideAll ? { ...edge, hidden: true } : edge;
      }),
    });

    // set({
    //   nodes: get().nodes.map((node) => {
    //     console.log(2);
    //     if (node.id === nodeId) {
    //       //console.log(nodeId, node, node.id === nodeId);
    //       // it's important to create a new object here, to inform React Flow about the changes
    //       return { ...node, type, hidden: false, data: { ...node.data, article } };
    //     } else if (neightbours.includes(node.id) || selectedNodes[node.id]) {
    //       //pass
    //     } else {
    //       return { ...node, hidden: true };
    //     }

    //     return { ...node, hidden: false };
    //   }),
    //   edges: get().edges.map((edge) => {
    //     //console.log("1");
    //     if (selectedNodes[edge.source] || selectedNodes[edge.target]) {
    //       return { ...edge, hidden: false };
    //     }
    //     return { ...edge, hidden: true };
    //   }),
    // });
  },
}));

import LawData from "../../public/parsed.json";

export const findArticle = (id: string) => {
  for (const topic of LawData as Topic[]) {
    for (const article of topic) {
      console.log(article.id, id);
      if (article.id === id) {
        return article;
      }
    }
  }

  return null;
};

export default useStore;
