import React from "react";
import { RenderElementProps } from "slate-react";

function TableHeaders(props: RenderElementProps) {
  return <th {...props.attributes}>{...props.children}</th>;
}

export default TableHeaders;
