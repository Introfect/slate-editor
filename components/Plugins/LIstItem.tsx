import React from "react";
import { RenderElementProps } from "slate-react";

function LIstItem(props: RenderElementProps) {
  return <li {...props.attributes}>{props.children}</li>;
}

export default LIstItem;
