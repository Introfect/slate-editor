import { RenderElementProps } from "slate-react";
import BlockWrapper from "../BlockWrapper";

const ParagraphElement = (props: RenderElementProps) => {
  return (
    <BlockWrapper {...props}>
      <p {...props.attributes}>{props.children}</p>
    </BlockWrapper>
  );
};

export default ParagraphElement;
