import React from "react";

type ChatBubbleProps = {
  name: string;
  message: string;
  other?: boolean;
};

function ChatBubble(props: ChatBubbleProps) {
  return (
    <div
      className={`flex flex-row place-content-${
        props.other ? "start" : "end"
      } gap-4`}
    >
      <div className="rounded-lg bg-gray-100 dark:bg-gray-800 p-4 flex gap-2">
        <div className="text-sm leading-none">
          <p className="font-semibold">{props.name}</p>
          <p>{props.message}</p>
        </div>
      </div>
    </div>
  );
}

export default ChatBubble;
