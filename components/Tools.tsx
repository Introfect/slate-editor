import { ToolType } from "@/utils/constants";
import React from "react";

type Props = {
  tool: ToolType;
  selectedTool: number;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  insertBlock: Function;
};

function Tools({ tool, selectedTool, insertBlock }: Props) {
  return (
    <li className="w-full">
      <button
        className={`flex items-center px-2 py-1 hover:bg-gray-200 ${
          selectedTool == tool.id ? "bg-red-500" : ""
        }`}
        onClick={() => insertBlock(tool.value)}
      >
        <span className="mr-2 bg-gray-400 p-2">{tool.icon}</span>
        <p>{tool.name}</p>
      </button>
    </li>
  );
}

export default Tools;
