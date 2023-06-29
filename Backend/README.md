# ShopAloud Backend

## Description
This is the backend for the ShopAloud service. It accepts a websocket connection from the widget to collect user audio, mouse position, scroll position, click events, and dom mutations. User audio is uploaded to S3 and the rest of the data is stored in a Postgres database.

## Local Development
This backend development is setup using:
- [Node.js](https://nodejs.org/en/) for running the server
- [Express](https://expressjs.com/) for the server framework
- [TypeScript](https://www.typescriptlang.org/) for type safety
- [Yarn](https://yarnpkg.com/) for package management
- [AWS S3](https://aws.amazon.com/s3/) for storing user audio
- [Prisma](https://www.prisma.io/) for interacting with the Postgres database
- [Socket.io](https://socket.io/) for the websocket connection
- [Nodemon](https://nodemon.io/) for restarting the server on file changes

Run `yarn setup` to setup the dependencies and prisma. Then run `yarn dev` to start the dev server. The dev server will be available at http://localhost:4001

### Env
To setup a local environment you will need to create a `.env` file in the root of the project. The variables located in the `.env.example` file can be used as a template.

## Endpoints
### Socket 'Connection'
This is the initial connection to the backend. The socket will be authenticated and the user will be created if they don't already exist. The user id will be stored on the socket and used for all subsequent requests.

### Socket 'disconnect'
This is called when the socket disconnects. The user will be marked as disconnected, but no action will be taken on the user's session in case they reconnect (possibly just a page navigation).

### Socket "recording:start"
This is called when the user starts recording. The user's session will be created and the session id will be stored on the socket. Audio data will be processed through the socket.

### Socket "recording:end"
This is called when the user stops recording. The user's session will be marked as ended and the session id will be removed from the socket. Audio data will no longer be processed through the socket and the existing chunks will be uploaded to S3

### Other Socket 'events'
All other socket events will be processed as user events. The event will be stored in the database with the user id and session id from the socket.

### GET /sessions
This endpoint will return all of the sessions with the corresponding S3 audio url and all the user event data.

### GET /users
This endpoint will return all of the users with the corresponding number of sessions and user event data.

## Hosting
The backend is currently hosted on [Render](https://render.com) via their web service. The build is set up to automatically deploy to Render when a new version is pushed to the `main` branch.

You can currently access the backend at https://shopaloud-be.onrender.com

Example sessions endpoint:
`https://shopaloud-be.onrender.com/sessions`

