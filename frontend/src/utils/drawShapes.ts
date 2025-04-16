import { shapesType } from "../types/globalTypes";

export function getBoundingBox(shape: shapesType): { x: number, y: number, width: number, height: number } | null {
  switch (shape.type) {
    case "rectangle":
    case "square":
      if (!shape.width || !shape.height) return null;
      return {
        x: shape.x,
        y: shape.y,
        width: shape.width,
        height: shape.height,
      };

    case "circle":
      if (!shape.radius) return null;
      return {
        x: shape.x - shape.radius,
        y: shape.y - shape.radius,
        width: shape.radius * 2,
        height: shape.radius * 2,
      };

    case "text":
      if (!shape.text) return null;
      const fontSize = shape.fontSize || 16;
      return {
        x: shape.x,
        y: shape.y - fontSize,
        width: (shape.text?.length || 0) * fontSize * 0.6,
        height: fontSize,
      };

    case "arrow":
      if (!shape.endX || !shape.endY) return null;
      return {
        x: Math.min(shape.x, shape.endX),
        y: Math.min(shape.y, shape.endY),
        width: Math.abs(shape.endX - shape.x),
        height: Math.abs(shape.endY - shape.y),
      };

    default:
      return null;
  }
}


const drawShapes = (canvas: HTMLCanvasElement, shape: shapesType) => {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.fillStyle = shape.color;
  ctx.strokeStyle = shape.strokeColor || "black";
  ctx.lineWidth = shape.lineWidth || 2;

  switch (shape.type) {
    case "rectangle":
    case "square":
      ctx.beginPath();
      ctx.fillRect(shape.x, shape.y, shape.width!, shape.height!);
      ctx.strokeRect(shape.x, shape.y, shape.width!, shape.height!);
      break;

    case "circle":
      ctx.beginPath();
      ctx.arc(shape.x, shape.y, shape.radius!, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;

    case "arrow":
      drawArrow(ctx, shape.x, shape.y, shape.endX!, shape.endY!);
      break;

    case "text":
      ctx.font = `${shape.fontSize}px ${shape.fontFamily}`;
      ctx.fillStyle = shape.color; // Background color
      ctx.fillStyle = shape.textColor!;
      ctx.fillText(shape.text!, shape.x + 0, shape.y - 5);
      break;
  }

  drawResizeHandler(ctx, shape);
};

function drawArrow(
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number
) {
  const headLength = 10;
  const angle = Math.atan2(toY - fromY, toX - fromX);

  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();

  // Draw arrowhead
  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(
    toX - headLength * Math.cos(angle - Math.PI / 6),
    toY - headLength * Math.sin(angle - Math.PI / 6)
  );
  ctx.lineTo(
    toX - headLength * Math.cos(angle + Math.PI / 6),
    toY - headLength * Math.sin(angle + Math.PI / 6)
  );
  ctx.lineTo(toX, toY);
  ctx.fill();
}


function drawResizeHandler(ctx: CanvasRenderingContext2D, shape: shapesType) {
  if (!shape.isSelected) return;

  const box = getBoundingBox(shape);
  if (!box) return;

  const size = 8;
  const half = size / 2;

  const handles = [
    { x: box.x, y: box.y }, // top-left
    { x: box.x + box.width, y: box.y }, // top-right
    { x: box.x, y: box.y + box.height }, // bottom-left
    { x: box.x + box.width, y: box.y + box.height }, // bottom-right
  ];

  ctx.fillStyle = "blue";
  handles.forEach((handle) => {
    ctx.fillRect(handle.x - half, handle.y - half, size, size);
  });
}

export default drawShapes;
