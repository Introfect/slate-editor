"use client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import TextareaAutosize from "react-textarea-autosize";
import {
  BaseEditor,
  createEditor,
  Descendant,
  Editor,
  Transforms,
} from "slate";
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
import { InsertBlock } from "@/utils/hooks";

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
    Text: CustomText;
  }
}

const EditorComponent = () => {
  const editor = useMemo(
    () => withImages(withHistory(withReact(createEditor()))),
    []
  );

  const initialValue: Descendant[] = [
    {
      type: "paragraph",
      children: [{ text: "" }],
    },
  ];
  const [value, setValue] = useState<Descendant[]>(initialValue);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [selectedTool, setSelectedTool] = useState<number>(1);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

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
    } else if (event.key === "ArrowDown" && showToolbar) {
      setSelectedTool((prev) => prev + 1);
    } else if (event.key === "ArrowUp" && showToolbar) {
      setSelectedTool((prev) => prev - 1);
    } else if (showToolbar && event.key === "Enter") {
      event.preventDefault();
      const ToolList = getTools();
      const activeToool = ToolList.filter((item) => item.id === selectedTool);
      InsertBlock({
        type: activeToool[0].value,
        setShowToolbar,
        editor,
        text: "",
      });
    }
    // if (
    //   event.key === "ArrowRight" ||
    //   event.key === "ArrowLeft" ||
    //   event.key === "ArrowUp" ||
    //   event.key === "ArrowDown"
    // ) {
    //   const { selection } = editor;

    //   if (selection) {
    //     const selected = editor.children[selection.anchor.path[0]];
    //     if (selected?.type === "unorderedlist") {
    //       const blocklength = selected.children[0].text.length;
    //       const cursorFocus = selection.focus.offset;
    //       if (blocklength) console.log(cursorFocus, "newSel");
    //     }
    //   }
    // }
    else if (event.key === "Enter") {
      event.preventDefault();
      const { selection } = editor;

      if (selection) {
        const selected = editor.children[selection.anchor.path[0]];
        if (selected?.type === "unorderedlist") {
          const blocklength = selected.children[0].text.length;
          const cursorFocus = selection.focus.offset;
          if (blocklength !== cursorFocus) {
            event.preventDefault();
            const type = "unorderedlist";
            const sliceCharacters =
              selected.children[0].text.slice(cursorFocus);
            InsertBlock({
              type,
              setShowToolbar,
              editor,
              text: sliceCharacters,
            });
          } else {
            event.preventDefault();
            const type = "unorderedlist";
            InsertBlock({ type, setShowToolbar, editor, text: "" });
          }
        } else {
          const type = "paragraph";
          InsertBlock({ type, setShowToolbar, editor, text: "" });
        }
      }
      setShowToolbar(false);
    } else if (event.key === "Tab") {
      event.preventDefault();
      const { selection } = editor;

      if (selection) {
        const selected = editor.children[selection.anchor.path[0]];
        if (selected?.type === "unorderedlist") {
          editor.move(editor, { edge: "start", unit: "line" });
        }
      }
    } else if (event.key === "Backspace") {
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
                    selectedTool={selectedTool}
                    insertBlock={InsertBlock}
                    setShowToolbar={setShowToolbar}
                  />
                );
              })}
            </ul>
          )}
        </Slate>
      </div>
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
