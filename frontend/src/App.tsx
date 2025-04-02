import { useContext, useEffect, useState } from "react";
import CanvasContext from "./context/canvaContext";
import socketContext from "./context/socketContext";
import FileUploader from "./components/fileUploader";
import ToolsPanel from "./components/ToolsPanels";



function App() {
  const canvasRef = useContext(CanvasContext);
  const socket = useContext(socketContext);
  const [isStart, setIsStart] = useState(false);
  const [dimension, setDimension] = useState<{ width: number; height: number }>(
    { width: 1280, height: 720 }
  );
  

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
    if (!isStart) return;
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    // do it in 16:9 aspect ratio
    canvas.width = dimension.width;
    canvas.height = dimension.height;
    if (!ctx) return;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [canvasRef, isStart]);

  function handleStart() {
    setIsStart(true);
  }

  function handleDim(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    const sizeMap: Record<string, { width: number; height: number }> = {
      Widescreen: { width: 1280, height: 720 }, // 16:9
      standard: { width: 1024, height: 768 }, // 4:3
      squares: { width: 1000, height: 1000 }, // 1:1
      vertical: { width: 720, height: 1280 }, // 9:16
    };

    setDimension(sizeMap[value] || { width: 1280, height: 720 });
  }

  if (isStart) {
    return (
      <div id="canvas-container">
        <ToolsPanel />
        <canvas ref={canvasRef} />
      </div>
    );
  }

  return (
    <div>
      <div id="canvas-utils-container">
        <FileUploader />
        <div id="canvas-utils">
          <span>Adjust Aspect Ratio [px]</span>
          <div>
            <select name="Aspect-ratio" id="dimension" onChange={handleDim}>
              <option value="Widescreen">16:9</option>
              <option value="standard">4:3</option>
              <option value="squares">1:1</option>
              <option value="vertical">9:16</option>
            </select>
          </div>
          <button onClick={handleStart}>Create</button>
        </div>
      </div>
    </div>
  );
}

export default App;
