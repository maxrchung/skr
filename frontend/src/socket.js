// Reference: https://socket.io/how-to/use-with-react

import { io } from "socket.io-client";

const url =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_PROD_ENDPOINT
    : "http://localhost:4000";

export const socket = io(url);
