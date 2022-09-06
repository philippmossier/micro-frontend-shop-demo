# Micro Frontend Demo

🛠️ build with

- Module Federation
- NX-Monorepo
- React
- Typescript

## Micro Frontend Architecture

![Micro Frontend Architecture](/docs/architecture.png)

---

💡 For a german description visit the docs folder

## CLI commands

### Start project (Serve host and remotes)

```
npx nx serve host --devRemotes=shop,payment,about,search
```

The host app and the remotes are now accessable on:

- host: `http://localhost:4200/`
- shop: `http://localhost:4201/`
- payment: `http://localhost:4202/`
- about: `http://localhost:4203/`
- search: `http://localhost:4204/`

💡 Last time tested on 06.Sept 2022 with node 16.17.0

### Test selected apps from root directory

```
npx nx test shop
npx nx test host
npx nx run-many --target=test --projects=shop,search
npx nx run-many --target=test --projects=shop,search --parallel=2
```

### Test all apps

```
npx nx run-many --target=test --all
```

### Understand your workspace dependencies

```
npx nx graph
```

### Simulate host deployment

```
npx nx g @nrwl/workspace:run-command deploy --project=host \
--command="rm -rf production && mkdir production && \
cp -r dist/apps/host/* production && \
cp -r dist/apps/shop production && \
cp -r dist/apps/payment production && \
cp -r dist/apps/search production && \
cp -r dist/apps/about production && \
http-server -p 3000 -a localhost production"
```

The deploy command got stored into `nx deploy host` and is now ready for execution!

## Well done

If you wan't a detailed german setup description visit the docs folder.

---

## Other usefull commands

### Generate an application

Run `nx g @nrwl/react:app my-app` to generate an application.

> You can use any of the plugins above to generate applications as well.

When using Nx, you can create multiple applications and libraries in the same workspace.

### Generate a library

Run `nx g @nrwl/react:lib my-lib` to generate a library.

> You can also use any of the plugins above to generate libraries as well.

Libraries are shareable across libraries and applications. They can be imported from `@nx-wmf-react-shop-demo/mylib`.

### Development server

Run `nx serve my-app` for a dev server. Navigate to <http://localhost:4200/>. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `nx g @nrwl/react:component my-component --project=my-app` to generate a new component.

### Build

Run `nx build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Running unit tests

Run `nx test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

### Running end-to-end tests

Run `nx e2e my-app` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

## Further help

Visit the [Nx Documentation](https://nx.dev) to learn more.
