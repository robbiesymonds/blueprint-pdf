#! /usr/bin/env node

import { Command } from 'commander';
import { BlueprintSchema } from '../../core/types';

export function schema(schema: BlueprintSchema) {
  return schema;
}

const program = new Command();

program.version('1.0.0').description('🚧 Terminal-based utility for the blueprint-pdf package.');

program
  .command('generate <schema> <output>')
  .description('Generate a PDF from a Blueprint schema.')
  .option('-d, --data <data>', 'Data to use when generating the PDF.')
  .option('-o, --output <output>', 'Output location to save the file to.')
  .option('--orientation <orientation>', 'Orientation of the PDF to generate.')
  .option('--format <format>', 'Format of the PDF to generate.')
  .action((schema, output, options) => {
    console.log('schema', schema);
    console.log('output', output);
    console.log('options', options);
  });

program.parse();

if (program.args.length === 0) {
  program.help();
}
