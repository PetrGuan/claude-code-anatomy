import React, { useMemo } from "react";

interface Props {
  sprite: (string | null)[][];
  size?: number;
  className?: string;
}

// Renders pixel art using a single div with box-shadow — O(1) DOM nodes instead of O(width*height)
function PixelSpriteInner({ sprite, size = 3, className = "" }: Props) {
  const height = sprite.length;
  const width = sprite[0]?.length || 0;

  const boxShadow = useMemo(() => {
    const shadows: string[] = [];
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const color = sprite[y][x];
        if (color) {
          shadows.push(`${x * size}px ${y * size}px 0 0 ${color}`);
        }
      }
    }
    return shadows.join(",");
  }, [sprite, size, height, width]);

  return (
    <div
      className={className}
      style={{
        width: width * size,
        height: height * size,
        position: "relative",
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          boxShadow,
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />
    </div>
  );
}

export default React.memo(PixelSpriteInner);
