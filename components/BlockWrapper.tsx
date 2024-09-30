import { useState } from "react";
import { Editor, Transforms } from "slate";
import { RenderElementProps, useSlate } from "slate-react";

const BlockWrapper = ({
  attributes,
  children,
  element,
}: RenderElementProps) => {
  const editor = useSlate();
  const [showOptions, setShowOptions] = useState(false);

  const deleteBlock = () => {
    const path = Editor.path(editor, element);
    Transforms.removeNodes(editor, { at: path });
  };

  return (
    <div {...attributes} className="relative group">
      {children}
      <button
        className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded-md text-sm"
        onClick={() => setShowOptions(!showOptions)}
      >
        ⋮
      </button>
      {showOptions && (
        <div className="absolute right-0 mt-2 w-32 bg-white border shadow-lg p-2 rounded-md">
          <button
            className="block w-full text-left px-2 py-1 hover:bg-gray-200"
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
