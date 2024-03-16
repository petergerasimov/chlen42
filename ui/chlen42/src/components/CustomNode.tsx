import { Handle, Position } from "reactflow";
import { shallow } from "zustand/shallow";
import useStore, { findArticle, selector } from "./store";

interface CustomNodeData {
  label: string;
  id: string;
}

export default function CustomNode({ data }: { data: CustomNodeData }) {
  const { updateNodeType } = useStore(selector, shallow);
  //onsole.log(data, findArticle(data.id));

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div
        className="bg-white rounded-full aspect-square w-10 justify-center text-black flex items-center p-1 border border-black cursor-pointer"
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
