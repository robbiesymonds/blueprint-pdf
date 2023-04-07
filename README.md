# 🚧&nbsp; Blueprint

Flexible PDF templating utility for client-side or server-side generation.

⚡️ *Ultra-lightweight, lightning fast, and no headless browser required.*

💾 *Generating PDFs from the command line? Check out [@blueprint-pdf/cli](https://www.npmjs.com/package/@blueprint-pdf/cli)* now!

📚 *Looking for the Blueprint Editor? [Coming Soon](#)!*


## 📦&nbsp; Installation

Blueprint is available as an [npm package](https://www.npmjs.com/package/blueprint-pdf) for installation.

```sh
yarn add blueprint-pdf
# or
npm install blueprint-pdf
```

## 🚀&nbsp; Usage

Blueprint uses a object-driven schematic to define the visual structure of your PDF. Your Blueprint can incorporate dynamic data to be inserted and modify the structure as needed. Below is a simple example of a schema:

```ts
import { Blueprint, BlueprintSchema } from 'blueprint-pdf';

// The schema defines the visual structure.
const blueprintSchema: BlueprintSchema = (data) => ({
  text: [
    {
      y: 10,
      x: "center",
      fontSize: 20,
      textAlign: "center",
      text: `Hello, ${data.name.first} ${data.name.last}!`,
    },
    {
      x: 10,
      y: 30,
      fontFamily: "Courier",
      text: `You are ${data.age} years old.`,
    }
  ]
})

// Create a new Blueprint instance.
const pdf = new Blueprint({
  schema: blueprintSchema,
  data: {
    name: {
        first: 'John',
        last: 'Doe',
    },
    age: 30
  },
});

// Generate the PDF.
const buffer = await pdf.generate();
```

Then you can simply save the buffer to a file or download it on the client.
```ts
// Node.js (server)
const doc = Buffer.from(buffer, 'ascii');
return res.status(200).type('application/pdf; charset=ascii').send(doc);

// Client-side (browser)
const blob = new Blob([buffer], { type: 'application/pdf' });
const url = URL.createObjectURL(blob);
window.open(url);
```

The `generate()` function can also take an optional argument to specify alternative output formats. The default is `string` but you can also use `arraybuffer` or `blob` to get different data formats.

Multi-page support is automatic, and pages are generated based on the value of the `y` attribute. There is no need to manually add page breaks, or define your schematic in a specific order. Just treat your Blueprint as an infinitely long canvas.

*Need more help? Check out the `examples` directory!*

## 📖&nbsp; Templates

Templates in Blueprint are defined with a strongly-typed schematic that compiles to the necessary [jsPDF](https://parall.ax/products/jspdf) instructions at run-time. Don't forget, you can split up sections of your template into standard variables and functions to keep things clean and reusable.

```ts
import { BlueprintSchema } from 'blueprint-pdf';

const blueprintSchema: BlueprintSchema = (data) => ({
  shapes: [
    {
      type: "box",
      x: 0,
      y: 0,
      height: 100,
      width: "100%",
      backgroundColor: "#E3E3E3",
    },
    {
      type: "circle",
      x: "center",
      y: 10,
      radius: 50,
      backgroundColor: "#2196f3",
    }
  ],
  images: [
    {
      x: "center",
      y: 10,
      width: 80,
      height: 80,
      src: "...", // base64 encoded image.
    },
  ],
  text: [
    {
      x: 10,
      y: 10,
      fontSize: 12,
      fontWeight: 700,
      color: "#2196f3",
      text: `Hello ${data.user}!`,
    }
  ]
})
```

### Statements

**Loops:** Used to repeat content based on an array of data. You can use the built in `loops` array to simplify this process, though spread operators and native `map()` functions will work as expected.

```ts
import { BlueprintSchema } from 'blueprint-pdf';

const blueprintSchema: BlueprintSchema = (data) => ({
  loops: [
    {
      data: data.billables,
      template: (item, i) => ({
        text: [
          {
            x: 10,
            y: 10 + (i * 40),
            fontSize: 12,
            text: `${i}. This item says: ${item}`,
          }
        ],
      })
    }
  ]
})
```

**Conditionals:** Used to show or hide content based on a boolean value. Null-ish values are ignored.

```ts
import { BlueprintSchema } from 'blueprint-pdf';

const blueprintSchema: BlueprintSchema = (data) => ({
  images: [
    {
      x: 20,
      y: 20,
      width: 24,
      height: 24,
      src: data.emailVerified ? CHECKMARK_IMAGE : CROSS_IMAGE,
    },
  ],
  text: [
    data.emailVerified
      ? {
        x: 20,
        y: 50,
        fontSize: 12,
        text: `Email Verified!`,
      } : null,
  ],
})
```


### Styles

Blueprint renders without a headless browser, so you can't use CSS stylesheets. Instead, some common style properties are supported as attributes on the component definitions. Just use auto-complete to discover available options. This list is not exhaustive, but it should cover most use cases. Please open an issue if you have a feature request.


```ts
import { BlueprintSchema } from 'blueprint-pdf';

const blueprintSchema: BlueprintSchema = (data) => ({
  shapes: [
    {
      type: "box",
      x: 0,
      y: 0,
      height: 100,
      width: "100%",
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "#000000",
      backgroundColor: "#E3E3E3",
    },
  ],
  text: [
    {
      x: "center",
      y: 50,
      fontSize: 20,
      fontWeight: 700,
      fontStyle: "italic",
      textAlign: "center",
      color: "#2196f3",
      text: `Hello, ${data.name.first} ${data.name.last}!`,
    }
  ],
  images: [
    {
      type: "background", // Ensures image is drawn below all other shapes or text.
      x: 0,
      y: 0,
      width: "100%",
      height: "100%",
      src: "...", // base64 encoded image.
    }
  ]
})
```

## 🛠&nbsp; Configuration

The `Blueprint` constructor accepts an optional configuration object.

```ts
const pdf = new Blueprint({
  // ...
  config: {
    format: 'A4',
    orientation: 'portrait',
  }
});
```

The `BlueprintSchema` object also accepts an optional configuration object that allows you to specify some other common parameters. For example loading custom fonts can be done with the `fonts` array, and then simply used by specifying the `fontFamily` attribute on the `text` component.

```ts
import { BlueprintSchema } from 'blueprint-pdf';

const blueprintSchema: BlueprintSchema = (data) => ({
  // ...
  options: {
    fonts: [
      {
        family: 'Roboto',
        src: '...', // base64 encodeded *.ttf file
      },
      {
        family: 'Roboto',
        fontStyle: "italic",
        weight: 700,
        src: '...', // base64 encodeded *.ttf file,
      }
    ]
  }
});
```


