import React from "react";
import { RenderElementProps } from "slate-react";
import BlockWrapper from "./BlockWrapper";

function UnorderdListPlugin(props: RenderElementProps) {
  return (
    <BlockWrapper {...props.attributes} {...props.children} {...props.element}>
      <ul className="list-disc" {...props.attributes}>
        {...props.children}
      </ul>
    </BlockWrapper>
  );
}

export default UnorderdListPlugin;
