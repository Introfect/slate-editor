const HeadingElement = (props: any) => {
  return (
    <p {...props.attributes} className="text-3xl font-bold text-slate-700">
      {props.children}
    </p>
  );
};

export default HeadingElement;
