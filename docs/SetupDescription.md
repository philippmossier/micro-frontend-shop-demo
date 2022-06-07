## Architektur Überblick
This descritpion uses [faster-builds](https://github.com/nrwl/nx/blob/5251bd73acb5ac52d37b0795e26346b02dba24f7/docs/shared/guides/module-federation/faster-builds.md?plain=1) as reference.

Mit Module Federation, wird eine große Anwendung aufgeteilt in:

1. Eine **Host** Anwendung, welche externe Anwendungen referenziert.
2. **Remote** Anwendungen, die eine einzelne Domain oder ein Feature abbilden. 
Ob die Domain nun eine ganze Seite abbildet oder nur eine kleine subdomain, bleibt dem Team überlassen.

Im folgenden Teil sieht man ein Beispiel einer Anwendung welche aus einer Host App (`host`) und vier remotes (`shop`,`payment`,`about`,`search`) besteht.

Obwohl alle Anwendungen unabhängig voneinander erstellt werden und daher keine Abhängigkeit zwischen ihnen bestehen, kann man sich diese konzeptionell in der folgenden Hierarchie vorstellen.

`Füge Bild ein von Host und remotes`

![Host mit impliziten Abhängigkeiten zu remotes](/shared/guides/module-federation/dep-graph-2.png)

**Hinweis:**
Da der Code einer Codebase typischerweise komplett in Englisch geschrieben wird, verzichtet die nun folgende Implementationsbeschreibung darauf jeden einzelnen Begriff ins Deutsche zu übersetzen.

## Erstellen eines Prototyps

Der beste Weg, um das Setup zu verstehen, ist ein Beispiel. Dieses Kapitel zeigt Schritt für Schritt wie man eine `host` Anwendung mit vier `remotes` erstellt. Die `host` App orchestriert dabei drei `remotes` und definiert dabei folgende `routes`:

1. `/`
2. `/payment`
3. `/about`

Bei `shop` `remote` wurde auf den prefix `shop` verzichtet, somit ist dieses über den `base path` `/` erreichbar.
Das vierte noch fehlende MF `search` stellt keine eigene Seite/Route dar, da dieses zwar ein eigenständiges MF ist, jedoch Teil des `shop` remotes ist.
Diese Konstellation wurde bewusst gewählt um `vertical-split` (Seiten basierte) und `horizontal-split` (Komposition basierte) MF darstellen zu könnnen.
Abgesehen davon kann die Suche und das filtern von Produkten sehr komplex werden und oft lohnt es sich dieses als eigenes MF `search` herauszutrennen.

Der Quellcode ist öffentlich über dieses github Repository verfügbar  [microFrontends-monorepo](https://github.com/philippmossier/nx-wmf-react-shop-demo)

Der erste Schritt ist das erstellen eines leeren Arbeitsplatzes, in diesen Fall spricht man von einem `workspace` oder `monorepo`.
Eine `workspace` bzw. `monorepo` stellt eine Sammlung von `apps` dar, welche auch als `micro frontends` oder `remotes` bezeichnet werden können.
Technisch gesehen handelt es sich bei dem `host` app genauso um ein `micro frontend`, jedoch wird dieses nicht als `remote` bezeichnet. Ein `remote` zeichnet sich dadurch aus das dieses immer von einem anderen Teil der Anwendung konsumiert wird (in diesem Fall vom `host`). Der `host` wiederum, konsumiert/lädt und orchestriert die einzelnen `remotes`.
Das bedeutet *nicht* das ein `remote` kein anderes `remotes` konsumieren kann. Lediglich das bereitstellen von Code (`expose`) ist eine Vorraussetzung für ein `remote`.
In vielen codebases wird die `host` Anwendung auch `shell` oder `application-shell` genannt, bedeuten jedoch dasselbe.

Die jeweiligen Kommandozeilen Befehle die zum erstellen des Prototyps verwendet werden, sind in folgende Gruppen unterteilt:
- Linux Befehle (cd, mkdir)
- Node Package Manager Befehle (npm, npx)
- NX-CLI Befehle (nx generate, nx serve)

Da Node und Linux Befehle jedem Frontend Entwickler vertraut sein sollten, werde ich lediglich auf die NX-CLI Befehle näher eingehen.

Bei NX(https://nx.dev/) handelt is sich um ein Build System was von Frontend Experten entwickelt wurde. NX ist ein Produkt des Unternehmens nrwl (https://nrwl.io/) welches von Angular Teammitgliedern und ehemaligen Google Mitarbeitern gegründet wurde. NX betitelt deren Produkt als "Smart, Fast and Extensible Build System. Next generation build system with first class monorepo support and powerful integrations". 
Da es sich bei NX um ein "Build System & Monorepo Tool" handelt wird die NX-CLI vorwiegend zum konfiguirieren und verwalten des monorepos verwendet. Es werden zwar auch Befehle verwendet wie `nx serve` um code auszuführen, diese sind jedoch sehr ähnlich zu einem über npm ausgeführtem Befehl wie `npm serve`. 
Mittels NX-CLI lassens sich viele Befehle ausführen die man zum entwickeln einer Frontend Anwendung benätigt. Der eigentliche Quellcode wird durch NX nicht beeinflusst, lediglich das aufsetzen, verwalten und arbeiten innerhalb einer Codebasis wird dadurch erleichtert.

Um die NX-CLI zu verwenden kann man entweder `nx` oder `npx nx` verwenden. Die kürzere Version `nx` funktioniert jedoch nur wenn man `nx` global auf seinen Rechner mittels `npm install --global nx` installiert. Mit dem prefix npx (was für `node package execute` steht) kann man auch nicht installierte `node packages` ausführen. Es ist also ganz egal ob man `npx nx` oder `nx` verwendet.

Mithilfe von NX lässt sich eine Codebases in verschiedene Projekte aufteilen und das alles in einem zentral verwaltetem `monorepo`. Die Nx-CLI bietet Befehle für den Betrieb und die Verwaltung der verschiedenen Teile der Codebasis.
Diese Befehle fallen in drei Kategorien:

- Auf Code reagieren bzw. Code ausführen (build, serve, test, run, run-many...)
- Code ändern/generieren (generate, create-nx-workspace...)
- Verständnis der Codebasis (graph, list..)

Im ersten Schritt muss zuerst ein monorepo erstellt werden. Mithilfe der NX-CLI option `--preset` kann man ein monorepo erstellen welches bereits auf ein bestimmtes Framework vorkonfiguriert ist, oder einfach ein leeres monorepo erstellen. In unserem Fall erstellen wir ein leeres monorepo und bauen uns schrittweise eine Micro-Frontend-Landschaft auf. 

```
npx create-nx-workspace@14.2.1 microfrontends-monorepo --preset=empty --nxCloud=true
cd microfrontends-monorepo
```

Info: Die Version 14.2.1 wurde nur deswegen explizit gewählt da diese zum Zeitpunkt der Erstellung der Anwendung die neueste Version der "stable versions" war. Die Option --nxCloud ist dabei optional da diese lediglich die built Zeiten durch caching verkürzt. Da nxCloud jedoch umsonst ist und keine Registrierung benötigt kann diese problemlos ausgewählt werden.

Dieser Befehl erstellt ein minimal vorkonfiguriertes monorepo setup mit folgender Ordnerstruktur:

```treeview
├── apps
├── libs
├── node_modules
└── tools
```

Nutzer des Frameworks react müssen noch das Plugin `@nrwl/react` installieren.

```
npm install --save-dev @nrwl/react@14.2.1
```

Mittels @nrwl/react lassen sich nun host und remote Applikationen generieren.

```bash
npx nx generate @nrwl/react:host host --remotes=shop,payment,about,search --style=@emotion/styled
```

Info: Wenn man die Option --style weglässt dann bekommt man von der CLI eien Reihe von Stylesheet-Formaten zur Auswahl. Welches man dabei wählt ist Geschmacksache. In diesen Fall wurde mit "@emotion/styled" eine "CSS in JS" Variante gewählt. 

Nun fehlt nur noch ein Befehl um die `host` Anwendung im Browser anzusehen. Folgender Befehl startet die `host` Anwendung:

```bash
npx nx serve host --open
```

Der obige Befehl serviert den Host im Entwicklungsmodus, während die Remotes statisch erstellt und bereitgestellt werden. Das heißt, Änderungen am Host aktualisieren sein Bundle, aber Änderungen an Remotes werden nicht aktualisiert.

Wenn man auch die `remotes` dynamisch im Entwicklermodus starten möchte kann man dies mit der option `--devRemotes` tun:

```bash
npx nx serve host --open --devRemotes=shop,cart
```

Info: Beide Befehle servieren das ganze System. Mittels "--devRemotes" konfiguriert man nur welche Teile sich davon ändern werden. Was bedeuted das bei "npx nx serve host --open" die remotes nicht automatisch auf Änderungen im Code reagieren und diese nicht sofort im Browser sichtbar machen. Nur ein "browser page refresh" macht die Code Änderungen im Browser sichtbar. (deswegen die Bezeichnung statisch und nicht dynamisch)

## Was wurde generiert ?

Um zu verstehen wie Module Federation mit NX funktioniert, lass uns einen Blick auf die drei Dateien werfen die dieses Feature kontrollieren.

First commit: BREAK HERE
---

### `apps/host/project.json`

The `build` target uses `@nrwl/web:webpack` for React, and `@nrwl/angular:webpack-browser` for Angular. This is the same as a normal SPA that uses custom webpack configuration (`webpackConfig`), but difference is in the webpack configuration file.

If you use Module Federation to speed up your CI and improve your local development, and not to deploy different remotes independently, you need to create implicit dependencies from the host to all the remotes. Semantically, the host and the remotes comprise one application, so you cannot build the host without the remotes. Adding implicit dependencies also makes distributed builds possible ([see below](#production-build-and-deployment)). To create these dependencies, add the `implicitDependencies` configuration.

```text
// apps/host/project.json
{
  //...
  "implicitDependencies": ["about", "shop", "cart"]
}
```

In the future, Nx may automatically handle this for you.

### `apps/host/webpack.config.js`

The webpack configuration uses an utility function that Nx provides: `withModuleFederation`.

```javascript
// For Angular, you'll see `@nrwl/angular/module-federation`
const withModuleFederation = require('@nrwl/react/module-federation');
const moduleFederationConfig = require('./module-federation.config');
module.exports = withModuleFederation({
  ...moduleFederationConfig,
});
```

We'll talk about [what `withModuleFederation` does](#what-does-withmodulefederation-do) in a bit, but for now the important part of the configuration is the use of `module-federation.config.js` which we will examine next.

### `apps/host/module-federation.config.js`

This file is the main configuration for the `host`, and you'll see `module-federation.config.js` for the generated remotes as well.

```javascript
module.exports = {
  name: 'host',
  remotes: ['shop', 'cart', 'about'],
};
```

The required `name` property is the magic to link the host and remotes together. The `host` application references the three remotes by their names.

> Note: It is important that the values in `remotes` property matches the `name` property of the remote applications. Otherwise, webpack will throw an error. Nx handles this automatically for you so there shouldn't be an issue unless it was modified manually.
## What does `withModuleFederation` do?

In the previous section, we saw `withModuleFederation` used in the webpack config. This function is an abstraction on top of webpack's `ModuleFederationPlugin` with some Nx-specific behavior.

- All libraries (npm and workspace) are shared singletons by default, so you don't manually configure them.
- Remotes are referenced by name only, since Nx knows which ports each remote is running on (in development mode).

With Nx, the developer experience (DX) when working with Module Federation matches more closely to development on a SPA. You don't have to worry about managing a bunch of configuration, and most things just work out of the box.

### Excluding or overriding shared libraries

There are cases where excluding or changing the shared configuration is required. For example, shared libraries are not tree shaken, so to enable this behavior you must exclude them from being shared.

To exclude a library or change its configuration, you can provide the `shared: (libraryName, sharedConfig) => sharedConfig` function in your configuration file.

```javascript
// module-federation.config.js
module.exports = {
  name: 'host',
  remotes: ['shop', 'cart', 'about'],
  shared: (name, config) => {
    // We want lodash to be tree shaken, and bundled into each host/remote separately.
    if (name === 'lodash') {
      return false;
    }
  },
};
```

The `shared` function can return an `undefined` to use Nx's default value, `false` to exclude it from being shared, or a [shared config](https://webpack.js.org/plugins/module-federation-plugin/#sharing-hints) that webpack supports.

> Note: The default configuration, without overrides, should work well for most workspaces, and we encourage you to analyze your bundles before optimizing the shared behavior.
>
> To analyze your bundle, run build with `--statsJson` and use a tool like [`webpack-bundle-analyzer`](https://www.npmjs.com/package/webpack-bundle-analyzer) to the size of your bundles.
>
> If you have any feedback regarding this feature, we'd love to hear from you--check our [community page](https://nx.dev/community) for links to our Slack and Twitter.
## Distributed computation caching with Nx Cloud

To use Module Federation well, we recommend that you enable [Nx Cloud](https://nx.app). If you haven't enabled it yet when using `create-nx-workspace`, you can do the following.

```bash
nx connect-to-nx-cloud
```

With Nx Cloud enabled, a large set of builds can be skipped entirely when running the application locally (and in CI/CD). When you run builds through Nx + Nx Cloud, the artifacts are stored in the distributed cache, so as long as the source of a given remote hasn't changed, it will be served from cache.

You can see this behavior locally if you serve the `host` twice.

```bash
nx serve host
# (kill server)
nx serve host
```

The second serve starts up much faster, because the three remotes (`shop`, `cart`, `about`) are read from cache. Not only that, any other copy of the workspace will also benefit from the cache if they haven't changed a particular remote. If, say, someone is working on `shop`, they will get the `cart` and `about` builds from the cache.

If you inspect the terminal output, you'll see something like this, even if you are on different machines.

```bash
> nx run about:build:development  [existing outputs match the cache, left as is]
 (snip)
 >  NX   Successfully ran target build for project about
   Nx read the output from the cache instead of running the command for 1 out of 1 tasks.
```

> This caching behavior is _crucial_. If you don't have a build system supporting distributed computation caching, using Module Federation will be slower. It takes longer to build `shop`, `cart` and `about` separately than building all of them together as part of the same process. **When using Nx, you rarely have to build all of them because most of the time you work on one remote, other remotes will be retrieved from cache.**
This also helps things like end-to-end (E2E) testing because testing against a static server is much more efficient than starting many servers in development mode. When the CI pipeline runs E2E tests, all the remotes should be served statically from cache.

In addition to computation caching, Nx Cloud also comes with:

- Distributed task execution, which simplifies your CI/CD setup, and speeds up your builds.
- GitHub integration, so you can easily access important information without digging through a bunch of CI/CD logs.
- Actionable insights, which improve caching and task distribution.

![Nx Cloud run details](/shared/guides/module-federation/nx-cloud.png)

## Production build and deployment with Nx Cloud

In this section, we'll examine how to set up your production build and simulate a deployment to `http://localhost:3000`.

First, make sure you have implicit dependencies from `host` to each remote. In case you didn't already set this up, add the following line to the `host`'s project configuration.

```text
// apps/host/project.json
{
  //...
  "implicitDependencies": ["about", "shop", "cart"]
}
```

Next, open up the production webpack configuration file and update the remote URLs to their own subfolder under `http://localhost:3000`.

```javascript
// apps/host/webpack.config.prod.js
const withModuleFederation = require('@nrwl/react/module-federation');
const moduleFederationConfig = require('./module-federation.config');
module.exports = withModuleFederation({
  ...moduleFederationConfig,
  remotes: [
    ['shop', 'http://localhost:3000/shop'],
    ['cart', 'http://localhost:3000/cart'],
    ['about', 'http://localhost:3000/about'],
  ],
});
```

Now you can run `nx build host` to build all the `host` and all the implicit dependencies in production mode.

> Again, if you don't use [Nx Cloud's Distributed Tasks Execution](/using-nx/dte) using Module Federation will be slower than building everything in a single process. It's only if you enable Distributed Tasks Execution, your CI will be able to build each remote on a separate machine, in parallel, (or not build it at all and retrieve it from cache), which will reduce the CI time.
After running that command you'll see the following artifacts in `dist` folder.

```treeview
dist/apps
├── about
├── cart
├── host
└── shop
```

Now, we can add a simple deploy command to simulate deploying this folder to production.

```bash
nx g nx:run-commands \
deploy \
--project=host \
--command="rm -rf production && mkdir production && cp -r dist/apps/host/* production && cp -r dist/apps/{shop,cart,about} production && http-server -p 3000 -a localhost production"
```

You can then run `nx deploy host` to see the application running on `http://localhost:3000`. If you inspect the `production` folder you'll see the following files.

```treeview
production/
├── about
│   ├── remoteEntry.js
│   └── (snip)
├── cart
│   ├── remoteEntry.js
│   └── (snip)
├── shop
│   ├── remoteEntry.js
│   └── (snip)
├── index.html
└── (snip)
```

The above command is just an example. You'll need to use what make sense for your team and workspace.

For examples of how CI/CD pipelines can be configured using Nx Cloud and GitHub, see our [React](https://github.com/nrwl/react-module-federation)
and [Angular](https://github.com/nrwl/ng-module-federation) examples.

## Using buildable libs

By using Module Federation you essentially split your application build process vertically. You can also split it horizontally by making some libraries buildable.

We don't recommend making all libraries in your workspace buildable--it will make some things faster but many other things slower. But in some scenarios making a few large libraries at the bottom of your graph buildable can speed up your CI.

Because Nx Cloud's Distributed Tasks Execution works with any task graph, having buildable libraries is handled automatically. If you have a buildable `components` library that all remotes depend on, Nx Cloud will build the library first before building the remotes.

## Summary

You could use Module Federation to implement [micro frontends](/module-federation/micro-frontend-architecture), but this guide showed how to use it to speed up your builds.

Module Federation allows you to split a single build process into multiple processes which can run in parallel or even on multiple machines. The result of each build process can be cached independently. For this to work well in practice you need to have a build system supporting distributed computation caching and distributed tasks execution (e.g., Nx + Nx Cloud).

When a developer runs say `nx serve host --devRemotes=cart`, they still run the whole application, but `shop` and `about` are served statically, from cache. As a result, the serve time and the time it takes to see the changes on the screen go down, often by an order of magnitude.

When a CI machine runs say `nx build host --configuration=production`, the `shop`, `about` and `cart` remotes will either be build on separate machines or retrieved from cache. Once all of them are built, the build process for `host` will combine the file artifacts from all the remotes. Nx Cloud takes care of distributing the tasks and moving file artifacts across machines. As a result, the worst case scenario build time (when nothing is cached) goes from building all the code to building the largest remote, which is often an order of magnitude faster.

## Resources

- [React Module Federation example](https://github.com/nrwl/react-module-federation)
- [Angular Module Federation example](https://github.com/nrwl/ng-module-federation)