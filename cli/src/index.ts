#! /usr/bin/env node

import { Command } from 'commander';

const program = new Command();

program.version('1.0.0').description('🚧 Terminal-based utility for the blueprint-pdf package.');

program
  .command('generate <schema> <output>')
  .description('Generate a PDF from a Blueprint schema.')
  .option('-d, --data <data>', 'Data to use when generating the PDF.')
  .action((schema, output, options) => {
    console.log('schema', schema);
    console.log('output', output);
    console.log('options', options);
  });

program.parse();

if (program.args.length === 0) {
  program.help();
}
