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

export default ImageElement;
