import { TableCellElement, TableRowElement } from "@/utils/types";
import React from "react";
import { Editor, Element, Transforms } from "slate";
import { RenderElementProps, useSlate } from "slate-react";

function TableWrapper({ attributes, element, children }: RenderElementProps) {
  console.log({ element: element, attributes: attributes });
  const editor = useSlate();
  const handleInsertTableBlock = ({
    blockType,
  }: {
    blockType: "column" | "row";
  }) => {
    if (blockType === "column") {
      const tableNodes = Array.from(
        Editor.nodes(editor, {
          match: (n) => Element.isElement(n) && n.type === "table",
        })
      );
      if (tableNodes.length > 0) {
        const [table] = tableNodes;
        table[0].children.forEach((row, rowIndex: number) => {
          const newCell: TableCellElement = {
            type: "table-cell",
            children: [
              {
                text: rowIndex === 0 ? `Header ${row.children.length + 1}` : "",
              },
            ],
          };
          Transforms.insertNodes(editor, newCell, {
            at: [...table[1], rowIndex, row.children.length],
          });
        });
      }
    } else {
      const tableNodes = Array.from(
        Editor.nodes(editor, {
          match: (n) => Element.isElement(n) && n.type === "table",
        })
      );
      if (tableNodes.length > 0) {
        const [table] = tableNodes;
        const newRow: TableRowElement = {
          type: "table-row",
          children: table[0].children[0].children.map(() => ({
            type: "table-cell",
            children: [{ text: "" }],
          })),
        };
        Transforms.insertNodes(editor, newRow, {
          at: [...table[1], table[0].children.length],
        });
      }
    }
  };
  return (
    <div className="group">
      <div className="flex">
        {children}
        <button
          onClick={() => handleInsertTableBlock({ blockType: "column" })}
          className="hidden group-hover:block"
        >
          Insert Column
        </button>
      </div>
      <button
        onClick={() => handleInsertTableBlock({ blockType: "row" })}
        className="hidden group-hover:block"
      >
        Insert Row
      </button>
    </div>
  );
}

export default TableWrapper;
