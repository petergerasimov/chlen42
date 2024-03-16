import { Handle, Position, NodeResizer } from "reactflow";
import { FaClockRotateLeft } from "react-icons/fa6";
import { shallow } from "zustand/shallow";
import useStore, { selector, findArticle } from "./store";
import { FaTimes } from "react-icons/fa";

type DataNode = Article | Alinea | Point | Letter;

const idFormatters = {
  0: (text: string) => `Чл. ${text}.`,
  1: (text: string) => `(${text})`,
  2: (text: string) => `${text}.`,
  3: (text: string) => `${text})`,
};
type idFormatterKey = keyof typeof idFormatters;

export default function ArticleNode({ data }) {
  const getDataNodeChildren = (data: DataNode): DataNode[] => {
    if (Object.keys(data).includes("alineas")) {
      return (data as Article).alineas;
    } else if (Object.keys(data).includes("points")) {
      return (data as Alinea).points;
    } else if (Object.keys(data).includes("letters")) {
      return (data as Point).letters;
    }

    return [];
  };

  const buildLinkedText = (links: Link[]) => {
    return (
      <p>
        {links.map(([text, link], i) => {
          if (!link || link === data.label) return text;

          return (
            <a
              key={i}
              className="font-bold text-sky-600 cursor-pointer"
              onClick={() => {
                updateNodeType(link, "article-node", findArticle(link));
              }}
            >
              {text}
            </a>
          );
        })}
      </p>
    );
  };

  const constructDataNodeComponent = (data: DataNode, depth: idFormatterKey = 0) => {
    const idFormatter = idFormatters[depth];
    const children = getDataNodeChildren(data);
    //console.log("TONI TEST", data, data.meta);

    return (
      <div key={data.id} className="ml-4">
        <div className="relative">
          {data.meta.dv && <FaClockRotateLeft className="text-sm text-black/50 peer absolute -left-5 top-1" />}
          <b>{idFormatter(data.id)} </b>
          {data.meta.dv && (
            <div className="absolute hidden peer-hover:block left-0 rounded p-2 bg-zinc-600 text-white">
              {data.meta.dv}
            </div>
          )}
          <span>{data.linked ? buildLinkedText(data.linked) : data.meta.text}</span>
        </div>
        {children.map((child) => {
          return constructDataNodeComponent(child, (depth + 1) as idFormatterKey);
        })}
      </div>
    );
  };
  const { updateNodeType } = useStore(selector, shallow);

  return (
    <div className="rounded-xl shadow-xl">
      <Handle type="target" position={Position.Bottom} />
      <div className="w-full h-10 bg-slate-500 drag-handle cursor-grab rounded-t-xl">
        <FaTimes
          className="text-white absolute right-2 top-2 cursor-pointer"
          onClick={() => updateNodeType(data.label, "custom-node", null)}
        />
      </div>
      <div className="bg-white text-black w-[500px] h-[250px] overflow-y-scroll nodrag resize rounded-b-xl pl-2 styled-scrollbar">
        {/* <NodeResizer maxHeight={500} /> */}
        {data.article ? constructDataNodeComponent(data.article) : <div>Loading...</div>}
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
    </div>
  );
}
