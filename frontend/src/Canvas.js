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

export default function Canvas({ drawerId, lobbyId }) {
  const displayRef = useRef(null);
  const cursorRef = useRef(null);

  const [color, setColor] = useState("black");
  const colorRef = useRef("black");
  useEffect(() => {
    colorRef.current = color;
  }, [color]);

  const drawerIdRef = useRef(drawerId);
  useEffect(() => {
    drawerIdRef.current = drawerId;
  }, [drawerId]);

  const [brushSize, setBrushSize] = useState(5);
  const brushSizeRef = useRef(brushSize);
  useEffect(() => {
    brushSizeRef.current = brushSize;
  }, [brushSize]);

  const [eraserSize, setEraserSize] = useState(20);
  const eraserSizeRef = useRef(eraserSize);
  useEffect(() => {
    eraserSizeRef.current = eraserSize;
  }, [eraserSize]);

  useEffect(() => {
    const display = displayRef.current;
    const displayCtx = display.getContext("2d");
    displayCtx.lineCap = "round";

    const cursor = cursorRef.current;
    const cursorCtx = cursor.getContext("2d");
    cursorCtx.lineCap = "round";

    let isDrawing = false;
    const position = { x: 666999, y: 666999 };

    const emitDraw = (x1, y1) => {
      // Only allow drawer to send draws when that becomes supported
      if (socket.id !== drawerIdRef.current) {
        return;
      }

      socket.emit("draw", {
        type: "DRAW",
        data: {
          x0: position.x,
          y0: position.y,
          x1,
          y1,
          color: colorRef.current,
          size:
            colorRef.current === "white"
              ? eraserSizeRef.current
              : brushSizeRef.current,
        },
        lobbyId,
      });
    };

    const emitCursor = (x, y) => {
      // Only allow drawer to send draws when that becomes supported
      if (socket.id !== drawerIdRef.current) {
        return;
      }

      socket.emit("draw", {
        type: "CURSOR",
        data: {
          x,
          y,
          color: colorRef.current,
          size:
            colorRef.current === "white"
              ? eraserSizeRef.current
              : brushSizeRef.current,
        },
        lobbyId,
      });
    };

    const onMouseDown = (e) => {
      isDrawing = true;
      position.x = e.offsetX;
      position.y = e.offsetYY;
      emitDraw(e.offsetX, e.offsetY);
    };

    const onMouseMove = (e) => {
      emitCursor(e.offsetX, e.offsetY);

      if (isDrawing) {
        emitDraw(e.offsetX, e.offsetY);
      }

      position.x = e.offsetX;
      position.y = e.offsetY;
    };

    const onMouseUp = (e) => {
      if (!isDrawing) {
        return;
      }
      isDrawing = false;
      emitDraw(e.offsetX, e.offsetY);
    };

    cursor.addEventListener("mousedown", onMouseDown);
    cursor.addEventListener("mouseup", onMouseUp);
    cursor.addEventListener("mouseout", onMouseUp);
    cursor.addEventListener("mousemove", throttle(onMouseMove, 10));

    const onDrawEvent = (message) => {
      // Conditional check so logs aren't slammed too hard
      if (message.type !== "DRAW" && message.type !== "CURSOR") {
        console.log("draw", message);
      }

      switch (message.type) {
        case "DRAW": {
          const { x0, y0, x1, y1, color: drawColor, size } = message.data;
          displayCtx.beginPath();
          displayCtx.moveTo(x0, y0);
          displayCtx.lineTo(x1, y1);
          displayCtx.strokeStyle = drawColor;
          displayCtx.lineWidth = size;
          displayCtx.stroke();
          displayCtx.closePath();
          break;
        }

        case "CLEAR": {
          displayCtx.clearRect(0, 0, display.width, display.height);
          break;
        }

        case "CURSOR": {
          const { x, y, size, color: drawColor } = message.data;
          cursorCtx.clearRect(0, 0, cursor.width, cursor.height);
          cursorCtx.beginPath();
          cursorCtx.arc(x, y, size / 2, 0, 2 * Math.PI);

          cursorCtx.fillStyle = drawColor;
          cursorCtx.fill();

          if (drawColor === "white") {
            cursorCtx.strokeStyle = "black";
          } else {
            cursorCtx.strokeStyle = "white";
          }

          cursorCtx.lineWidth = 1;
          cursorCtx.stroke();
          break;
        }

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
      <div>
        <canvas className="display" ref={displayRef} width="666" height="666" />
        <canvas
          className={`cursor ${drawerId === socket.id ? "hide-cursor" : ""}`}
          ref={cursorRef}
          width="666"
          height="666"
        />
      </div>

      {drawerId === socket.id && (
        <div>
          <button onClick={() => setColor("black")}>brush</button>
          <input
            type="range"
            min="1"
            max="100"
            onChange={(event) => {
              setBrushSize(event.target.value);
              setColor("black");
            }}
            value={brushSize}
          />

          <button onClick={() => setColor("white")}>eraser</button>
          <input
            type="range"
            min="1"
            max="100"
            onChange={(event) => {
              setEraserSize(event.target.value);
              setColor("white");
            }}
            value={eraserSize}
          />

          <button
            onClick={() => socket.emit("draw", { type: "CLEAR", lobbyId })}
          >
            clear whole canvas!!!
          </button>
        </div>
      )}
    </div>
  );
}
