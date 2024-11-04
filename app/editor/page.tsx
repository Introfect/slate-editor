"use client";
import EditorComponent from "@/components/EditorComponent";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export default function Home() {
  return (
    <div className="min-h-screen py-8">
      <DndProvider backend={HTML5Backend}>
        <EditorComponent />
      </DndProvider>
    </div>
  );
}
