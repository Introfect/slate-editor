import React from "react";
import { RenderElementProps } from "slate-react";

function UnorderdListPlugin(props: RenderElementProps) {
  return (
    <ul className="list-disc" {...props.attributes}>
      {...props.children}
    </ul>
  );
}

export default UnorderdListPlugin;
