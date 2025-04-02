import React from "react";

export interface ContextComponentProps {
  children: React.ReactNode;
}

export interface shapesType {
  id: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  sides?: number;
  endX?: number;
  endY?: number;
  color: string;
  strokeColor?: string;
  lineWidth?: number;
  type: "rectangle" | "circle" | "arrow"| "square";
}
