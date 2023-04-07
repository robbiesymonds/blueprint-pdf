# 🚧&nbsp; Blueprint  CLI

The Blueprint CLI is a command line interface for generating PDFs from schematic templates. It is built on top of the [Blueprint](https://github.com/robbiesymonds/Blueprint) library.


⚙️ *Looking for the Blueprint Library? [Find it here](https://www.npmjs.com/package/blueprint-pdf)!*


## 📦&nbsp; Installation

Blueprint CLI is available as an [npm package](https://www.npmjs.com/package/@blueprint-pdf/cli) for installation.

```sh
npm i -g @blueprint-pdf/cli
```

## 🚀&nbsp; Usage

The CLI is a simplifed interface that allows you to interact with Blueprint without needing to spin up a client-side or server application. Simply define a template as shown below and pass it when calling the `generate` command.

### Specification
Schematics are defined using a `*.js` file that exports a single object. The object must contain a `schema` property that defines the Blueprint as specified by the [Blueprint library](https://github.com/robbiesymonds/Blueprint). You can also optionally define a `data` object inside of this file that will be used as the default data source for the template.

Data can also be passed via the `--data` option when calling the `generate` command. This can be either a JSON string or a path to a JSON file. For example:

**Schematic File:**
```ts
// Path: examples/schema.js

export default {
  schema: (data) => ({
    // ... BlueprintSchema
  });
  data: {
    // ... Record<string, any>
  },
};
```

**Using Inline Data:**
```sh
blueprint generate examples/schema.js --data '{ "name": "John Doe" }'
```

**Using a Data File:**
```sh
blueprint generate examples/schema.js --data examples/data.json
```

**Configuration Options:**
```sh
blueprint generate examples/schema.js --format A3 --orientation landscape
```
