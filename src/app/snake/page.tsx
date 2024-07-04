"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";

export default function Home() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [direction, setDirection] = useState<string>("right");
    const [snake, setSnake] = useState([
        { x: 60, y: 60 },
        { x: 80, y: 60 },
        { x: 100, y: 60 },
        { x: 120, y: 60 },
        { x: 120, y: 80 },
        { x: 120, y: 100 },
    ]);

    const drawBackground = useCallback(() => {
        const canvas = canvasRef.current!;
        const context = canvas.getContext("2d")!;
        // Set the grid line color to light gray
        context.clearRect(0, 0, canvas.width, canvas.height);

     

        context.strokeStyle = "white";
        context.lineWidth = 0.5;

        // Draw the grid
        for (let x = 0; x <= canvas.width; x += 20) {
            context.beginPath();
            context.moveTo(x, 0);
            context.lineTo(x, canvas.height);
            context.stroke();
        }

        for (let y = 0; y <= canvas.height; y += 20) {
            context.beginPath();
            context.moveTo(0, y);
            context.lineTo(canvas.width, y);
            context.stroke();
        }
    }, []);

    const drawSnake = useCallback(() => {
        const canvas = canvasRef.current!;
        const context = canvas.getContext("2d")!;
        context.fillStyle = "green";
        snake.forEach((segment) => {
            context.fillStyle = "green";

            context.beginPath();
            const radius = 10;
            context.moveTo(segment.x + radius, segment.y);
            context.lineTo(segment.x + 20 - radius, segment.y);
            context.quadraticCurveTo(segment.x + 20, segment.y, segment.x + 20, segment.y + radius);
            context.lineTo(segment.x + 20, segment.y + 20 - radius);
            context.quadraticCurveTo(segment.x + 20, segment.y + 20, segment.x + 20 - radius, segment.y + 20);
            context.lineTo(segment.x + radius, segment.y + 20);
            context.quadraticCurveTo(segment.x, segment.y + 20, segment.x, segment.y + 20 - radius);
            context.lineTo(segment.x, segment.y + radius);
            context.quadraticCurveTo(segment.x, segment.y, segment.x + radius, segment.y);
            context.fill();
        });

        // Draw a circle in front of the snake
        const head = snake[0];
        const circleX = head.x - 5;
        const circleY = head.y + 10;
        const circleRadius = 5;
        context.beginPath();
        context.arc(circleX, head.y + 5, circleRadius, 0, 2 * Math.PI);
        context.fillStyle = "red";
        context.fill();
        context.beginPath();
        context.arc(circleX, head.y + 15, circleRadius, 0, 2 * Math.PI);
        context.fillStyle = "red";
        context.fill();
    }, [snake]);

    const moveSnake = useCallback(
        (direction: string) => {
            const head = { ...snake[0] };

            switch (direction) {
                case "up":
                    head.y -= 20;
                    break;
                case "down":
                    head.y += 20;
                    break;
                case "left":
                    head.x -= 20;
                    break;
                case "right":
                    head.x += 20;
                    break;
            }

            const newSnake = [head, ...snake.slice(0, -1)];
            setSnake(newSnake);

            // context.clearRect(0, 0, canvas.width, canvas.height);
        },
        [snake]
    );

    useEffect(() => {
        const canvas = canvasRef.current!;
        const context = canvas.getContext("2d")!;
        const handleKeyDown = (event: KeyboardEvent) => {
            console.log("event", event);
            switch (event.key) {
                case "ArrowUp":
                    setDirection("up");
                    break;
                case "ArrowDown":
                    setDirection("down");
                    break;
                case "ArrowLeft":
                    setDirection("left");
                    break;
                case "ArrowRight":
                    setDirection("right");
                    break;
            }
            drawBackground();
            moveSnake(direction);
            drawSnake();
        };
        window.addEventListener("keydown", handleKeyDown);

        if (context) {
            drawBackground();
            drawSnake();
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [drawBackground, drawSnake, moveSnake, direction]);

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         moveSnake(direction);
    //     }, 200);

    //     return () => clearInterval(interval);
    // }, [direction, moveSnake]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-between" style={{ backgroundImage: "url(/background.png)", backgroundSize: "cover", backgroundRepeat: "no-repeat" }} >
            <canvas ref={canvasRef} width="1000" height="800"  />
        </div>
    );
}
