import React from "react";

type Props = { children: React.ReactNode };

function Layout({ children }: Props) {
  return (
    <body className="antialiased max-w-5xl mx-auto bg-black">{children}</body>
  );
}

export default Layout;
