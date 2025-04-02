import { ArrowRight, Circle, Pen, RectangleHorizontal, Square } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import drawShapes from "../utils/drawShapes";
import CanvasContext from "../context/canvaContext";
import { shapesType } from "../types/globalTypes";

function ToolsPanel() {
  const [shapes, setShapes] = useState<shapesType[]>([]);
  const canvasRef = useContext(CanvasContext);

  useEffect(() => {
    if (canvasRef?.current && shapes.length > 0) {
      shapes.forEach((shape) => {
        drawShapes(canvasRef.current, shape);
      });
      console.log(shapes)
    }
  }, [shapes, canvasRef]);

  function handleToolClick(tool: string) {
    const baseShape = {
      id: crypto.randomUUID(),
      x: 100,
      y: 100,
      color: "red",
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
    console.log("tool", tool);

    setShapes((prevShapes) => [...prevShapes, shapeTypeMap[tool]]);
  }

  return (
    <div className="tools-container">
      <button
        className={`tool-button`}
        onClick={() => handleToolClick("rectangle")}
      >
        <RectangleHorizontal />
      </button>
      <button
        className={`tool-button`}
        onClick={() => handleToolClick("square")}
      >
        <Square />
      </button>
      <button
        className={`tool-button`}
        onClick={() => handleToolClick("circle")}
      >
        <Circle />
      </button>
      <button
        className={`tool-button`}
        onClick={() => handleToolClick("arrow")}
      >
        <ArrowRight />
      </button>
      <button className={`tool-button`} onClick={() => handleToolClick("pen")}>
        <Pen />
      </button>
    </div>
  );
}

export default ToolsPanel;
