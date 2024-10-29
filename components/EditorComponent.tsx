"use client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import TextareaAutosize from "react-textarea-autosize";
import { createEditor, Editor, Element, Transforms } from "slate";
import {
  Slate,
  Editable,
  withReact,
  ReactEditor,
  RenderElementProps,
} from "slate-react";
import { withHistory } from "slate-history";
import HeadingElement from "@/components/Plugins/HeadingElement";
import CodeElement from "./Plugins/CodeElement";
import ImageElement from "./Plugins/ImageElement";
import ParagraphElement from "./Plugins/ParagraphElement";
import LineBreak from "./Plugins/LineBreak";
import UnorderdListPlugin from "./UnorderdListPlugin";
import { getTools } from "@/utils/constants";
import { twMerge } from "tailwind-merge";
import Tools from "./Plugins/Tools";
import { insertBlock } from "@/utils/hooks";
import LIstItem from "./Plugins/LIstItem";
import { useSelectedToolStore, useToolbarStore } from "@/utils/store";
import {
  CustomDescendant,
  CustomEditor,
  CustomElement,
  CustomText,
  isCustomElement,
} from "@/utils/types";
import CustomTableComponent from "./Plugins/CustomTableComponent";
import TableHeaders from "./Plugins/TableHeaders";
import TableRow from "./Plugins/TableRow";
import TableDirectory from "./Plugins/TableDirectory";

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

  const initialValue: CustomDescendant[] = [
    {
      type: "paragraph",
      children: [{ text: "" }],
    },
  ];
  const [value, setValue] = useState<CustomDescendant[]>(initialValue);
  const [toolbarPosition, setToolbarPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

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
      case "list-item": {
        return <LIstItem {...props} />;
      }
      case "table": {
        return <CustomTableComponent {...props} />;
      }
      case "table-header": {
        return <TableHeaders {...props} />;
      }
      case "table-row": {
        return <TableRow {...props} />;
      }
      case "table-cell": {
        return <TableDirectory {...props} />;
      }
      default:
        return <ParagraphElement {...props} />;
    }
  }, []);

  const toolbar = useToolbarStore((state) => state.toolbar);
  const toggleToolbar = useToolbarStore((state) => state.toggleToolbar);
  const hideToolbar = useToolbarStore((state) => state.hideToolbar);

  const selectedToolbar = useSelectedToolStore(
    (state) => state.selectedToolbar
  );
  const increaseSelectedToolbar = useSelectedToolStore(
    (state) => state.increaseSelectedToolbar
  );
  const decreaseSelectedToolBar = useSelectedToolStore(
    (state) => state.decreaseSelectedToolbar
  );
  console.log(value, "value");

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
    console.log(event.key, "key");
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
          toggleToolbar();
        }
      }
    } else if (event.key === "ArrowDown" && toolbar) {
      increaseSelectedToolbar();
    } else if (event.key === "ArrowUp" && toolbar) {
      decreaseSelectedToolBar();
    } else if (toolbar && event.key === "Enter") {
      console.log("inside toolbar ");
      event.preventDefault();
      const ToolList = getTools();
      const activeToool = ToolList.filter(
        (item) => item.id === selectedToolbar
      );
      insertBlock({
        type: activeToool[0].value,
        editor,
      });
      hideToolbar();
    } else if (event.key === "Enter") {
      event.preventDefault();
      const { selection } = editor;

      if (selection) {
        const selected: CustomDescendant =
          editor.children[selection.anchor.path[0]];
        if (isCustomElement(selected)) {
          if (selected.type === "unorderedlist") {
            console.log(selected, "selected");
            // const blocklength = selected.children[0].text.length;
            // const cursorFocus = selection.focus.offset;

            event.preventDefault();
            const type = "list-item";
            insertBlock({ type, editor });
          } else {
            const type = "paragraph";
            insertBlock({ type, editor });
          }
        }
      }
      hideToolbar();
    } else if (event.key === "Tab") {
      event.preventDefault();
      const [match] = Editor.nodes(editor, {
        match: (n) => Element.isElement(n) && n.type === "list-item",
      });

      if (match) {
        Transforms.wrapNodes(
          editor,
          { type: "unorderedlist", children: [] },
          { split: true }
        );
      }
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      const [match] = Editor.nodes<CustomElement>(editor, {
        match: (n) => Element.isElement(n) && n.type === "list-item",
      });

      if (match) {
        Transforms.liftNodes(editor);
      }
    } else if (event.key === "Backspace") {
      if (value.length === 1 && "children" in value[0]) {
        const node = value[0];

        if (node.children.length > 0 && "text" in node.children[0]) {
          if (node.children[0].text.length === 0) {
            textareaRef.current?.focus();
          }
        }
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
          className="w-full text-gray-300 resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none ml-9"
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
            className="focus:outline-none text-gray-300"
            autoFocus
            onKeyDown={OnKeyDown}
          />
          {toolbar && toolbarPosition && (
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
                    insertBlock={insertBlock}
                    selectedTool={selectedToolbar}
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
