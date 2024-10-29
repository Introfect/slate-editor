import React from "react";
import { RenderElementProps } from "slate-react";
import BlockWrapper from "../BlockWrapper";
import TableWrapper from "./TableWrapper";

function CustomTableComponent(props: RenderElementProps) {
  return (
    <BlockWrapper {...props}>
      <TableWrapper {...props}>
        <table
          className="table w-full border-collapse border border-gray-300"
          {...props.attributes}
        >
          {...props.children}
        </table>
      </TableWrapper>
    </BlockWrapper>
  );
}

export default CustomTableComponent;
