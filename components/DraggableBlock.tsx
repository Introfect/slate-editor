import { MenuSquare } from "lucide-react";
import { useDrag } from "react-dnd";
import { RenderElementProps } from "slate-react";

export const DraggableBlock = ({ element, children }: RenderElementProps) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "block",
    item: { id: element.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={dragRef}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="flex items-center space-x-2 cursor-move"
    >
      <span>
        <MenuSquare className="text-white w-4" />
      </span>{" "}
      {/* Drag icon */}
      <div>{children}</div>
    </div>
  );
};
