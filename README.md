# skr

Play: https://skr.maxrchung.com

This is like a [skribbl.io](https://skribbl.io) clone made over a weekend jam with React, HTML Canvas, and socket.io. It mostly only works with desktop as we don't support touches for mobile. I'm currently trying to run this from Firebase Hosting and GKE. If Kubernetes costs/learning is too much I might switch it to Cloud Run.

<img width="1840" alt="image" src="https://github.com/maxrchung/skr/assets/3955187/5075ab8b-9fae-4d04-aa4c-2d2540415746">

<img width="1840" alt="image" src="https://github.com/maxrchung/skr/assets/3955187/6b1e42ed-df86-4693-8539-27ac761a62c5">

## Prerequisites

You need node. I'm using 18.16.0.

- https://nodejs.org/en
- https://nodejs.org/dist/v18.16.0/

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

Deploying to Firebase Hosting.

```bash
firebase deploy
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

Building Docker image.

```bash
docker build . -t maxrchung/skr
docker push maxrchung/skr
```
