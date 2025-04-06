import { RefObject } from "react";
import { shapesType } from "../types/globalTypes";

interface offsetType {
  x: number;
  y: number;
}

let currentShapeIndex: number | null = null;
let isDragging = false;
let dragOffset: offsetType = { x: 0, y: 0 };

function isMouseInShape(x: number, y: number, shape: shapesType) {
  switch (shape.type) {
    case "rectangle":
    case "square":
      if (!shape.width || !shape.height) return false;
      const shapeLeft = shape.x;
      const shapeRight = shape.x + shape.width;
      const shapeTop = Math.min(shape.y, shape.y + shape.height);
      const shapeBottom = Math.max(shape.y, shape.y + shape.height);

      return (
        x >= shapeLeft && x <= shapeRight && y >= shapeTop && y <= shapeBottom
      );

    case "circle":
      if (!shape.radius) return false;
      const dx = x - shape.x;
      const dy = y - shape.y;
      return Math.sqrt(dx * dx + dy * dy) <= shape.radius;

    case "arrow":
      if (!shape.endX || !shape.endY) return false;
      const lineThickness = 0.2;
      const minX = Math.min(shape.x, shape.endX) - lineThickness / 2;
      const maxX = Math.max(shape.x, shape.endX) + lineThickness / 2;
      const minY = Math.min(shape.y, shape.endY) - lineThickness / 2;
      const maxY = Math.max(shape.y, shape.endY) + lineThickness / 2;
      return x >= minX && x <= maxX && y >= minY && y <= maxY;

    default:
      return false;
  }
}

export const handleMouseDown = (
  e: MouseEvent,
  shapesRef: RefObject<shapesType[]>,
  canvasRef: RefObject<HTMLCanvasElement>
) => {
  e.preventDefault();

  if (!canvasRef.current) return;
  const rect = canvasRef.current.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  for (let i = (shapesRef.current?.length || 0) - 1; i >= 0; i--) {
    const shape = shapesRef.current![i];
    if (isMouseInShape(mouseX, mouseY, shape)) {
      currentShapeIndex = i;
      isDragging = true;
      // ← store offset between cursor and shape origin
      dragOffset.x = mouseX - shape.x;
      dragOffset.y = mouseY - shape.y;
      return;
    }
  }
};

export const handleMouseMove = (
  e: MouseEvent,
  shapesRef: RefObject<shapesType[]>,
  canvasRef: RefObject<HTMLCanvasElement>,
  updateShapes: (sh: shapesType[]) => void
) => {
  if (!isDragging || currentShapeIndex === null) return;
  e.preventDefault();

  if (!canvasRef.current) return;
  const rect = canvasRef.current.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  const newShapes = [...(shapesRef.current || [])];
  // ← apply offset so shape doesn’t jump
  const shape = (newShapes[currentShapeIndex] = {
    ...newShapes[currentShapeIndex],
    x: mouseX - dragOffset.x,
    y: mouseY - dragOffset.y,
  });

  shape.x += (mouseX - dragOffset.x - shape.x) * 0.2;
  shape.y += (mouseY - dragOffset.y - shape.y) * 0.2;
  updateShapes(newShapes);
};

export const handleMouseUp = (e: MouseEvent) => {
  if (!isDragging) return;
  e.preventDefault();
  isDragging = false;
  currentShapeIndex = null;
};

export const handleMouseOut = (e: MouseEvent) => {
  if (!isDragging) return;
  e.preventDefault();
  console.log("Mouse out");
  isDragging = false;
  currentShapeIndex = null;
};
