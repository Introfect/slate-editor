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
  | { type: "table"; children: CustomTableRow[] };

export type CustomText = { text: string };
export type ListItemElement = {
  type: "list-item";
  children: (
    | CustomText
    | { type: "unordered-list"; children: ListItemElement[] }
  )[];
};

export type CustomTableRow = {
  type: "table-row";
  children: CustomTableHeader[] | CustomTableDirectory[];
};

export type CustomTableHeader = {
  type: "table-header";
  children: CustomText;
};

export type CustomTableDirectory = {
  type: "table-directory";
  children: CustomText;
};
