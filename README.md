# skr

This is like a skribblio clone. Made over a weekend jam with React, HTML Canvas, and socket.io.

## Prerequisites

You need node. I'm using 18.17.0.

- https://nodejs.org/en
- https://nodejs.org/dist/v18.17.0/

## Frontend

Installing packages.

```bash
cd frontend
npm install
```

Starting dev server.

```bash
npm start
```

Building project.

```bash
npm run build
```

Serving website locally. You may have to forward port 3000 on your router.

```bash
npm install -g serve
serve -s build
```

## Backend

Installing packages.

```bash
cd backend
npm install
```

Starting server and watching for changes.

```bash
npm start
```

Running the server directly. You may have to forward port 4000 on your router if you want to run this publicly.

```bash
node index.js
```
