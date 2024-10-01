type Tool = {
  id: number;
  name: string;
  value:
    | "heading"
    | "paragraph"
    | "code"
    | "image"
    | "unorderedlist"
    | "lineBreak";
};

export const Tools: Tool[] = [
  {
    id: 1,
    name: "Heading",
    value: "heading",
  },
  {
    id: 2,
    name: "Paragraph",
    value: "paragraph",
  },
  {
    id: 1,
    name: "Code",
    value: "code",
  },
  {
    id: 1,
    name: "Image",
    value: "image",
  },
  {
    id: 1,
    name: "Unorderd List",
    value: "unorderedlist",
  },
  {
    id: 1,
    name: "Line Break",
    value: "lineBreak",
  },
];
