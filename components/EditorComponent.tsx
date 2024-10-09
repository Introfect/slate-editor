"use client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import TextareaAutosize from "react-textarea-autosize";
import { BaseEditor, createEditor, Descendant, Editor } from "slate";
import {
  Slate,
  Editable,
  withReact,
  ReactEditor,
  RenderElementProps,
} from "slate-react";
import { HistoryEditor, withHistory } from "slate-history";
import HeadingElement from "./HeadingElement";
import CodeElement from "./CodeElement";
import ImageElement from "./ImageElement";
import ParagraphElement from "./ParagraphElement";
import LineBreak from "./LineBreak";
import UnorderdListPlugin from "./UnorderdListPlugin";
import { getTools } from "@/utils/constants";
import { twMerge } from "tailwind-merge";
import Tools from "./Tools";
import { InsertBlock as insertBlock } from "@/utils/hooks";

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;
export type CustomElement =
  | { type: "image"; src: string; children: CustomText[] }
  | { type: "paragraph"; children: CustomText[] }
  | { type: "code"; children: CustomText[] }
  | { type: "heading"; children: CustomText[] }
  | { type: "lineBreak"; children: CustomText[] }
  | { type: "unorderedlist"; children: CustomText[] };

type CustomText = { text: string };
declare module "slate" {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText | null;
  }
}

const EditorComponent = () => {
  const editor = useMemo(
    () => withImages(withHistory(withReact(createEditor()))),
    []
  );

  const [value, setValue] = useState<Descendant[]>([]);
  console.log(value, "Value");
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [selectedTool, setSelectedTool] = useState<number>(1);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const initialValue: Descendant[] = [
    {
      type: "paragraph",
      children: [{ text: "" }],
    },
  ];

  const renderElement = useCallback((props: RenderElementProps) => {
    switch (props.element.type) {
      case "heading":
        return <HeadingElement {...props} />;
      case "code": {
        return <CodeElement {...props} />;
      }
      case "image": {
        return <ImageElement {...props} />;
      }
      case "lineBreak": {
        return <LineBreak {...props} />;
      }
      case "unorderedlist": {
        return <UnorderdListPlugin {...props} />;
      }
      default:
        return <ParagraphElement {...props} />;
    }
  }, []);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);
  const headerKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && textareaRef.current !== null) {
      console.log("Inside block");
      event.preventDefault();
      ReactEditor.focus(editor);
    }
  };
  const OnKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "/") {
      event.preventDefault();
      const { selection } = editor;

      if (selection) {
        const domSelection = window.getSelection();
        const domRange = domSelection?.getRangeAt(0);
        const rect = domRange?.getBoundingClientRect();

        if (rect) {
          setToolbarPosition({
            top: window.scrollY + 20,
            left: rect.left + window.scrollX - 190,
          });
          setShowToolbar(!showToolbar);
        }
      }
    }
    if (event.key === "ArrowDown" && showToolbar) {
      setSelectedTool((prev) => prev + 1);
    }
    if (event.key === "ArrowUp" && showToolbar) {
      setSelectedTool((prev) => prev - 1);
    }
    if (showToolbar && event.key === "Enter") {
      console.log("Enter call in toolbar blockl");
      event.preventDefault();
      const ToolList = getTools();
      const activeToool = ToolList.filter((item) => item.id === selectedTool);
      insertBlock(activeToool[0].value, setShowToolbar, editor);
      event.preventDefault();
    }
    if (event.key === "Enter") {
      event.preventDefault();
      console.log("enter call");
      const { selection } = editor;

      if (selection) {
        const selected = editor.children[selection.anchor.path[0]];
        if (selected.type === "unorderedlist") {
          const type = "unorderedlist";
          insertBlock(type, setShowToolbar, editor);
        } else {
          const type = "paragraph";
          insertBlock(type, setShowToolbar, editor);
        }
      }
      setShowToolbar(false);
    }
    if (event.key === "Backspace") {
      if (value.length === 1 && value[0].children[0].text.length === 0) {
        textareaRef.current?.focus();
      }
    }
  };

  const toolsList = getTools();
  return (
    <div className="relative">
      <div className="prose prose-stone dark:prose-invert ">
        <TextareaAutosize
          ref={textareaRef}
          placeholder="Title"
          className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none ml-8"
          onKeyDown={headerKeyDown}
        />

        <Slate
          editor={editor}
          onChange={(value) => setValue(value)}
          initialValue={initialValue}
        >
          <Editable
            placeholder="Start typing or use / for commands"
            renderElement={renderElement}
            className="focus:outline-none"
            autoFocus
            onKeyDown={OnKeyDown}
          />
        </Slate>
      </div>
      {showToolbar && toolbarPosition && (
        <ul
          style={{ top: toolbarPosition.top, left: toolbarPosition.left }}
          className={twMerge(
            "absolute bg-white border border-gray-300 p-2 rounded shadow-md z-10"
          )}
        >
          {toolsList.map((tool) => {
            return (
              <Tools
                key={tool.id}
                tool={tool}
                slectedTool={selectedTool}
                insertBlock={insertBlock}
              />
            );
          })}
        </ul>
      )}
    </div>
  );
};

const withImages = (editor: Editor) => {
  const { isVoid } = editor;

  editor.isVoid = (element) => {
    return element.type === "image" ? true : isVoid(element);
  };

  return editor;
};
export default EditorComponent;
