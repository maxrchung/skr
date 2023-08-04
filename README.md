# skr

<img width="1840" alt="image" src="https://github.com/maxrchung/skr/assets/3955187/5075ab8b-9fae-4d04-aa4c-2d2540415746">

<img width="1840" alt="image" src="https://github.com/maxrchung/skr/assets/3955187/6b1e42ed-df86-4693-8539-27ac761a62c5">

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

## Docker

I'm dockerizing this and deploying to GCP Cloud Run. First, make sure to build the static site files to `frontend/build`. Then you can build the Docker image from the root. Note so that we only have 1 Docker image. The backend serves the static site through Express on 3000 and runs Socket.IO server on 4000.
