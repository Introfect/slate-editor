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
    console.log(path, "path find");
    Transforms.removeNodes(editor, { at: path });
    setShowOptions(false);
  };

  return (
    <div {...attributes} className="relative group">
      {children}
      <button
        className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 px-2 py-1 rounded-md text-sm group cursor-pointer"
        onClick={() => setShowOptions(!showOptions)}
      >
        <EllipsisVertical />
      </button>
      {showOptions && (
        <div className="absolute right-0 mt-2 bg-white border shadow-lg py-2 rounded-md">
          <button
            className="block text-left w-full px-2 py-1 hover:bg-gray-200"
            onClick={deleteBlock}
          >
            Delete Block
          </button>
        </div>
      )}
    </div>
  );
};

export default BlockWrapper;
