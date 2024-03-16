import Graph from "@/components/graph";
import { ChatBox } from "@/components/chat-box";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col bg-gray-100 items-center justify-between">
      <Graph></Graph>
      <div
        className="fixed top-0 h-2/4 right-0 p-4 bg-zinc-400/80 shadow-md max-w-xl rounded-bl-xl resize"
        style={{
          direction: "rtl",
          overflow: "auto",
        }}
      >
        <ChatBox />
      </div>
    </main>
  );
}
