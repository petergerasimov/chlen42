import React from "react";

type ChatBubbleProps = {
  name: string;
  message: string | React.ReactNode;
  other?: boolean;
};

function ChatBubble(props: ChatBubbleProps) {
  return (
    <div
      className={`flex flex-row self-${props.other ? "start" : "end"} gap-4`}
      style={{
        alignSelf: props.other ? "flex-start" : "flex-end",
      }}
    >
      <div className={`rounded-lg ${props.other ? "bg-gray-700" : "bg-sky-600"} p-4 flex gap-2`}>
        <div className={`text-sm leading-none ${props.other ? "" : "text-right"}`}>
          <p className={`font-semibold`}>{props.name}</p>
          <p>{props.message}</p>
        </div>
      </div>
    </div>
  );
}

export default ChatBubble;
