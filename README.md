# skr

<img width="1840" alt="image" src="https://github.com/maxrchung/skr/assets/3955187/5075ab8b-9fae-4d04-aa4c-2d2540415746">

<img width="1840" alt="image" src="https://github.com/maxrchung/skr/assets/3955187/27ee1e34-d185-46ba-ac77-4adfc78203a8">


This is like a skribblio clone. Made over a weekend jam with React, HTML Canvas, and socket.io. By the way this only works on desktop, mobile is gonna have a bad time sorry.

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
