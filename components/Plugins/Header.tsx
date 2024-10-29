import React from "react";
import { RenderElementProps } from "slate-react";

function Header(props: RenderElementProps) {
  return <thead {...props.attributes}>{...props.children}</thead>;
}

export default Header;
