import React from "react";

interface Props {
  sprite: (string | null)[][];
  size?: number; // pixel size per cell
  className?: string;
}

export default function PixelSprite({ sprite, size = 3, className = "" }: Props) {
  const height = sprite.length;
  const width = sprite[0]?.length || 0;

  return (
    <div
      className={className}
      style={{
        width: width * size,
        height: height * size,
        display: "grid",
        gridTemplateColumns: `repeat(${width}, ${size}px)`,
        gridTemplateRows: `repeat(${height}, ${size}px)`,
        imageRendering: "pixelated",
      }}
    >
      {sprite.flat().map((color, i) => (
        <div
          key={i}
          style={{
            backgroundColor: color || "transparent",
            width: size,
            height: size,
          }}
        />
      ))}
    </div>
  );
}
