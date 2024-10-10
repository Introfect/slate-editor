import { ToolType } from "@/utils/constants";
import React from "react";
import { useSlate } from "slate-react";
import { twMerge } from "tailwind-merge";

type Props = {
  tool: ToolType;
  selectedTool: number;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  insertBlock: Function;
  setShowToolbar: React.Dispatch<React.SetStateAction<boolean>>;
};

function Tools({ tool, selectedTool, insertBlock, setShowToolbar }: Props) {
  const editor = useSlate();
  const handleBlockInsert = (
    e: React.MouseEvent<HTMLButtonElement>,
    value: string
  ) => {
    e.preventDefault();
    insertBlock({ type: value, setShowToolbar, editor, text: "" });
  };
  const arrowSelect = selectedTool == tool.id ? true : false;
  const iconColor = arrowSelect ? "text-white" : "text-black";
  return (
    <li className="w-full">
      <button
        className={`flex w-full items-center rounded-md px-2 py-1 hover:bg-gray-200 group ${
          arrowSelect ? "bg-gray-300" : ""
        }`}
        onClick={(e) => handleBlockInsert(e, tool.value)}
      >
        <span className={twMerge(`mr-2 p-2 text-black`, iconColor)}>
          {tool.icon}
        </span>
        <p>{tool.name}</p>
      </button>
    </li>
  );
}

export default Tools;
