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
npx create-nx-workspace@14.2.4 microfrontends-monorepo --preset=empty --nxCloud=true
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
npm install --save-dev @nrwl/react@14.2.4
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

Um zu verstehen wie Module Federation mit NX funktioniert, sind drei Dateien für die Kontrolle dieses Features verantwortlich.

### "apps/host/project.json"

Wenn man einen Blick in die Datei "project.json" wirft sieht man unterschiedliche "targets". Das "build" "target" verwendet "@nrwl/web:webpack" als "executor". Das ist der selbe Prozess wie bei normalen SPA mit einer benutzerdefinierten "webpack configuration". Wenn man Module Federation verwendet  welche eine  beginnt mit benutzt unter "targets.build"

Wenn Module Federation verwendet wird, um die kontinuierliche Bereitsstellung "continious integration ("CI")" zu beschleunigen und die lokale Entwicklung zu verbessern, und nicht, um verschiedene Remotes unabhängig bereitzustellen, müssen implizite Abhängigkeiten zum Host definiert weden. In diesem Fall sind diese impliziten Abhängikeiten die remotes "shop", "payment" und "about".
Das Hinzufügen von impliziten Abhängigkeiten macht auch verteilte Builds möglich.

```
// apps/host/project.json
{
  //...
  "implicitDependencies": ["shop","payment","about"]
}
```

### apps/host/webpack.config.js

Die Webpack-Konfiguration verwendet eine Hilfsfunktion "withModuleFederation", die durch Nx bereitstellt wird.

```
// apps/host/webpack.config.js
const withModuleFederation = require('@nrwl/react/module-federation');
const moduleFederationConfig = require('./module-federation.config');

module.exports = withModuleFederation({
  ...moduleFederationConfig,
});
```

Die Funktion, "withModuleFederation" wird später noch genauer erläutert, aber im Moment ist der wichtige Teil der Konfiguration die Verwendung von "module-federation.config.js", die im folgenden Schritt nun näher untersucht wird.
### apps/host/module-federation.config.js

```
// apps/host/module-federation.config.js
module.exports = {
  name: 'host',
  remotes: ['shop','payment','about'],
};
```

Der erforderliche Wert "name" ist die Magie, um den Host und die Remotes miteinander zu verbinden. Die "host" Anwendung verweist auf drei "remotes mit ihrem Namen.

### Was bedeutet die durch NX bereitgestellte Funktion "withModuleFederation"
Bei dieser Funktion handelt es sich um eine Abstraktion von Webpacks Module Federation Plugin. Somit vereinfacht NX die Webpack Configuration für Module Federation. Im Vergleich dazu würde eine Standard Module Federation Konfiguration ohne NX so aussehen:

```
// Standard webpack.config.js without NX
new ModuleFederationPlugin({
  name: "host",
  filename: "hostRemoteEntry.js",
  remotes: {
    shop: 'shop@http://localhost:4201/shopRemoteEntry.js',
    payment: 'payment@http://localhost:4202/paymentRemoteEntry.js',
    about: 'about@http://localhost:4203/aboutRemoteEntry.js',
  },
  shared: {
    react: { singleton: true, requiredVersion: PACKAGE.dependencies.react },
    "react-dom": { singleton: true, requiredVersion: PACKAGE.dependencies.react },,
    "react-router-dom": { singleton: true, requiredVersion: PACKAGE.dependencies.react },,
    },
})
```

Nun sieht man das ohne NX zusätzlich "filename" und "shared" definiert werden muss. Während "filename" nur auf den "bundle" Namen referenziert, handelt es sich bei "shared" um eine ganz wichtige Funktion die Module Federation bietet, welche im nächsten Kapitel genauer ausgeführt wird. 

Wenn man nun die Standard "webpack.config.js" mit jener von NX vergleicht, sieht man das NX einige Funktionen zur Verfügung stellt wie:
- Alle Bibliotheken (npm und Arbeitsbereich) sind standardmäßig gemeinsam genutzte "singletons", sodass man diese nicht manuell mittels "requiredVersion" konfigurieren muss.
- Bei "remotes" wird nur auf den Namen verwiesen, da Nx weiß, auf welchen Ports jedes Remote läuft (im Entwicklungsmodus).

## Konfigurieren von "remotes"

Im Vergleich zu der "module-federation.config" der "host" Awendung, definiert man bei einem "remote" immer den Wert "exposes", welcher den Pfad zu den geteilten Dateien definiert. Dies kann ein Pfad sein der die kompletten Anwendung teilt z.B. durch "src/App.tsx" oder auch nur einen kleinen Teil vom "remote" teilt wie z.B. eine "Button" Komponente mittels "src/components/Button.tsx".

```
// apps/about/module-federation.config.js
module.exports = {
  name: 'about',
  exposes: {
    './Module': './src/remote-entry.ts',
  },
};
```

Im Grunde sind die Werte "remotes" (Was konsumiert wird) und "exposes" (was geteilt wird) jene Inidikatoren, die die Struktur einer "Module-Federation-Anwendung" beschreiben. Ein "remote" könnte neben der Bereitstellung von Dateien mittels "exposes", auch andere "remotes" konsumieren. In diesem Fall müssen innerhalb der "module-federation.config" zusätzlich "remotes" definiert werden. 

Angenommen es gäbe ein Team welches sich um die Suche und das filtern von Produkten kümmert, und ein Micro Frontend mit den Namen "search" erstellt. Dieses "search" MF oder auch "remote" genannt, soll dann im weiteren Verlauf auf der "/" Route dargestellt werden. Wenn man sich nun noch einmal das Architekturdiagramm XY ansieht, dann erkennt man das auf der "/" Route die "ShopPage" gerendert wird. Nun soll sich also das "shop remote" mit dem "search remote" eine Seite teilen. Das bedeutet das man nun nicht mehr von einer vertikalen Aufteilung von MF spricht ("vertical-split"), sondern von einer horizontalen Komposition ("horizontal-split"). Dieses Ergebnis könnte nun ganz einfach mit folgender "module-federation.config.js" erreicht werden.

```
// apps/about/module-federation.config.js
module.exports = {
  name: 'shop',
  exposes: {
    './Module': './src/ShopPage.tsx',
  },
  remotes: ["search"]
};
```

Dies setzt natürlich vorraus das man innerhalb der Datei "ShopPage.tsx" auch das "search remote" an der gewünschten Stelle im Code platziert, jedoch erkennt man durch dieses Beispiel sofort die hohe Flexibilität die einem Module Federation bietet.

## "sharing dependencies" Module Federations Alleinstellungsmerkmal

Wenn man noch einmal einen Blick in das Kapitel "Was bedeutet die durch NX bereitgestellte Funktion "withModuleFederation"" wirft, sieht man das in der "webpack.config.js" die Option "shared" definiert wurde. Bei dieser Funktion handelt es sich um Webpacks Alleinstellungsmerkmal Abhängigkeiten innerhalb der Micro Frontend Landschaft zu teilen.

Während manche MF-Frameworks wie "mashroom-portal" gar keine Möglichkeiten bieten "dependencies" zu teilen, bieten andere MF-Frameworks wie "single-spa" oder "piral" nur bedingt Möglichkeiten an.
Bei "single-spa" könnte man diese über sogenannte "import-maps" teilen, welche von einigen Browsern jedoch nicht unterstützt werden.

Dabei ist das teilen von "dependencies" von sehr großer Bedeutung da dies großen Einfluss auf die "bundle-size" einer Webseite hat. Wenn eine Seite z.B. aus mehreren MF besteht ("horizontal-split") und auf dieser mehrmals das selbe Framework, eventuell noch mit unterschiedlichen Versionen geladen wird, dann kann das drastische Folgen für die Performance einer Webapplikation haben.

Module Federation, bietet mittels "shared" eine sehr einfache und umfangreiche Funktion "dependencies" zu teilen. Zusätzlich hat man durch die Optionen "singleton", "requiredVersion" und "eager" die vollständige Kontrolle über das Teilen von Abhängigkeiten. Mittels "singleton" lässt sich steuern das die Abhängigkeit nur einmal geladen werden darf. Mit "eager" kann man dafür sorgen das diese Abhängigkeiten immer als erstes geladen werden anstatt diese über eine asynchrone Anforderung abzurufen. 

Wenn man nun die Standard "webpack.config.js" mit jener von NX vergleicht, sieht man das NX einige Funktionen zur Verfügung stellt wie:
- Alle Bibliotheken (npm und Arbeitsbereich) sind standardmäßig gemeinsam genutzte "singletons", sodass man diese nicht manuell mittels "requiredVersion" konfigurieren muss.
- Bei "remotes" wird nur auf den Namen verwiesen, da Nx weiß, auf welchen Ports jedes Remote läuft (im Entwicklungsmodus).

Info: Für den Produktionsmodus muss man url und port manuell in "webpack.config.prod" angeben, da NX nicht wissen kann auf welchen externen Container oder Server die "remote bundle files" abgelegt wurden. Mehr Details zu Deployment gibt es im letzten Kapitel. 

## Teilen von Code ist nicht auf Micro Frontends limitiert

Das teilen von Code, speziell innerhalb eines Module Federation Monorepos, ist nicht nur auf Micro Frontends ("remotes") limitiert. Es könnte auch eine Authentifizierungs-Bibliothek ("auth-lib") zwischen mehreren "remotes" geteilt werden. Diese "auth-lib" würde man in so einem Fall als "common library" bezeichnen, welche ebenfalls Teil des "monorepos" ist. In diesem Fall würde die "auth-lib" anstatt im "apps" Ordner, im "libs" Ordner einen geeigneten Platz finden. Hierzu gibt es einen wunderbar passenden Artikel von "angulararchitects.io" der den Verwendunszweck einer "auth-lib" sehr passend beschreibt.

Diagramm XY zeigt ein MF "shell" und ein MF "mfe1". Beide teilen sich eine gemeinsame Bibliothek zur Authentifizierung "auth-lib", die sich ebenfalls im Monorepo befindet:

FOTO 1: https://www.angulararchitects.io/en/aktuelles/using-module-federation-with-monorepos-and-angular/

Die "auth-lib" stellt zwei Komponenten bereit. Eine meldet den Benutzer an und die andere zeigt den aktuellen Benutzer an. Diese Komponenten werden sowohl von der "Shell" als auch von mfe1 verwendet:

FOTO2:


In einem NX monorepo werden diese "libraries" typischerweise in "path mappings" definiert, welche entweder innerhalb "tsconfig.json" oder "tsconfig.base.json" defiiniert werden (abhängig vom Projekt Setup)

```
// tsconfig.json or tsconfig.base.json
"paths": {
    "@demo/auth-lib": [
        "libs/auth-lib/src/index.ts"
    ]
},
```

# Deployment

Da Bibliotheken normalerweise keine Versionen in einem Monorepo haben, sollten immer alle geänderten MF zusammen erneut "deployed" werden. Nx nimmt einem viel Arbeit ab, indem es dabei hilft die geänderten Codeteile aufzuzeigen damit man sofort weiss welche Teile neu "deployed" werden müssen und welche unverändert blieben.

Mit folgendem Befehl kann man den aktuellen "feature branch" gegen den "main branch" vergleichen.
```
nx print-affected --base=main --head=HEAD
```

Zu Beginn muss sichergestellt werden dass implizite Abhängigkeiten vom Host zu jedem Remote richtig definiert wurden. Im "shop remote" muss das "search remote" ebenfalls als implizite Abhängigkeit eingetragen werden. Für das "deployment" sind folgende 2 Dateien von großer Bedeutung. "webpack.config.prod.js" und "project.json"

Innerhalb von "webpack.config.prod.js" ist es wichtig die "remote urls" anzugeben. 

```
// apps/host/webpack.config.prod.js
const withModuleFederation = require('@nrwl/react/module-federation');
const moduleFederationConfig = require('./module-federation.config');

module.exports = withModuleFederation({
  ...moduleFederationConfig,
  remotes: [
    ['shop', 'http://localhost:3000/shop'],
    ['payment', 'http://localhost:3000/payment'],
    ['about', 'http://localhost:3000/about'],
  ],
});
```

Info: Da dieses "test deployment" lokal simuliert wird, werden auch nur "localhost urls" verwendet. In einer Produktionsumgebung müssen diese gegen echte Pfade ausgetauscht werden wie z.B. "//example.com/path/to/app1/remoteEntry.js". 

```
// apps/host/project.json
{
  //...
  "implicitDependencies": ["shop","payment","about"]
}
```

Die Änderungen der letzten zwei Dateien müssen zusätzlich im "shop remote" vorgenommen werden, da dieses das "search remote" als implizite Abhängikeit aufweist.
Um die Verlinkung des "host" und der "remotes" zu überprüfen, kann man nun den Befehl "nx graph" ausführen.
Die richtige Verlinkung kann man aus folgdender Grafik entnehmen:

GRAPH GRAFIK

Wenn die Projekte richtig verlinkt ist kann der Befehl "npx build host" ausgeführt werden um alle impliziten Abhängigkeiten im Produktionsmodus zu bauen. 
Im dist-Ordner sollte nun folgende Ordnerstruktur zu finden sein :

```treeview
dist/apps
├── about
├── host
├── payment
├── search
└── shop
```

Da nun alle Codepakete für einen "Produktionsbuild" vorhanden sind, kann man diesen mit folgenden Befehl lokal simulieren:
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

Dadurch wird der obige Befehl dem Kürzel "nx deploy host" zugewiesen, und unter "apps/host/project.json" gespeichert. Dadurch wird der Befehl nicht nur im richtigen Projektordner gespeichert, sondern kann dieser nun in Zukunft mit dem Kürzel "nx deploy host" ausgeführt werden. Die lokal "deployte" Anwendung ist nun unter "http://localhost:3000" erreichbar.

Wenn man sich nun den "production" Ordner ansieht dann sollten alle 4 "remotes" die Datei "remoteEntry.js" beinhalten. Die Host Anwendung ist dadurch erkennbar das diese keine "remoteEntry.js" aufweist und deren Dateien den anderen Ordnern übergeordnet sind was folgender "filetree" noch einmal verdeutlicht.

```treeview
production/
├── about
│   ├── remoteEntry.js
│   └── (...)
├── assets
│   └── .gitkeep
├── payment
│   ├── remoteEntry.js
│   └── (...)
├── search
│   ├── remoteEntry.js
│   └── (...)
├── shop
│   ├── remoteEntry.js
│   └── (...)
├── index.html
└── (...)
```

-- BREAK

 zusätzlich in in  Falls Sie dies noch nicht eingerichtet haben, fügen Sie die folgende Zeile zur Projektkonfiguration des Hosts hinzu.

Bevor Stellen Sie zunächst sicher, dass Sie implizite Abhängigkeiten vom Host zu jedem Remote haben. Falls Sie dies noch nicht eingerichtet haben, fügen Sie die folgende Zeile zur Projektkonfiguration des Hosts hinzu.

```
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







 zu Anfang dieses  das diese Suche Teil der "shop" Route wird und wird.
 z.B. ein anderes Team einen "search" Micro Frontend bauen möchte, welches innerhalb des "shop" Micro Frontend angezeigt wird, dann könnte solch eine Konfiguration so ausseheen.

```
// apps/about/module-federation.config.js
module.exports = {
  name: 'shop',
  exposes: {
    './Module': './src/ShopPage.ts',
  },
  remotes: ["search"]
};
```




Micro Frontends können genauso ohne Monorepo gebaut werden. 
Durch die Kombination von Monorepo und Micro Frontend stehen einem alle Möglichkeiten offen zur Strukturiere

Durch die Verwendung von Module Federation wird der Anwendungserstellungsprozess "application build process" im Wesentlichen vertikal aufgeteilt. Auch eine vertikale Aufteilung ist möglich, indem man einige Bibliotheken "libraries" "buildable" macht. NX empfiehlt es nicht, alle Bibliotheken im Arbeitsbereich "buildable" zu machen, aber in einigen Szenarien kann es das "CI" beschleunigen, wenn einige große Bibliotheken am unteren Rand des Diagramms "buildable" gemacht werden.



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