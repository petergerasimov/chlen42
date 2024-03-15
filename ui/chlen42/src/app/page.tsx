import Graph from "@/components/graph";
import GraphData from "../../public/graph.json";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-between">
      <Graph graphData={GraphData}></Graph>
      <div className="absolute top-10 right-10 bg-black/60 rounded-xl">
        <div>
          {/* <p>Num Dimensions: </p>
          <input type="radio" name="dimensions" value="1" />
          <input type="radio" name="dimensions" value="2" />
          <input type="radio" name="dimensions" value="3" /> */}
        </div>
      </div>
    </main>
  );
}
