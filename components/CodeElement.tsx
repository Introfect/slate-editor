const CodeElement = (props: any) => {
  return (
    <pre className="bg-gray-800 text-green-300" {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  );
};

export default CodeElement;
