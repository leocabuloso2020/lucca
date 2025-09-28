"use client"

import React, { useMemo } from 'react';

interface ConfettiPiece {
  id: number;
  style: React.CSSProperties;
}

export function ConfettiEffect({ numberOfPieces = 150 }: { numberOfPieces?: number }) {
  const pieces = useMemo(() => {
    const colors = ['#f2ebdd', '#c1a892', '#7a5a43', '#ffffff'];
    return Array.from({ length: numberOfPieces }).map((_, index) => {
      const duration = Math.random() * 3 + 4;
      const delay = Math.random() * 2;
      const initialX = Math.random() * 100;
      const size = Math.random() * 6 + 4;
      const rotation = Math.random() * 360;

      return {
        id: index,
        style: {
          left: `${initialX}vw`,
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: colors[Math.floor(Math.random() * colors.length)],
          transform: `rotate(${rotation}deg)`,
          animation: `confetti-fall ${duration}s linear ${delay}s forwards`,
          top: '-20px',
          position: 'fixed' as 'fixed',
          zIndex: 100,
          opacity: 1,
        },
      };
    });
  }, [numberOfPieces]);

  return (
    <>
      {pieces.map(piece => (
        <div key={piece.id} style={piece.style} />
      ))}
    </>
  );
}