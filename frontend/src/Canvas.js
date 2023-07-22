// Reference: https://dev.to/jerrymcdonald/creating-a-shareable-whiteboard-with-canvas-socket-io-and-react-2en

import { useEffect, useRef, useState } from "react";
import { socket } from "./socket";

const throttle = (callback, delay) => {
  let previousCall = new Date().getTime();
  return function () {
    const time = new Date().getTime();

    if (time - previousCall >= delay) {
      previousCall = time;
      callback.apply(null, arguments);
    }
  };
};

export default function Canvas({ drawerId }) {
  const canvasRef = useRef(null);
  const cursorRef = useRef(null);

  const [color, setColor] = useState("black");
  const colorRef = useRef("black");
  useEffect(() => {
    colorRef.current = color;
  }, [color]);

  const drawerIdRef = useRef(-420);
  useEffect(() => {
    drawerIdRef.current = drawerId;
  }, [drawerId]);

  const [brushSize, setBrushSize] = useState(5);
  const brushSizeRef = useRef(5);
  useEffect(() => {
    brushSizeRef.current = brushSize;
  }, [brushSize]);

  const [eraserSize, setEraserSize] = useState(20);
  const eraserSizeRef = useRef(5);
  useEffect(() => {
    eraserSizeRef.current = eraserSize;
  }, [eraserSize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.lineCap = "round";
    let isDrawing = false;

    const cursor = { x: 666999, y: 666999 };

    const drawLine = (x0, y0, x1, y1, color) => {
      context.beginPath();
      context.moveTo(x0, y0);
      context.lineTo(x1, y1);
      context.strokeStyle = color;
      context.lineWidth =
        color === "white" ? eraserSizeRef.current : brushSizeRef.current;
      context.stroke();
      context.closePath();
    };

    const emitDraw = (x1, y1) => {
      // Only allow drawer to send draws when that becomes supported
      // if (socket.id !== drawerIdRef.current) {
      //   return;
      // }

      socket.emit("draw", {
        type: "DRAW",
        data: {
          x0: cursor.x,
          y0: cursor.y,
          x1,
          y1,
          color: colorRef.current,
        },
      });
    };

    const onMouseDown = (e) => {
      isDrawing = true;
      cursor.x = e.offsetX;
      cursor.y = e.offsetY;
      emitDraw(e.offsetX, e.offsetY);
    };

    const onMouseMove = (e) => {
      if (!isDrawing) {
        return;
      }
      emitDraw(e.offsetX, e.offsetY);
      cursor.x = e.offsetX;
      cursor.y = e.offsetY;
    };

    const onMouseUp = (e) => {
      if (!isDrawing) {
        return;
      }
      isDrawing = false;
      emitDraw(e.offsetX, e.offsetY);
    };

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mouseout", onMouseUp);
    canvas.addEventListener("mousemove", throttle(onMouseMove, 10));

    const onDrawEvent = (message) => {
      // Conditional check so logs aren't slammed too hard
      if (message.type !== "DRAW") {
        console.log("draw", message);
      }

      switch (message.type) {
        case "DRAW":
          const { x0, y0, x1, y1, color } = message.data;
          drawLine(x0, y0, x1, y1, color);
          break;

        case "CLEAR":
          context.clearRect(0, 0, canvas.width, canvas.height);
          break;

        default:
          console.log("Unknown draw", message);
          break;
      }
    };

    socket.on("draw", onDrawEvent);
    return () => {
      socket.off("draw", onDrawEvent);
    };
  }, []);

  return (
    <div className="skr-draw">
      <canvas className="canvas" ref={canvasRef} width="666" height="666" />

      <canvas className="cursor" ref={cursorRef} width="666" height="666" />

      <div>
        <button onClick={() => setColor("black")}>brush</button>
        <input
          type="range"
          min="1"
          max="100"
          onChange={(event) => setBrushSize(event.target.value)}
          value={brushSize}
        />

        <button onClick={() => setColor("white")}>eraser</button>
        <input
          type="range"
          min="1"
          max="100"
          onChange={(event) => setEraserSize(event.target.value)}
          value={eraserSize}
        />

        <button onClick={() => socket.emit("draw", { type: "CLEAR" })}>
          clear whole canvas!!!
        </button>
      </div>
    </div>
  );
}
