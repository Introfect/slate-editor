import { ToolType } from "@/utils/constants";
import { useToolbarStore } from "@/utils/store";
import React from "react";
import { useSlate } from "slate-react";
import { twMerge } from "tailwind-merge";

type Props = {
  tool: ToolType;
  selectedTool: number;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  insertBlock: Function;
};

function Tools({ tool, selectedTool, insertBlock }: Props) {
  const editor = useSlate();
  const hideToolbar = useToolbarStore((state) => state.hideToolbar);

  const handleBlockInsert = (
    e: React.MouseEvent<HTMLLIElement>,
    value: string
  ) => {
    e.preventDefault();
    const location = editor.end;
    insertBlock({
      type: value,
      editor,
      location: location,
    });
    hideToolbar();
  };
  const arrowSelect = selectedTool == tool.id ? true : false;
  const iconColor = arrowSelect ? "text-white" : "text-black";
  return (
    <li className="w-full" onClick={(e) => handleBlockInsert(e, tool.value)}>
      <div
        className={`flex w-full items-center rounded-md px-2 py-1 hover:bg-gray-200 group ${
          arrowSelect ? "bg-gray-300" : ""
        }`}
      >
        <span className={twMerge(`mr-2 p-2 text-black`, iconColor)}>
          {tool.icon}
        </span>
        <p>{tool.name}</p>
      </div>
    </li>
  );
}

export default Tools;
