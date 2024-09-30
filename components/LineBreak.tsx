import { RenderElementProps } from "slate-react";
import BlockWrapper from "./BlockWrapper";

function LineBreak(props: RenderElementProps) {
  return (
    <BlockWrapper {...props}>
      <hr
        {...props.attributes}
        className=" w-full font-bold text-slate-700"
      ></hr>
    </BlockWrapper>
  );
}

export default LineBreak;
