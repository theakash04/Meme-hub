import { RefObject } from "react";
import { shapesType } from "../types/globalTypes";
import { getBoundingBox } from "./drawShapes";

interface offsetType {
  x: number;
  y: number;
}

let currentShapeIndex: number | null = null;
let isDragging = false;
let isResizing = false;
let dragOffset: offsetType = { x: 0, y: 0 };


function isInResizeHandler(
  x: number,
  y: number,
  shape: shapesType,
  handleSize: number = 8
): boolean {
  const box = getBoundingBox(shape);
  if (!box) return false;

  const half = handleSize / 2;

  // Adjust handle positions based on shape type
  const handles: { x: number; y: number }[] =
    shape.type === "text"
      ? [
        // Left and right midpoints only for text
        { x: box.x, y: box.y + box.height / 2 },
        { x: box.x + box.width, y: box.y + box.height / 2 },
      ]
      : [
        { x: box.x, y: box.y }, // top-left
        { x: box.x + box.width, y: box.y }, // top-right
        { x: box.x, y: box.y + box.height }, // bottom-left
        { x: box.x + box.width, y: box.y + box.height }, // bottom-right
      ];

  return handles.some((handle) => {
    return (
      x >= handle.x - half &&
      x <= handle.x + half &&
      y >= handle.y - half &&
      y <= handle.y + half
    );
  });
}

export function isInShape(x: number, y: number, shape: shapesType) {
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

    case "text":
      if (!shape.text) return false;
      const textWidth = shape.text.length * (shape.fontSize || 16);
      const textHeight = shape.fontSize || 16;
      const textLeft = shape.x;
      const textRight = shape.x + textWidth;
      const textTop = shape.y - textHeight;
      const textBottom = shape.y;

      return x >= textLeft && x <= textRight && y >= textTop && y <= textBottom;
    default:
      return false;
  }
}

export const handleDown = (
  e: MouseEvent,
  shapesRef: RefObject<shapesType[]>,
  canvasRef: RefObject<HTMLCanvasElement>,
  updateShapes: Function
) => {
  e.preventDefault();

  if (!canvasRef.current) return;
  const rect = canvasRef.current.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;
  console.log("MOuseDown");


  for (let i = (shapesRef.current?.length || 0) - 1; i >= 0; i--) {
    const shape = shapesRef.current![i];
    const newShapes = [...(shapesRef.current || [])];
    if (isInShape(mouseX, mouseY, shape)) {
      currentShapeIndex = i;
      isDragging = true;
      shape.isSelected = true;

      //store offset between cursor and shape origin
      dragOffset.x = mouseX - shape.x;
      dragOffset.y = mouseY - shape.y;
      updateShapes(newShapes);
      if (isInResizeHandler(mouseX, mouseY, shape)) {
        isResizing = true;
        console.log("In resize handler")
      }
      return true;
    } else {
      shape.isSelected = false;
      updateShapes(newShapes);

    }
  }
  return false
};

export const handleDoubleClick = (
  e: MouseEvent,
  canvasRef: RefObject<HTMLCanvasElement>,
  shapesRef: RefObject<shapesType[]>
) => {
  e.preventDefault();

  if (!canvasRef.current) return;
  const rect = canvasRef.current.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  for (let i = (shapesRef.current?.length || 0) - 1; i >= 0; i--) {
    const shape = shapesRef.current![i];
    if (isInShape(mouseX, mouseY, shape)) {
      if (shape.type === "text") {
        console.log("Text is clicked", shape.id);
        currentShapeIndex = i;
        // console.log(`${shape.type} is clicked`);
        return {
          id: shape.id,
          isClicked: true,
        };
      }
      console.log("Text is clicked", shape.id);
      return {
        id: shape.id,
        isClicked: false,
      };
    }
  }
};

export const handleClick = (
  e: MouseEvent,
  canvasRef: RefObject<HTMLCanvasElement>,
  shapesRef: RefObject<shapesType[]>
) => {
  e.preventDefault();

  if (!canvasRef.current) return;
  const rect = canvasRef.current.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;
  console.log(shapesRef.current, "shapesRef");

  for (let i = (shapesRef.current?.length || 0) - 1; i >= 0; i--) {
    const shape = shapesRef.current[i];
    if (isInShape(mouseX, mouseY, shape)) {
      currentShapeIndex = i;
      return true;
    }
  }
  return false;
};

export const handleMove = (
  e: MouseEvent,
  shapesRef: RefObject<shapesType[]>,
  canvasRef: RefObject<HTMLCanvasElement>,
  updateShapes: (sh: shapesType[]) => void
) => {
  if (!isDragging || currentShapeIndex === null) return;
  e.preventDefault();
  console.log(e, shapesRef, updateShapes);

  if (!canvasRef.current) return;
  const rect = canvasRef.current.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  // Use requestAnimationFrame for smooth animation
  requestAnimationFrame(() => {
    const newShapes = [...(shapesRef.current || [])];
    console.log("Shape is moving");

    // Ensure currentShapeIndex is not null (we already checked above)
    const index = currentShapeIndex as number;

    // ← apply offset so shape doesn't jump
    const shape = (newShapes[index] = {
      ...newShapes[index],
      x: mouseX - dragOffset.x,
      y: mouseY - dragOffset.y,
    });

    shape.x += (mouseX - dragOffset.x - shape.x) * 0.2;
    shape.y += (mouseY - dragOffset.y - shape.y) * 0.2;
    updateShapes(newShapes);
  });
};

export const handleUp = (e: MouseEvent) => {
  if (!isDragging) return;
  e.preventDefault();
  isDragging = false;
  currentShapeIndex = null;
  isResizing = false;
};

export const handleOut = (e: MouseEvent) => {
  if (!isDragging) return;
  e.preventDefault();
  isDragging = false;
  currentShapeIndex = null;
  isResizing = false;
};
