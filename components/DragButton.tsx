"use client";
import { AlignJustify } from "lucide-react";
import { forwardRef, useRef } from "react";
import { useDrag } from "react-dnd";

// eslint-disable-next-line react/display-name
const DragButton = forwardRef<HTMLButtonElement, { onClick?: () => void }>(
  ({ onClick }) => {
    const buttonRef = useRef<HTMLButtonElement>(null);

    const [{ isDragging }, drag] = useDrag({
      type: "BLOCK",
      item: {},
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    drag(buttonRef);

    return (
      <button
        ref={buttonRef}
        onClick={onClick}
        style={{ opacity: isDragging ? 0.5 : 1, marginBottom: "5px" }}
      >
        <AlignJustify />
      </button>
    );
  }
);
export default DragButton;
