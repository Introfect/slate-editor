import { RenderElementProps } from "slate-react";

const CodeElement = (props: RenderElementProps) => {
  return (
    <pre className="bg-gray-800 text-green-300" {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  );
};

export default CodeElement;
