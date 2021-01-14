# Comby Oil Controller

![Full Backend Build, Format, and Test](https://github.com/IT-Minds/client_comby_oilcontrols/workflows/Full%20Backend%20Build,%20Format,%20and%20Test/badge.svg?branch=main&event=push)

![Full Frontend Build, Format, and Test](https://github.com/IT-Minds/client_comby_oilcontrols/workflows/Full%20Frontend%20Build,%20Format,%20and%20Test/badge.svg?branch=main&event=push)

![Deploy Backend to Azure Web App](https://github.com/IT-Minds/client_comby_oilcontrols/workflows/Deploy%20Backend%20to%20Azure%20Web%20App/badge.svg?branch=main&event=push)

![Deploy Frontend to Azure Web App](https://github.com/IT-Minds/client_comby_oilcontrols/workflows/Deploy%20Frontend%20to%20Azure%20Web%20App/badge.svg?branch=main&event=push)

_Developed by IT Minds_

This repository contains two services

- [backend](./backend/README.md)
- [frontend](./frontend/README.md)

along with IAC for Azure Web Services

- [iac](./iac/README.md)

and developer / contribution documentation

- [docs](./docs/README.md)

## Development

### Project Setup

This project is projected by git hooks using [husky](https://typicode.github.io/husky/#/) so be sure to set those up as follows:

```sh
npm i

code itm-proj.code-workspace
```

### Backend Setup

```sh
cd backend

dotnet build

dotnet run -p Web
```

There's a debug recipe for VSCode as part of the workspace. Otherwise, open the solution file for VS.

### Frontend Setup

```sh
cd frontend

npm i

npm run validate

npm run dev
```

There's a debug recipe for VSCode as part of the workspace.
