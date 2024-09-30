/* eslint-disable @next/next/no-img-element */
import { RenderElementProps } from "slate-react";
import BlockWrapper from "./BlockWrapper";

const ImageElement = (props: RenderElementProps) => {
  if (props.element.type !== "image") {
    throw new Error("The element must be Image element");
  }

  return (
    <BlockWrapper {...props}>
      <div {...props.attributes} className="my-4">
        <div contentEditable={false}>
          <img
            src={props.element.src}
            alt="Slate Image"
            className="w-96 h-auto rounded-lg overflow-hidden"
          />
        </div>
        {props.children}
      </div>
    </BlockWrapper>
  );
};
export default ImageElement;
