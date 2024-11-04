import { useDrop } from "react-dnd";
import { Transforms } from "slate";
import { ReactEditor } from "slate-react";

export const DroppableEditor = ({ editor, children }) => {
  const [, drop] = useDrop({
    accept: "block",
    drop: (item) => {
      const dragIndex = editor.children.findIndex(
        (node) => node.id === item.id
      );
      const hoverIndex = editor.selection?.focus?.path[0];

      if (dragIndex !== hoverIndex) {
        Transforms.moveNodes(editor, {
          at: [dragIndex],
          to: [hoverIndex],
        });
        ReactEditor.focus(editor);
      }
    },
  });

  return drop(<div className="p-4">{children}</div>);
};
