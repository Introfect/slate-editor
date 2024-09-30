import { RenderElementProps } from "slate-react";

const HeadingElement = (props: RenderElementProps) => {
  return (
    <p {...props.attributes} className="text-3xl font-bold text-slate-700">
      {props.children}
    </p>
  );
};

export default HeadingElement;
