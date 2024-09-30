/* eslint-disable @next/next/no-img-element */
import { RenderElementProps } from "slate-react";

const ImageElement = ({
  attributes,
  children,
  element,
}: RenderElementProps) => {
  console.log(element, "attributes");
  return (
    <div {...attributes} className="my-4">
      <div contentEditable={false}>
        <img
          src={element.src}
          alt="Slate Image"
          className="max-w-full h-auto"
        />
      </div>
      {children}
    </div>
  );
};

export default ImageElement;
