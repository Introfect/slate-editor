"use client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createEditor, Editor, Transforms } from "slate";
import { Slate, Editable, withReact, ReactEditor } from "slate-react";
import { withHistory } from "slate-history";
import TextareaAutosize from "react-textarea-autosize";

type CustomElement =
  | { type: "paragraph"; children: CustomText[] }
  | { type: "code"; children: CustomText[] }
  | { type: "image"; src: string; children: CustomText[] }
  | { type: "heading"; level: number; children: CustomText[] };
type CustomText = { text: string };

const EditorComponent = () => {
  const editor = useMemo(
    () => withImages(withHistory(withReact(createEditor()))),
    []
  );
  const [value, setValue] = useState<CustomElement[]>([
    { type: "paragraph", children: [{ text: "" }] },
  ]);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [selectedBlockType, setSelectedBlockType] = useState<
    "paragraph" | "heading" | "table" | "image"
  >("paragraph");
  const toolbarRef = useRef<HTMLElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const editorRef = useRef(null);

  const renderElement = useCallback((props) => {
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
        return <DefaultElement {...props} />;
    }
  }, []);

  const insertImage = (url: string) => {
    const text = { text: "" };
    const image = { type: "image", url, children: [text] };
    Transforms.insertNodes(editor, image);
  };

  useEffect(() => {
    textareaRef.current?.focus();
  }, [editor]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    console.log();
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
      const { selection } = editor;

      if (selection) {
        const [match] = Editor.nodes(editor, {
          match: (n) => n.type === "heading",
        });

        const type = match ? "paragraph" : selectedBlockType;
        const newBlock = { type, children: [{ text: "" }] };

        Transforms.insertNodes(editor, newBlock);
        setShowToolbar(false);
      }
    }
  };

  const insertBlock = (type: "heading" | "paragraph" | "code" | "image") => {
    // if (type === "image") {
    //   const fileInput = document.createElement("input");
    //   fileInput.type = "file";
    //   fileInput.accept = "image/*";

    //   fileInput.onchange = () => {
    //     const file = fileInput.files?.[0];
    //     if (file) {
    //       const reader = new FileReader();

    //       reader.onload = () => {
    //         const url = reader.result;
    //         if (url) {
    //           insertImage(url.toString());
    //         }
    //       };

    //       reader.readAsDataURL(file);
    //     }
    //   };

    //   fileInput.click();
    // } else {
    const block = { type, children: [{ text: "" }] };
    Transforms.insertNodes(editor, block);

    ReactEditor.focus(editor);
    // }
    setShowToolbar(false);
  };

  const initialValue = [
    {
      type: "paragraph",
      children: [{ text: "" }],
    },
  ];
  if (showToolbar) {
    toolbarRef.current?.focus();
  }
  console.log(value);
  return (
    <div className="relative">
      <div className="prose prose-stone">
        <TextareaAutosize
          ref={textareaRef}
          placeholder="Untitled.."
          className="p-2
            rounded
            w-full
            resize-none
            appearance-none
            overflow-hidden
            bg-transparent
            text-5xl
            font-bold
            focus:outline-none
            text-slate-800
            autoFocus"
        />
      </div>
      <Slate
        editor={editor}
        value={value}
        onChange={(value) => setValue(value)}
        initialValue={initialValue}
      >
        <Editable
          renderElement={renderElement}
          onKeyDown={onKeyDown}
          className="focus:outline-none"
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

const DefaultElement = (props: any) => {
  return <p {...props.attributes}>{props.children}</p>;
};

const HeadingElement = (props: any) => {
  return (
    <p {...props.attributes} className="text-3xl font-bold text-slate-700">
      {props.children}
    </p>
  );
};

const CodeElement = (props: any) => {
  return (
    <pre className="bg-gray-800 text-green-300" {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  );
};

const ImageElement = ({ attributes, children, element }: any) => {
  return (
    <div {...attributes} className="my-4">
      <div contentEditable={false}>
        <img
          src={element.url}
          alt="Slate Image"
          className="max-w-full h-auto"
        />
      </div>
      {children}
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
