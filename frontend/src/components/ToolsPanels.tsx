import {
  Circle,
  RectangleHorizontal,
  Square,
  TextCursor,
} from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import CanvasContext from "../context/canvaContext";
import socketContext from "../context/socketContext";
import useThrottle from "../hooks/useThrottle";
import { shapesType } from "../types/globalTypes";
import {
  handleClick,
  handleDoubleClick,
  handleDown,
  handleMove,
  handleOut,
  handleUp,
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
  const [color, setColor] = useState<string>("#ffffff");
  const [textColor, setTextColor] = useState<string>("black");
  const [font, setFont] = useState<string>("Arial");
  const [fontSize, setFontSize] = useState<number>(20);
  const [text, setText] = useState<string>("");
  const [isInput, setIsInput] = useState<boolean>(false);
  const [selectedText, setSelectedText] = useState<string | null>(null);

  // keeping shapeRef in sync
  useEffect(() => {
    shapesRef.current = shapes;
    redrawShapes(shapes);
  }, [shapes, canvasRef, text]);

  // event listener attachments
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    //mouse doubleClick handler
    const dmc = (e: MouseEvent) => {
      const data = handleDoubleClick(e, canvasRef, shapesRef);
      if (data?.isClicked) {
        setIsInput((prev) => !prev);
        setSelectedText(data.id);
      }
    };

    // mouse click handler
    const mc = (e: MouseEvent) => {
      handleClick(e, canvasRef, shapesRef);
    };

    // mouse down handler
    const md = (e: MouseEvent) => {
      const data = handleDown(e, shapesRef, canvasRef, updateShapes);
      if (data) {
        setIsInput(false);
      }
    };

    // mouse move handler
    const mm = (e: MouseEvent) => {
      handleMove(e, shapesRef, canvasRef, updateShapes);
    };

    // mouse up handler
    const mu = (e: MouseEvent) => {
      handleUp(e);
      if (socket) {
        console.log("Mouse up");
        socket.emit("canvas-data", shapesRef.current);
      }
    };

    // mouse out handler
    const mo = (e: MouseEvent) => {
      handleOut(e);
      if (socket) {
        console.log("Mouse out");
        socket.emit("canvas-data", shapesRef.current);
      }
    };

    canvasRef.current.addEventListener("dblclick", dmc);
    canvasRef.current.addEventListener("click", mc);
    canvasRef.current.addEventListener("mousedown", md);
    canvasRef.current.addEventListener("mouseup", mu);
    canvasRef.current.addEventListener("mouseout", mo);
    canvasRef.current.addEventListener("mousemove", mm);

    return () => {
      canvasRef.current.removeEventListener("dblclick", dmc);
      canvasRef.current.removeEventListener("click", mc);
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

  const ShapeThrottle = useThrottle(() => {
    if (!socket) return;

    socket.emit("canvas-data", shapesRef.current);
  });

  useEffect(() => {
    if (!socket) return;
    ShapeThrottle();
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
      isSelected: false
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
      text: {
        ...baseShape,
        text: "New Text",
        fontSize: fontSize,
        fontFamily: font,
        textColor: textColor,
        type: "text",
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

  function handleTextChange(e_input: React.ChangeEvent<HTMLInputElement>) {
    const textValue = e_input.target.value;
    setText(textValue)

    const updatedShapes = shapes.map((shape) => {
      if (shape.id === selectedText) {
        return {
          ...shape,
          text: textValue,
        }
      }
      return shape
    })

    setShapes(updatedShapes)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      setIsInput(false);
      const updatedShapes = shapes.map((shape) => {
        if (shape.id === selectedText) {
          return {
            ...shape,
            text: text,
            fontSize: fontSize,
            fontFamily: font,
            textColor: textColor,
          };
        }
        return shape;
      });

      setShapes(updatedShapes);
      setText("")
    }
  }

  return (
    <div className="container">
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
        <button className="tool-button" onClick={() => handleToolClick("text")}>
          <TextCursor color="black" />
        </button>
        <div className="color-picker">
          <input type="color" value={color} onChange={handleColorChange} />
        </div>
      </div>
      {isInput && (
        <input
          type="text"
          placeholder="Input Your text"
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      )}
    </div>
  );
}

export default ToolsPanel;
