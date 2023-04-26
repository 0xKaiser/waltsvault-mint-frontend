# TWL monorepo

## How to use yarn workspaces

- Navigate to the root of the monorepo and run `yarn install` to install all required dependencies for all workspaces.
- Run a command in any of the workspaces by using `yarn workspace <NAME OF THE WORKSPACE> <COMMAND>`. E.g. `yarn workspace passengers-frontend start`. You can find the name of the workspace in its package.json file.
- DO NOT USE `npm` as a package manager!
