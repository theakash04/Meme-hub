import { useContext, useEffect } from "react";
import CanvasContext from "./context/canvaContext";
import socketContext from "./context/socketContext";

function App() {
  const canvasRef = useContext(CanvasContext);
  const socket = useContext(socketContext);

  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => {
      console.log("Connected to server");
      socket.emit("register-user", { name: "john doe" });
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
    };
  }, [socket]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(50, 50, 100, 100);
  }, [canvasRef]);

  function dropHandler(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }
  function dragOverHandler(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  function handleImageUpload(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
  }

  return (
    <>
      <div id="drop-zone">
        Click Here or Drop Your Image Here!
        <input type="file" accept="image/png"/>
      </div>
      <div id="preview"></div>
      <canvas ref={canvasRef} width={500} height={500} />
    </>
  );
}

export default App;
