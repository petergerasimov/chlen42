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
        className="bg-white rounded-full aspect-square w-10 justify-center text-black flex items-center p-1 border border-black cursor-pointer"
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

/*
SELECT
CURRENT_DATE as date,
TC.chain_id,
COUNT(*) as total_calls,
COUNT(CASE WHEN TC.profit >= 100 THEN 1 END) as total_calls_2x,
SUM(TC.profit) as max_gains
FROM global_leaderboard GL
JOIN (
    SELECT id, chain_id, profit, date_time FROM TokenCalls 
    UNION ALL 
    SELECT id, chain_id, profit, date_time FROM TokenCallsArchive
) AS TC ON GL.call_id = TC.id
WHERE TC.date_time > CURRENT_TIMESTAMP - INTERVAL 1 DAY
GROUP BY TC.chain_id;
*/
