/* eslint-disable @next/next/no-img-element */
import { RenderElementProps } from "slate-react";

const ImageElement = ({
  attributes,
  children,
  element,
}: RenderElementProps) => {
  console.log(element, "attributes");
  if (element.type === "image")
    return (
      <div {...attributes} className="my-4">
        <div contentEditable={false}>
          <img
            src={element.src}
            alt="Slate Image"
            className="w-96 h-auto rounded-lg overflow-hidden"
          />
        </div>
        {children}
      </div>
    );
};
export default ImageElement;
