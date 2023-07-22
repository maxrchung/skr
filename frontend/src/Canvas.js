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

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    let isDrawing = false;

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

    const emit = (x0, y0, x1, y1, color) =>
      socket.emit("draw", { x0, y0, x1, y1, color });

    const onMouseDown = (e) => {
      isDrawing = true;
      cursor.x = e.offsetX;
      cursor.y = e.offsetY;
    };

    const onMouseMove = (e) => {
      if (!isDrawing) {
        return;
      }
      emit(cursor.x, cursor.y, e.offsetX, e.offsetY, cursor.color);
      cursor.x = e.offsetX;
      cursor.y = e.offsetY;
    };

    const onMouseUp = (e) => {
      if (!isDrawing) {
        return;
      }
      isDrawing = false;
      emit(cursor.x, cursor.y, e.offsetX, e.offsetY, cursor.color);
    };

    canvas.addEventListener("mousedown", onMouseDown, false);
    canvas.addEventListener("mouseup", onMouseUp, false);
    canvas.addEventListener("mouseout", onMouseUp, false);
    canvas.addEventListener("mousemove", throttle(onMouseMove, 10), false);

    const onDrawEvent = ({ x0, y0, x1, y1, color }) =>
      drawLine(x0, y0, x1, y1, color);

    socket.on("draw", onDrawEvent);
    return () => {
      socket.off("draw", onDrawEvent);
    };
  }, []);

  return (
    <canvas ref={canvasRef} width="666" height="666" className="skr-canvas" />
  );
}
