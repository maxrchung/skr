// Reference: https://dev.to/jerrymcdonald/creating-a-shareable-whiteboard-with-canvas-socket-io-and-react-2en

import { useEffect, useRef } from "react";
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

export default function Canvas() {
  const canvasRef = useRef(null);
  const clearRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    let isDrawing = false;

    const clear = clearRef.current;

    const cursor = {
      color: "black",
    };

    const drawLine = (x0, y0, x1, y1, color) => {
      context.beginPath();
      context.moveTo(x0, y0);
      context.lineTo(x1, y1);
      context.strokeStyle = color;
      context.lineWidth = 2;
      context.stroke();
      context.closePath();
    };

    const emitDraw = (x0, y0, x1, y1, color) =>
      socket.emit("draw", {
        type: "DRAW",
        data: { x0, y0, x1, y1, color },
      });

    const onMouseDown = (e) => {
      isDrawing = true;
      cursor.x = e.offsetX;
      cursor.y = e.offsetY;
    };

    const onMouseMove = (e) => {
      if (!isDrawing) {
        return;
      }
      emitDraw(cursor.x, cursor.y, e.offsetX, e.offsetY, cursor.color);
      cursor.x = e.offsetX;
      cursor.y = e.offsetY;
    };

    const onMouseUp = (e) => {
      if (!isDrawing) {
        return;
      }
      isDrawing = false;
      emitDraw(cursor.x, cursor.y, e.offsetX, e.offsetY, cursor.color);
    };

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mouseout", onMouseUp);
    canvas.addEventListener("mousemove", throttle(onMouseMove, 10));

    clear.addEventListener("click", () =>
      socket.emit("draw", { type: "CLEAR" })
    );

    const onDrawEvent = (message) => {
      console.log(`Draw message: ${message}`);

      switch (message.type) {
        case "DRAW":
          const { x0, y0, x1, y1, color } = message.data;
          drawLine(x0, y0, x1, y1, color);
          break;

        case "CLEAR":
          context.clearRect(0, 0, canvas.width, canvas.height);
          break;

        default:
          console.log(`Unknown message: ${message}`);
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
      <div className="tools">
        <button>eraser</button>
        <button ref={clearRef}>clear whole canvas!!!!!!!!!!!!!!!</button>
      </div>
    </div>
  );
}
