import { Handle, Position } from "reactflow";
import { shallow } from "zustand/shallow";
import useStore, { findArticle } from "./store";
const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  updateNodeType: state.updateNodeType,
});
export default function CustomNode({ data }) {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, updateNodeType } = useStore(selector, shallow);
  //onsole.log(data, findArticle(data.id));

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div
        className="bg-white rounded-full aspect-square text-black flex items-center p-1 border border-black cursor-pointer"
        onClick={() => {
          updateNodeType(data.label, "article-node", findArticle(data.label));
        }}
      >
        {data.label}
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
    </>
  );
}
