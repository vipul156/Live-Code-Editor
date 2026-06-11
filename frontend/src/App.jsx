import { useMemo, useRef, Suspense, lazy, useState } from "react"; // 1. Added missing useState
import { SocketIOProvider } from "y-socket.io";
import * as Y from "yjs";

const LazyEditor = lazy(() =>
  import('@monaco-editor/react').then((module) => ({ default: module.Editor }))
);

export default function Home() {
  const editorRef = useRef(null);
  const [userName, setUserName] = useState(""); // Note: Currently empty, you'll need a way to set this!

  const yDoc = useMemo(() => new Y.Doc(), []);
  const yText = useMemo(() => yDoc.getText("editor"), []);

  const handleMount = async (editor) => {
    editorRef.current = editor;
    
    // Dynamically loading this here keeps it out of the main bundle chunk!
    const { MonacoBinding } = await import("y-monaco");

    const provider = new SocketIOProvider(
      "/",
      "editor",
      yDoc,
      {
        autoConnect: true,
      },
    );

    provider.on("status", (event) => {
      console.log("status:", event.status);
    });

    // Ensure we use the freshly imported MonacoBinding
    const monacoBinding = new MonacoBinding(
      yText,
      editorRef.current.getModel(),
      new Set([editorRef.current]),
      provider.awareness,
    );
  };

  // 2. Fixed early return. If userName is empty, show a login screen or a fallback
  if (!userName) {
    return (
      <div className="w-full h-screen bg-gray-950 flex flex-col justify-center items-center text-white">
        <h2 className="mb-4 text-xl">Enter your name to join the session:</h2>
        <input 
          type="text" 
          className="p-2 rounded text-white" 
          placeholder="Your name..."
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
              setUserName(e.currentTarget.value);
            }
          }}
        />
      </div>
    );
  }

  return (
    // 3. Fixed typo "w-fulll" -> "w-full"
    <main className="w-full h-screen bg-gray-950 flex gap-4 p-2">
      <aside className="w-1/6 h-full bg-amber-50 rounded-lg p-4">
        <h3 className="font-bold text-gray-800 text-lg">Users</h3>
        <p className="text-gray-600 mt-2">✨ {userName} (You)</p>
      </aside>
      <section className="flex-1 h-full bg-slate-300 rounded-lg overflow-hidden">
        <Suspense fallback={<div className="p-4 text-gray-800">Loading heavy code editor...</div>}>
          <LazyEditor
            height={"100%"}
            language="javascript"
            theme="vs-dark"
            defaultValue="// Write your code here"
            onMount={handleMount}
          />
        </Suspense>
      </section>
    </main>
  );
}