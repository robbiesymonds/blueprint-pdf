import { jsPDF } from 'jspdf';
import { BlueprintFormat, BlueprintImageSchema, BlueprintPosition, BlueprintSchema } from './types';

type BlueprintConfig = {
  format: BlueprintFormat;
  orientation: 'portrait' | 'landscape';
};

type BlueprintConstructor<T extends Record<string, any> | undefined> = {
  schema: BlueprintSchema<T>;
  data: T;
  config?: BlueprintConfig;
};

type GenerateType = 'string' | 'arraybuffer' | 'blob';
type GenerateTypeReturn<T extends GenerateType> = T extends 'arraybuffer'
  ? ArrayBuffer
  : T extends 'blob'
  ? Blob
  : string;

const PAGE_FORMATS = {
  A2: [1190.55, 1683.78],
  A3: [841.89, 1190.55],
  A4: [595.28, 841.89],
  A5: [419.53, 595.28],
  letter: [612, 792],
  card: [153, 243],
};

class Blueprint<T extends Record<string, any>> {
  private _config: BlueprintConstructor<T> & { config: BlueprintConfig };
  private _pages: number = 1;

  constructor(config: BlueprintConstructor<T>) {
    this._config = {
      ...config,
      config: {
        orientation: 'portrait',
        ...config.config,
        format: 'A4',
      },
    };
  }

  // Returns the current dimensions of the document wrt. orientation.
  private dim(): { width: number; height: number } {
    const { format, orientation } = this._config.config;
    const [x, y] = typeof format === 'string' ? PAGE_FORMATS[format] : format;
    return orientation === 'portrait' ? { width: x, height: y } : { width: y, height: x };
  }

  // Converts the given percentage to a number relative to dimensions.
  private size(w: number | `${number}%`, h: number | `${number}%`): { w: number; h: number } {
    const { width, height } = this.dim();
    return {
      w: typeof w === 'string' ? (parseFloat(w) / 100) * width : w,
      h: typeof h === 'string' ? (parseFloat(h) / 100) * height : h,
    };
  }

  // Converts the given percentage to a number relative to dimensions, or centers.
  private pos(x: BlueprintPosition, y: BlueprintPosition, w?: number): { x: number; y: number } {
    const { width, height } = this.dim();
    const s = (n: BlueprintPosition, m: number) =>
      n === 'center' ? (m - (w ?? 0)) / 2 : typeof n === 'string' ? (parseFloat(n) / 100) * m : n;

    return {
      x: s(x, width),
      y: s(y, height),
    };
  }

  // Renders the given schema.
  private template(pdf: jsPDF, schema: ReturnType<BlueprintSchema<T>>): jsPDF {
    const { images, shapes, text } = schema;
    const backgrounds = images?.filter((i) => i?.type === 'background');
    const foregrounds = images?.filter((i) => i?.type !== 'background');

    // Move the "cursor" to the correct page based on y and existing pages.
    const page = (y: number, h: number = 0): number => {
      const { height } = this.dim();
      const page = Math.floor((y + h) / height) + 1;
      if (page > this._pages) {
        // Determine how many pages to add.
        const pages = page - this._pages;
        for (let i = 0; i < pages; i++) pdf.addPage();
        this._pages++;
      }

      pdf.setPage(page);
      return y - (page - 1) * height;
    };

    const drawImage = (image: BlueprintImageSchema | null | undefined) => {
      if (!image) return;
      const { w, h } = this.size(image.width, image.height);
      const { x, y } = this.pos(image.x, image.y, image.rotation ? undefined : w);
      const py = page(y, h);
      pdf.addImage(image.src, 'png', x, py, w, h, undefined, 'NONE', image.rotation);
    };

    // Background Images.
    backgrounds?.forEach(drawImage);

    // Shapes.
    if (shapes) {
      for (const shape of shapes) {
        if (!shape) continue;
        const { backgroundColor, borderColor, borderWidth } = shape;
        pdf.setFillColor(backgroundColor ?? '#FFFFFF');
        pdf.setDrawColor(borderColor ?? '#FFFFFF');
        pdf.setLineWidth(borderWidth ?? 0);

        switch (shape.type) {
          case 'box': {
            const { width, height, borderRadius } = shape;
            const { w, h } = this.size(width, height);
            const { x, y } = this.pos(shape.x, shape.y, w);
            const r = borderRadius ?? 0;
            const py = page(y, h);
            pdf.roundedRect(x, py, w, h, r, r, 'FD');
            break;
          }
          case 'circle': {
            const { x, y } = this.pos(shape.x, shape.y);
            const py = page(y, shape.radius);
            pdf.circle(x, py, shape.radius, 'FD');
            break;
          }
        }
      }
    }

    // Text.
    if (text) {
      for (const t of text) {
        if (!t) continue;
        let { x, y } = this.pos(t.x, t.y);
        const { fontSize, fontFamily, fontStyle, color, fontWeight, textAlign, text: value } = t;
        pdf.setFontSize(fontSize ?? 12);
        pdf.setFont(fontFamily ?? 'Helvetica', fontStyle ?? 'normal', fontWeight);
        pdf.setTextColor(color ?? '#000000');
        const py = page(y);
        pdf.text(value, x, py, {
          align: textAlign ?? 'left',
        });
      }
    }

    // Foreground Images.
    foregrounds?.forEach(drawImage);

    return pdf;
  }

  public async generate<T extends GenerateType>(type?: T): Promise<GenerateTypeReturn<T>> {
    return new Promise<GenerateTypeReturn<T>>((resolve, reject) => {
      const { config, schema, data } = this._config;
      const { loops, options, ...compiled } = schema(data);
      this._pages = 1;

      try {
        const pdf = new jsPDF({
          format: typeof config.format === 'string' ? PAGE_FORMATS[config.format] : config.format,
          orientation: config.orientation,
          putOnlyUsedFonts: true,
          precision: 3,
          unit: 'px',
        });

        // Config.
        if (options) {
          if (options.fonts) {
            for (const font of options.fonts) {
              if (!font) continue;
              pdf.addFileToVFS(`${font.family}.ttf`, font.src);
              pdf.addFont(`${font.family}.ttf`, font.family, font.style ?? 'normal', font.weight ?? 'normal');
            }
          }
        }

        this.template(pdf, compiled);

        // Loops.
        if (loops) {
          for (const loop of loops) {
            if (!loop) continue;
            const lc = loop.data?.map(loop.template);
            for (const c of lc) {
              this.template(pdf, c);
            }
          }
        }

        switch (type) {
          case 'arraybuffer':
            resolve(pdf.output('arraybuffer') as GenerateTypeReturn<T>);
            break;
          case 'blob':
            resolve(pdf.output('blob') as GenerateTypeReturn<T>);
            break;
          default:
            resolve(pdf.output() as GenerateTypeReturn<T>);
            break;
        }
      } catch (error) {
        reject(error);
      }
    });
  }
}

export { Blueprint, BlueprintSchema };
