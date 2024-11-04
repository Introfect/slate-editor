import { BaseEditor } from "slate";
import { HistoryEditor } from "slate-history";
import { ReactEditor } from "slate-react";

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;

export type CustomElement =
  | { type: "image"; src: string; children: CustomText[]; id: string }
  | { type: "paragraph"; children: CustomText[]; id: string }
  | { type: "code"; children: CustomText[]; id: string }
  | { type: "heading"; children: CustomText[]; id: string }
  | { type: "lineBreak"; children: CustomText[]; id: string }
  | { type: "unorderedlist"; children: ListItemElement[]; id: string }
  | { type: "list-item"; children: CustomText[]; id: string }
  | { type: "table"; children: TableRowElement[]; id: string }
  | { type: "table-row"; children: TableCellElement[]; id: string }
  | { type: "table-header"; children: CustomText[]; id: string }
  | { type: "table-cell"; children: CustomText[]; id: string };

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

export function isCustomElement(node: CustomDescendant) {
  return "type" in node;
}
