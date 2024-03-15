import Graph from "@/components/graph";
import GraphData from "../../public/flow-graph.json";
import { ChatBox } from "@/components/chat-box";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col bg-gray-100 items-center justify-between">
      <Graph graphData={GraphData}></Graph>
      <div className="absolute top-10 right-10 bg-black/60 rounded-xl">
        <div>
          {/* <p>Num Dimensions: </p>
          <input type="radio" name="dimensions" value="1" />
          <input type="radio" name="dimensions" value="2" />
          <input type="radio" name="dimensions" value="3" /> */}
        </div>
      </div>
      <div className="fixed top-0 h-2/4 right-0 p-4 bg-gray-200 shadow-md max-w-md">
        <ChatBox />
      </div>
    </main>
  );
}
