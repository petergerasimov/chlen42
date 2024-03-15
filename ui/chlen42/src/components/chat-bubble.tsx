import React from "react";

type ChatBubbleProps = {
  name: string;
  message: string;
  left?: boolean;
};

function ChatBubble(props: ChatBubbleProps) {
  return (
    <div
      className={`flex justify-${
        props.left ? "start" : "end"
      } items-start gap-4`}
    >
      <div className="rounded-lg bg-gray-100 dark:bg-gray-800 p-4 flex items-center gap-2">
        <img
          alt="Avatar"
          className="rounded-full"
          height={40}
          src="/placeholder.svg"
          style={{
            aspectRatio: "40/40",
            objectFit: "cover",
          }}
          width={40}
        />
        <div className="text-sm leading-none">
          <p className="font-semibold">{props.name}</p>
          <p>{props.message}</p>
        </div>
      </div>
    </div>
  );
}

export default ChatBubble;
