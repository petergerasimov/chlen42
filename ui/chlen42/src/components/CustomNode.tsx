import { Handle, Position } from "reactflow";
import { shallow } from "zustand/shallow";
import useStore, { findArticle, selector } from "./store";

interface CustomNodeData {
  label: string;
  size: number;
  id: string;
  color?: string;
}

export default function CustomNode({ data }: { data: CustomNodeData }) {
  const { updateNodeType } = useStore(selector, shallow);
  // console.log(data);

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div
        className={`bg-white rounded-full aspect-square justify-center text-black flex items-center p-1 border border-black cursor-pointer`}
        style={{ width: `${40 + data.size * 3}px`, backgroundColor: data.color }}
        onClick={() => {
          updateNodeType([data.label], "article-node");
        }}
      >
        {data.label}
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
    </>
  );
}
