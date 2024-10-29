import React from "react";
import { RenderElementProps } from "slate-react";

function TableRow(props: RenderElementProps) {
  return (
    <tr
      className="bg-white border-b dark:bg-gray-800  table-row"
      {...props.attributes}
    >
      {...props.children}
    </tr>
  );
}

export default TableRow;
