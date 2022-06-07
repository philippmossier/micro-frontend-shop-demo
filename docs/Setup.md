(https://nx.dev/cli/create-nx-workspace#create-nx-workspace)`
`npx create-nx-workspace@14.2.1 microfrontends-monorepo --preset=empty --nxCloud=true`
*Use Nx Cloud?* Yes | No
*option: `--nxCloud=true|false`*
`cd microfrontends-monorepo`

Microfrontends-Monorepo Folders
├── apps
├── libs
├── node_modules
└── tools

`npm install --save-dev @nrwl/react@14.2.1`

`npx nx g @nrwl/react:host host --remotes=shop,payment,about,search --style=@emotion/styled`
*Which stylesheet format would you like to use* CSS | SASS(.scss) | Stylus(.styl) | LESS | styled-components | emotion | styled-jsx | None
*option: `--style=css|scss|less|styl|styled-components|@emotion/styled|styled-jsx|none`*

apps folder (excl e2e)
├── about
├── host
├── payment
├── search
├── shop

apps folder (inkl e2e)
├── about
├── about-e2e
├── host
├── host-e2e
├── payment
├── payment-e2e
├── search
├── search-e2e
├── shop
└── shop-e2e



Which stylesheet format would you like to use

Microfrontends-Monorepo Folders
├── .vscode
├── apps
├── libs
├── node_modules
└── tools

*Now, serve host to view it in your browser.*
`npx nx serve host --open`
*The above command serves host in development mode, whereas the remotes are built and served statically.*
*That is, changes to host will update its bundle, but changes to remotes will not update.*

*To run one or more remotes in development mode, use the --devRemotes option.*
`nx serve host --open --devRemotes=shop,payment,about,search`
*The above command starts shop,payment,about,search remotes in development mode,*
`nx serve host --open --devRemotes=shop,payment,about`
*The above command starts shop,payment,about remotes in development mode, but search will remain static*
*Note Both commands serve the whole system. By passing --devRemotes, you configure what parts of it you will be changing.*


What was generated?
To understand how Module Federation works with Nx, let's take a look at three files that control this feature.

apps/host/project.json
```
// apps/host/project.json
{
  //...
  "implicitDependencies": ["about", "shop", "cart"]
}
```
apps/host/webpack.config.js
```
const withModuleFederation = require('@nrwl/react/module-federation');
const moduleFederationConfig = require('./module-federation.config');

module.exports = withModuleFederation({
  ...moduleFederationConfig,
});
```

apps/host/module-federation.config.js
```
module.exports = {
  name: 'host',
  remotes: ['shop', 'cart', 'about'],
};
```

### old
# BA commands
node 16.15.1
npm 8.11.0

```bash
npx create-nx-workspace@14.2.1 netflix-clone --preset=empty
OR
npx create-nx-workspace@14.2.1 microfrontends-demo --preset=empty --nxCloud=true
cd netflix-clone
npm install --save-dev @nrwl/react@14.2.1
npx nx g @nrwl/react:host host --remotes=shop,billing,about --style=@emotion/styled
nrwl/react
npx nx serve host --open
npx nx serve host --open --devRemotes=shop,billing,about
```
