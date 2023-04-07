import express from 'express';
import { readFileSync } from 'fs';
import { Blueprint, BlueprintSchema } from 'blueprint-pdf';

const app = express();

const TEST_IMAGE = readFileSync('./image.png').toString('base64');
const FONT_TTF = readFileSync('./CalSans.ttf').toString('base64');
const blueprintSchema: BlueprintSchema = (data) => ({
  shapes: [
    {
      type: 'box',
      x: 'center',
      y: 20,
      height: 100,
      width: 100,
      borderRadius: 10,
      backgroundColor: '#3996e6',
      borderWidth: 1,
      borderColor: '#1370ba',
    },
  ],
  text: [
    {
      x: 'center',
      y: 160,
      fontSize: 24,
      color: '#333333',
      text: `Hello ${data.user.name}!`,
      fontFamily: 'Cal Sans',
      textAlign: 'center',
    },
  ],
  images: [
    {
      x: 'center',
      y: 30,
      width: 80,
      height: 80,
      src: TEST_IMAGE,
    },
  ],
  loops: [
    {
      data: data.rows,
      template: (row, i) => ({
        text: [
          {
            x: 30,
            y: 290 + i * 30,
            text: `${row.number}. This item says: ${row.value}`,
          },
        ],
        shapes: [
          {
            type: 'box',
            width: '90%',
            height: 1,
            x: 'center',
            y: 300 + i * 30,
            backgroundColor: '#111111',
          },
        ],
      }),
    },
  ],
  options: {
    fonts: [
      {
        family: 'Cal Sans',
        src: FONT_TTF,
      },
    ],
  },
});

// Return the PDF.
app.get('/', async (_, res) => {
  // Create the Blueprint.
  const blueprint = new Blueprint({
    schema: blueprintSchema,
    data: {
      user: {
        name: 'John Smith',
      },
      rows: Array(100)
        .fill({})
        .map((row, i) => ({ ...row, number: i + 1, value: `Value ${i + 1}` })),
    },
    config: {
      format: 'A4',
      orientation: 'portrait',
    },
  });

  // Render the PDF file.
  const doc = await blueprint.generate('string');
  const buffer = Buffer.from(doc, 'ascii');
  return res.status(200).type('application/pdf; charset=ascii').send(buffer);
});

// Start the server.
app.listen(3000, () => {
  console.log('Server started on port 3000!');
});
