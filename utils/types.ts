import { BaseEditor } from "slate";
import { HistoryEditor } from "slate-history";
import { ReactEditor } from "slate-react";

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;

export type CustomElement =
  | { type: "image"; src: string; children: CustomText[] }
  | { type: "paragraph"; children: CustomText[] }
  | { type: "code"; children: CustomText[] }
  | { type: "heading"; children: CustomText[] }
  | { type: "lineBreak"; children: CustomText[] }
  | { type: "unorderedlist"; children: ListItemElement[] }
  | { type: "list-item"; children: CustomText[] }
  | { type: "table"; children: TableRowElement[] }
  | { type: "table-row"; children: TableCellElement[] }
  | { type: "table-header"; children: CustomText[] }
  | { type: "table-cell"; children: CustomText[] };

export type CustomText = { text: string };

export type CustomDescendant = CustomElement | CustomText;

export type ListItemElement = {
  type: "list-item";
  children: (
    | CustomText
    | { type: "unorderedlist"; children: ListItemElement[] }
  )[];
};

export type TableRowElement = {
  type: "table-row";
  children: TableCellElement[];
};

export type TableCellElement =
  | { type: "table-header"; children: CustomText[] }
  | { type: "table-cell"; children: CustomText[] };

export function isCustomElement(node: CustomDescendant): node is CustomElement {
  return "type" in node;
}
