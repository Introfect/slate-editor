import React from "react";
import { RenderElementProps } from "slate-react";
import BlockWrapper from "./BlockWrapper";

function UnorderdListPlugin(props: RenderElementProps) {
  return (
    <BlockWrapper {...props.attributes} {...props.children} {...props.element}>
      <ul {...props.attributes}>
        <li>{props.children}</li>
      </ul>
    </BlockWrapper>
  );
}

export default UnorderdListPlugin;
