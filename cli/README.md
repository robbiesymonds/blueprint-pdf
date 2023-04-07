# 🚧&nbsp; Blueprint  CLI

The Blueprint CLI is a command line interface for generating PDFs from schematic templates. It is built on top of the [Blueprint](https://www.npmjs.com/package/blueprint-pdf) library.


⚙️ *Looking for the Blueprint Library? [Find it here](https://www.npmjs.com/package/blueprint-pdf)!*


## 📦&nbsp; Installation

Blueprint CLI is available as an [npm package](https://www.npmjs.com/package/@blueprint-pdf/cli) for installation.

```sh
yarn add -g @blueprint-pdf/cli
# or
npm install -g @blueprint-pdf/cli
```

## 🚀&nbsp; Usage

The CLI is a simplifed interface that allows you to interact with Blueprint without needing to spin up a client-side or server application. Simply define a template as shown below and pass it when calling the `generate` command.

### Templates
The templates for the CLI variant are slightly 

**Using Inline Data:**
```sh
blueprint generate ./schema.json --data '{ "name": "John Doe" }'
```

**Using a Data File:**
```sh
blueprint generate ./schema.json --data ./data.json
```

**Configuration Options:**
```sh
blueprint generate ./schema.json --format A3 --orientation landscape
```
