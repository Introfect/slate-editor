import { AlignJustify, Code, Heading, Image, List, Minus } from "lucide-react";
import { ReactNode } from "react";

export type ToolType = {
  id: number;
  name: string;
  value:
    | "heading"
    | "paragraph"
    | "code"
    | "image"
    | "unorderedlist"
    | "lineBreak";
  icon?: ReactNode;
};

export const getTools = (): ToolType[] => {
  return [
    {
      id: 1,
      name: "Heading",
      value: "heading",
      icon: <Heading className="w-4" />,
    },
    {
      id: 2,
      name: "Paragraph",
      value: "paragraph",
      icon: <AlignJustify />,
    },
    {
      id: 3,
      name: "Code",
      value: "code",
      icon: <Code />,
    },
    {
      id: 4,
      name: "Image",
      value: "image",
      icon: <Image />,
    },
    {
      id: 5,
      name: "Unorderd List",
      value: "unorderedlist",
      icon: <List className="w-4" />,
    },
    {
      id: 6,
      name: "Line Break",
      value: "lineBreak",
      icon: <Minus />,
    },
  ];
};

export const toolbarStyles = "bg-red-400";

export const LIST_TYPES = ["unordered-list"];
