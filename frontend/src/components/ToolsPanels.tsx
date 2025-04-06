import { Circle, RectangleHorizontal, Square } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import CanvasContext from "../context/canvaContext";
import socketContext from "../context/socketContext";
import useThrottle from "../hooks/useThrottle";
import { shapesType } from "../types/globalTypes";
import {
  handleMouseDown,
  handleMouseMove,
  handleMouseOut,
  handleMouseUp,
} from "../utils/mouseEvents";

function ToolsPanel({
  redrawShapes,
}: {
  redrawShapes: (shapes: shapesType[]) => void;
}) {
  const [shapes, setShapes] = useState<shapesType[]>([]);
  const shapesRef = useRef<shapesType[]>(shapes);
  const canvasRef = useContext(CanvasContext);
  const socket = useContext(socketContext);
  const [color, setColor] = useState<string>("#000000");

  // keeping shapeRef in sync
  useEffect(() => {
    shapesRef.current = shapes;
    redrawShapes(shapes);
  }, [shapes, canvasRef]);

  // event listener attachments
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // mouse down handler
    const md = (e: MouseEvent) => handleMouseDown(e, shapesRef, canvasRef);

    // mouse move handler
    const mm = (e: MouseEvent) => {
      handleMouseMove(e, shapesRef, canvasRef, updateShapes);
    };

    // mouse up handler
    const mu = (e: MouseEvent) => {
      handleMouseUp(e);
      if (socket) {
        console.log("Mouse up");
        socket.emit("canvas-data", shapesRef.current);
      }
    };

    // mouse out handler
    const mo = (e: MouseEvent) => {
      handleMouseOut(e);
      if (socket) {
        console.log("Mouse out");
        socket.emit("canvas-data", shapesRef.current);
      }
    };

    canvasRef.current.addEventListener("mousedown", md);
    canvasRef.current.addEventListener("mouseup", mu);
    canvasRef.current.addEventListener("mouseout", mo);
    canvasRef.current.addEventListener("mousemove", mm);

    return () => {
      canvasRef.current.removeEventListener("mousedown", md);
      canvasRef.current.removeEventListener("mousemove", mm);
      canvasRef.current.removeEventListener("mouseup", mu);
      canvasRef.current.removeEventListener("mouseout", mo);
    };
  }, [canvasRef]);

  useEffect(() => {
    const handleResize = () => {
      redrawShapes(shapesRef.current);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [redrawShapes]);

  useEffect(() => {
    if (!socket) return;

    socket.on("canvas-data", (canvasData: shapesType[]) => {
      console.log("Canvas data received from server:", canvasData);
      if (JSON.stringify(canvasData) !== JSON.stringify(shapesRef.current)) {
        updateShapes(canvasData);
      }
    });

    return () => {
      socket.off("canvas-data");
    };
  }, [socket]);

  const shapeTracker = useThrottle(() => {
    if (!socket) return;

    socket.emit("canvas-data", shapesRef.current);
  });

  useEffect(() => {
    if (!socket) return;

    shapeTracker();
  }, [shapes]);

  function updateShapes(newShapes: shapesType[]) {
    shapesRef.current = newShapes;
    setShapes(newShapes);
  }

  function handleToolClick(tool: string) {
    const baseShape = {
      id: crypto.randomUUID(),
      x: 100,
      y: 100,
      color: color,
    };

    const shapeTypeMap: Record<string, shapesType> = {
      rectangle: {
        ...baseShape,
        width: 150,
        height: 100,
        type: "rectangle",
      },
      square: {
        ...baseShape,
        width: 100,
        height: 100,
        type: "square",
      },
      circle: {
        ...baseShape,
        radius: 50,
        type: "circle",
      },
      arrow: {
        ...baseShape,
        endX: 200,
        endY: 200,
        type: "arrow",
      },
    };

    if (!shapeTypeMap[tool]) return;

    // Emit the shape to the server
    setShapes((prevShapes): shapesType[] => {
      const updatedShapes = [...prevShapes, shapeTypeMap[tool]];
      shapesRef.current = updatedShapes;
      return updatedShapes;
    });
  }

  function handleColorChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newColor = event.target.value;
    setColor(newColor);
  }

  return (
    <div className="tools-container">
      <button
        className={`tool-button`}
        onClick={() => handleToolClick("rectangle")}
      >
        <RectangleHorizontal color="black" />
      </button>
      <button
        className={`tool-button`}
        onClick={() => handleToolClick("square")}
      >
        <Square color="black" />
      </button>
      <button
        className={`tool-button`}
        onClick={() => handleToolClick("circle")}
      >
        <Circle color="black" />
      </button>
      {/* <button
        className={`tool-button`}
        onClick={() => handleToolClick("arrow")}
      >
        <ArrowRight />
      </button>
      <button className={`tool-button`} onClick={() => handleToolClick("pen")}>
        <Pen />
      </button> */}
      <div className="color-picker">
        <input type="color" value={color} onChange={handleColorChange} />
      </div>
    </div>
  );
}

export default ToolsPanel;
