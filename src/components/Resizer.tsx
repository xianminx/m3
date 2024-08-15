import React, { useState, useRef, useEffect } from 'react';

interface ResizerProps {
  onResize: (newWidth: number) => void;
}

const Resizer: React.FC<ResizerProps> = ({ onResize }) => {
  const resizerRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsResizing(true);
    setStartX(e.clientX);
    setStartWidth(e.target.parentElement!.offsetWidth);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;
    const offset = e.clientX - startX;
    const newWidth = startWidth + offset;
    onResize(newWidth);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      handleMouseMove(e);
    };

    const handleGlobalMouseUp = () => {
      handleMouseUp();
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
    } else {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={resizerRef}
      className="cursor-ew-resize"
      onMouseDown={handleMouseDown}
    />
  );
};

export default Resizer;