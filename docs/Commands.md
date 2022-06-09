### serve host and remotes
```
npx nx serve host --devRemotes=shop,payment,about,search
```

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

### show graph

```
npx nx graph
```