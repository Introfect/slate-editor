import React from "react";
import { RenderElementProps } from "slate-react";
import BlockWrapper from "../BlockWrapper";

function LIstItem(props: RenderElementProps) {
  return (
    <BlockWrapper {...props.attributes} {...props.children} {...props.element}>
      <li {...props.attributes}>{props.children}</li>
    </BlockWrapper>
  );
}

export default LIstItem;
