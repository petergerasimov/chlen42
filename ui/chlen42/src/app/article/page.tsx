"use client";
import { useEffect, useState } from "react";
import { FaC, FaClockRotateLeft } from "react-icons/fa6";

import HardcodedArticle from "../../../public/166.json";
type DataNode = Article | Alinea | Point | Letter;

const idFormatters = {
  0: (text: string) => `Чл. ${text}.`,
  1: (text: string) => `(${text})`,
  2: (text: string) => `${text}.`,
  3: (text: string) => `${text})`,
};
type idFormatterKey = keyof typeof idFormatters;

export default function ArticlePage() {
  const [article, setArticle] = useState<Article>();

  const handleMessage = (msg: MessageEvent) => {
    setArticle(msg.data);
  };

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

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
          <span>{data.meta.text}</span>
        </div>
        {children.map((child) => {
          return constructDataNodeComponent(child, (depth + 1) as idFormatterKey);
        })}
      </div>
    );
  };

  // TODO make recursive and style by depth
  return (
    <div className="bg-white text-black">{article ? constructDataNodeComponent(article) : <div>Loading...</div>}</div>
  );
}
