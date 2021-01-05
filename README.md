# PROJ_NAME

Developed by IT Minds

This repository contains two services

- [backend](./backend/README.md)
- [frontend](./frontend/README.md)

## Setup

This project is projected by git hooks using [husky](https://typicode.github.io/husky/#/) so be sure to set those up as follows:

```sh
npm i

code itm-proj.code-workspace
```

### backend

```sh
cd backend

dotnet build

dotnet start
```

There's a debug recipe for VSCode as part of the workspace. Otherwise, open the solution file for VS.

### frontend

```sh
cd frontend

npm i

npm run validate

npm run dev
```

There's a debug recipe for VSCode as part of the workspace.
