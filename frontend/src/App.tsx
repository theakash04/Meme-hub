import { useCallback, useContext, useEffect, useState } from "react";
import CanvasContext from "./context/canvaContext";
import socketContext from "./context/socketContext";
import FileUploader from "./components/fileUploader";
import ToolsPanel from "./components/ToolsPanels";
import { shapesType } from "./types/globalTypes";
import drawShapes from "./utils/drawShapes";
import Header from "./components/Header";

function App() {
  const canvasRef = useContext(CanvasContext);
  const socket = useContext(socketContext);
  const [isStart, setIsStart] = useState(true);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [dimension, setDimension] = useState<{ width: number; height: number }>(
    { width: 1024, height: 768 }
  );

  const handleResize = useCallback(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  const redrawShapes = useCallback(
    (shapes: shapesType[]) => {
      requestAnimationFrame(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (shapes.length > 0) {
          shapes.forEach((s) => {
            drawShapes(canvas, s)
          }
          );
        }
      })

    },
    [canvasRef]
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
    if (!isStart || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const aspectRatio = dimension.width / dimension.height;

    let newWidth = screenWidth * 0.9;
    let newHeight = newWidth / aspectRatio;

    if (newHeight > screenHeight * 0.9) {
      newHeight = screenHeight * 0.8;
      newWidth = newHeight * aspectRatio;
    }
    canvas.width = newWidth;
    canvas.height = newHeight;
    if (!ctx) return;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [windowSize, canvasRef, isStart, dimension]);

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
        <Header />
        <ToolsPanel redrawShapes={redrawShapes} />
        <canvas
          ref={canvasRef}
          width={dimension.width}
          height={dimension.height}
        />
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
