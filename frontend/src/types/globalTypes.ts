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
  text?: string;
  textColor?: string;
  fontSize?: number;
  fontFamily?: string;
  strokeColor?: string;
  lineWidth?: number;
  isSelected: boolean;
  type: "rectangle" | "circle" | "arrow" | "square" | "text";
}
