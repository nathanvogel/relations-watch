# [relations.watch](https://relations.watch)

Relations.watch is a collaborative platform to gather knowledge about relations between public figures, companies, medias, etc. Its goal is to enable anyone to efficiently understand conflicts of interests, often at the heart of democratic or environmental issues.

https://relations.watch

Join the discussion on Discord! [https://discord.gg/CHmCMq6](https://discord.gg/CHmCMq6)

# Development

Tech stack:

- TypeScript for everything except ArangoDB Foxx services (JavaScript)
- ArangoDB with Foxx services
- Create-React-App
- React
- Redux
- React-Router
- styled-components
- D3.js for the graph
- yarn over npm
- Prettier please

To get started, clone this repo and run:

```
cd frontend/
yarn install
yarn start
```

You have the frontend, but no local backend, so you have 2 options:
Either setup ArangoDB on your local machine or simply use the production API by modifying /frontend/src/utils/api.ts like this:

```
  // Comment this line:
  // baseURL: process.env.REACT_APP_API_URL,
  // Uncomment this one:
  baseURL: "https://diploman.westeurope.cloudapp.azure.com/api1",
```

Just don't commit this change :)

## Local server setup

Note: this is optional for frontend dev, as you can simply use the production API as described above.

Install ArangoDB according to [the official instructions](https://www.arangodb.com/docs/stable/getting-started-installation.html).
Note: we simply use the default `_system` database.

```
cd backend/service-graph-api
yarn install
```

Then, zip the folder and add it as a Foxx microservice to your local ArangoDB instance according to [the official instructions](https://www.arangodb.com/docs/stable/foxx-getting-started.html#try-it-out).
Use: `/api1` as the mount point and tick "Run setup".

Note: If you want to develop the backend, you'll probably want to have a more automated setup: see [Development mode](https://www.arangodb.com/docs/stable/foxx-guides-development-mode.html) and the Unison commands in /backend/foxx-dev-unison-filesync.md for examples.

Feel free to ask for a local copy of the current data in production.
