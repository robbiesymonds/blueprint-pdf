type BlueprintSchema<T = Record<string, any>> = (data: T | undefined) => Partial<{
  text: Array<BlueprintTextSchema | undefined | null>;
  images: Array<BlueprintImageSchema | undefined | null>;
  shapes: Array<BlueprintShapeSchema | undefined | null>;
  loops: Array<BlueprintLoopsSchema | undefined | null>;
  options: BlueprintSchemaOptions;
}>;

type BlueprintSchemaOptions = {
  fonts: Array<BlueprintFontSchema>;
};

type BlueprintPosition = number | 'center' | `${number}%`;

interface BlueprintPositionSchema {
  x: BlueprintPosition;
  y: BlueprintPosition;
}

interface BlueprintSizeSchema extends BlueprintPositionSchema {
  width: number | `${number}%`;
  height: number | `${number}%`;
}

interface BlueprintTextSchema extends BlueprintPositionSchema {
  text: string;
  fontSize?: number;
  fontFamily?: string;
  fontStyle?: string;
  fontWeight?: string | number;
  color?: string;
  textAlign?: 'left' | 'center' | 'right';
}

interface BlueprintImageSchema extends BlueprintSizeSchema {
  src: string;
  rotation?: number;
  type?: 'background';
}

interface BlueprintShapeBoxSchema extends BlueprintSizeSchema {
  type: 'box';
  borderRadius?: number;
  backgroundColor?: string;
  borderWidth?: number;
  borderColor?: string;
}

interface BlueprintShapeCircleSchema extends BlueprintPositionSchema {
  type: 'circle';
  radius: number;
  backgroundColor?: string;
  borderWidth?: number;
  borderColor?: string;
}

type BlueprintShapeSchema = BlueprintShapeBoxSchema | BlueprintShapeCircleSchema;

interface BlueprintFontSchema {
  src: string;
  family: string;
  weight?: string | number;
  style?: string;
}

type BlueprintFormat = 'A2' | 'A3' | 'A4' | 'A5' | 'letter' | 'card' | [number, number];

type BlueprintLoopsTemplate<T> = (
  data: T,
  index: number,
) => Partial<{
  text: Array<BlueprintTextSchema>;
  images: Array<BlueprintImageSchema>;
  shapes: Array<BlueprintShapeSchema>;
}>;

type BlueprintLoopsSchema<K = Record<string, any>> = {
  data: Array<K>;
  template: BlueprintLoopsTemplate<K>;
};

export { BlueprintSchema, BlueprintFormat, BlueprintPosition, BlueprintImageSchema };
