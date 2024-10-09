"use client";
import { useState } from "react";
import { Transforms } from "slate";
import { ReactEditor, RenderElementProps, useSlate } from "slate-react";
import { EllipsisVertical } from "lucide-react";
const BlockWrapper = ({
  attributes,
  element,
  children,
}: RenderElementProps) => {
  const editor = useSlate();
  const [showOptions, setShowOptions] = useState(false);

  const deleteBlock = () => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.removeNodes(editor, { at: path });
    setShowOptions(false);
  };
  const showReplace = element.type === "image" ? true : false;

  console.log(element, "Block options");
  const replaceImage = () => {
    insertBlock;
  };
  return (
    <div {...attributes} className="flex group">
      <button
        className="opacity-0 group-hover:opacity-100 px-2 py-1 rounded-md text-sm group cursor-pointer"
        onClick={() => setShowOptions(!showOptions)}
      >
        <EllipsisVertical />
      </button>
      {children}
      {showOptions && (
        <div className="absolute right-0 mt-2 bg-white border shadow-lg py-2 rounded-md">
          <button
            className="block text-left w-full px-2 py-1 hover:bg-gray-200"
            onClick={deleteBlock}
          >
            Delete Block
          </button>
          {showReplace ? (
            <button
              className="block text-left w-full px-2 py-1 hover:bg-gray-200"
              onClick={replaceImage}
            >
              Replace Image
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default BlockWrapper;
