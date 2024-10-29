import React from "react";
import { RenderElementProps } from "slate-react";

function TableDirectory(props: RenderElementProps) {
  return (
    <td
      className="table-cell border border-gray-300 p-2 text-center"
      {...props.attributes}
    >
      {...props.children}
    </td>
  );
}

export default TableDirectory;
