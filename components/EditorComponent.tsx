"use client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;
type CustomElement =
  | { type: "image"; src: string; children: CustomText[] }
  | { type: "paragraph"; children: CustomText[] }
  | { type: "code"; children: CustomText[] }
  | { type: "heading"; children: CustomText[] };

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

  const [value, setValue] = useState<Descendant[]>([]);
  console.log(value);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const toolbarRef = useRef<HTMLLIElement | null>(null);
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
      default:
        return <ParagraphElement {...props} />;
    }
  }, []);

  const insertImage = (src: string) => {
    const text = { text: "" };
    const image: CustomElement = { type: "image", src, children: [text] };
    Transforms.insertNodes(editor, image);
    const type = "paragraph";
    const newBlock: CustomElement = { type, children: [{ text: "" }] };
    Transforms.insertNodes(editor, newBlock);
    ReactEditor.focus(editor);
  };

  useEffect(() => {
    textareaRef.current?.focus();
  }, [editor]);

  const onKeyDown = (event: React.KeyboardEvent) => {
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
    if (event.key === "Enter") {
      console.log("Enter event");
      const { selection } = editor;

      if (selection) {
        const type = "paragraph";
        const newBlock: CustomElement = { type, children: [{ text: "" }] };

        Transforms.insertNodes(editor, newBlock);
      }
      setShowToolbar(false);
    }
  };

  const insertBlock = (type: "heading" | "paragraph" | "code" | "image") => {
    if (type === "image") {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";

      fileInput.onchange = () => {
        const file = fileInput.files?.[0];
        if (file) {
          const reader = new FileReader();

          reader.onload = () => {
            const url = reader.result;
            if (url) {
              insertImage(url.toString());
            }
          };

          reader.readAsDataURL(file);
        }
      };

      fileInput.click();
    } else {
      const block = { type, children: [{ text: "" }] };
      Transforms.insertNodes(editor, block);
      ReactEditor.focus(editor);
    }
    setShowToolbar(false);
  };

  const initialValue: Descendant[] = [
    {
      type: "heading",
      children: [{ text: "" }],
    },
  ];
  if (showToolbar) {
    toolbarRef.current?.focus();
  }
  return (
    <div className="relative">
      <Slate
        editor={editor}
        onChange={(value) => setValue(value)}
        initialValue={initialValue}
      >
        <Editable
          placeholder="Start typing or use / for commands"
          renderElement={renderElement}
          onKeyDown={onKeyDown}
          className="focus:outline-none"
          autoFocus
        />
      </Slate>

      {showToolbar && toolbarPosition && (
        <ul
          style={{ top: toolbarPosition.top, left: toolbarPosition.left }}
          className="absolute bg-white border border-gray-300 p-2 rounded shadow-md z-10"
        >
          <li ref={toolbarRef}>
            <button
              className="block px-2 py-1 hover:bg-gray-200"
              onClick={() => insertBlock("heading")}
            >
              Heading
            </button>
          </li>
          <li>
            <button
              className="block px-2 py-1 hover:bg-gray-200"
              onClick={() => insertBlock("paragraph")}
            >
              Paragraph
            </button>
          </li>
          <li>
            <button
              className="block px-2 py-1 hover:bg-gray-200"
              onClick={() => insertBlock("code")}
            >
              Code
            </button>
          </li>
          <li>
            <button
              className="block px-2 py-1 hover:bg-gray-200"
              onClick={() => insertBlock("image")}
            >
              Image
            </button>
          </li>
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
