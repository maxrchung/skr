// Reference: https://socket.io/how-to/use-with-react

import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const url =
  process.env.NODE_ENV === "production"
    ? window.location.host.replace(":3000", "") + ":4000"
    : "http://localhost:4000";

export const socket = io(url);
