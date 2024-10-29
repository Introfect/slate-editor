import React from "react";
import { RenderElementProps } from "slate-react";

function Body(props: RenderElementProps) {
  return <tbody {...props.attributes}>{...props.children}</tbody>;
}

export default Body;
