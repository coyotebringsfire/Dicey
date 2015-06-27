# Dicey
diceroller for Amazon Skills Kit Node.js app

## How to Use
Clone (or fork) this repo

edit index.js with the changes for your app. Any node packages that you depend on need to be installed in node_modules. AWS lambda doesn't automatically install dependencies from package.json. When your app is ready to test, run `npm run zip` to generate the zip file or create one yourself by adding index.js and node_modules to a zip. This zip file can then be loaded into AWS lambda by the AWS console

```
AskBoilerplate $ npm run zip

> AskBoilerplate@0.0.1 zip /Users/aumkara/workspace/AskBoilerplate
> npm install && rm -f AskBoilerplate.zip && zip AskBoilerplate.zip index.js node_modules

  adding: index.js (deflated 75%)
  adding: node_modules/ (stored 0%)
AskBoilerplate $
```
or
```
AskBoilerplate $ npm install && zip AskBoilerplate.zip index.js node_modules
updating: index.js (deflated 75%)
updating: node_modules/ (stored 0%)
AskBoilerplate $
```