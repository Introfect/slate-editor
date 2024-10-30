"use client";
import { forwardRef, useRef } from "react";
import { useDrag } from "react-dnd";

// eslint-disable-next-line react/display-name
const DragButton = forwardRef<HTMLButtonElement, { onClick?: () => void }>(
  ({ onClick }) => {
    const buttonRef = useRef<HTMLButtonElement>(null); // Create a ref for the button

    const [{ isDragging }, drag] = useDrag({
      type: "BLOCK",
      item: {
        /* you can add any data you want here */
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    // Connect the button ref to the drag source
    drag(buttonRef);

    return (
      <button
        ref={buttonRef} // Use the buttonRef
        onClick={onClick}
        style={{ opacity: isDragging ? 0.5 : 1, marginBottom: "5px" }}
      >
        Drag Me
      </button>
    );
  }
);
export default DragButton;
