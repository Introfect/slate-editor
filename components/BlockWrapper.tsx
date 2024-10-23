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
  const handleImageReplace = () => {
    const path = ReactEditor.findPath(editor, element);
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    fileInput.onchange = () => {
      const file = fileInput.files?.[0];
      if (file) {
        const reader = new FileReader();

        reader.onload = () => {
          const url = reader.result;
          console.log({ url: url });
          if (url) {
            Transforms.setNodes(editor, { src: url.toString() }, { at: path });
          }
        };

        reader.readAsDataURL(file);
      }
    };

    fileInput.click();
    setShowOptions(false);
  };
  const isImage = element?.type === "image" ? true : false;

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
            type="button"
            className="block text-left w-full px-2 py-1 hover:bg-gray-200"
            onClick={deleteBlock}
          >
            Delete Block
          </button>
          {isImage ? (
            <button
              type="button"
              className="absolute right-0 mt-2 bg-white border shadow-lg py-2 rounded-md"
              onClick={handleImageReplace}
            >
              Replace
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default BlockWrapper;
