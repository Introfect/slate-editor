"use client";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { createEditor, Transforms } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { withHistory } from "slate-history";
import hljs from "highlight.js";
import "highlight.js/styles/default.css";

type CustomElement =
  | { type: "paragraph"; children: CustomText[] }
  | { type: "code"; children: CustomText[] }
  | { type: "heading"; level: number; children: CustomText[] };
type CustomText = { text: string };

const EditorComponent = () => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const [value, setValue] = useState<CustomElement[]>([
    { type: "paragraph", children: [{ text: "" }] },
  ]);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const toolbarRef = useRef<HTMLElement | null>(null);
  const renderElement = useCallback((props) => {
    switch (props.element.type) {
      case "heading":
        return <HeadingElement {...props} />;
      case "code": {
        return <CodeElement />;
      }
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  const onKeyDown = (event: React.KeyboardEvent) => {
    console.log(editor);
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
    if (event.key === "```") {
      console.log("backtick event");
    }
  };

  const insertBlock = (type: "heading" | "paragraph" | "code") => {
    const block = { type, children: [{ text: "" }] };
    Transforms.insertNodes(editor, block);
    setShowToolbar(false);
  };

  const initialValue = [
    {
      type: "paragraph",
      children: [{ text: "A line of text in a paragraph." }],
    },
  ];
  if (showToolbar) {
    toolbarRef.current?.focus();
  }
  return (
    <div className="relative">
      <Slate
        editor={editor}
        value={value}
        onChange={(value) => setValue(value)}
        initialValue={initialValue}
      >
        <Editable
          renderElement={renderElement}
          onKeyDown={onKeyDown}
          className="border border-gray-300 p-4 rounded"
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

class CodeElement extends React.Component {
  componentDidMount() {
    this.highlightCode();
  }

  componentDidUpdate() {
    this.highlightCode();
  }

  highlightCode() {
    const nodes = document.querySelectorAll("pre code");
    nodes.forEach((node) => hljs.highlightBlock(node));
  }

  render() {
    return (
      <pre {...this.props.attributes}>
        <code>{this.props.children}</code>
      </pre>
    );
  }
}

export default EditorComponent;
