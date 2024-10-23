import { RenderElementProps } from "slate-react";
import BlockWrapper from "../BlockWrapper";

function LineBreak(props: RenderElementProps) {
  return (
    <BlockWrapper {...props}>
      <div
        {...props.attributes}
        contentEditable={false}
        className=" w-full font-bold h-[2px] bg-gray-700/20 text-slate-700 my-4"
      >
        {props.children}
      </div>
    </BlockWrapper>
  );
}

export default LineBreak;
