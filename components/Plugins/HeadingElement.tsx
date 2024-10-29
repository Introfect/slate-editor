import { RenderElementProps } from "slate-react";
import BlockWrapper from "../BlockWrapper";

const HeadingElement = (props: RenderElementProps) => {
  return (
    <BlockWrapper {...props}>
      <p {...props.attributes} className="text-3xl font-bold text-slate-300">
        {props.children}
      </p>
    </BlockWrapper>
  );
};

export default HeadingElement;
