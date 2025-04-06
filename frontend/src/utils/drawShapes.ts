import { shapesType } from "../types/globalTypes";

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
  }
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

export default drawShapes;
