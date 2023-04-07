#! /usr/bin/env node
/// <reference types="node" />

import { Command } from 'commander';
import * as process from 'process';
import { join } from 'path';
import ora from 'ora';
import * as fs from 'fs';

import { Blueprint } from '../..';
import chalk from 'chalk';

const program = new Command();

program.version('1.0.0').description('🚧 Terminal-based utility for the blueprint-pdf package.');

program
  .command('generate <schema>')
  .description('Generate a PDF from a Blueprint schema.')
  .option('-d, --data <data>', 'Data to use when generating the PDF.', undefined)
  .option('-o, --output <output>', 'Output location to save the file to.', './output.pdf')
  .option('--orientation <orientation>', 'Orientation of the PDF to generate.', 'portrait')
  .option('--format <format>', 'Format of the PDF to generate.', 'A4')
  .action(handleGenerate);

program.parse();

if (program.args.length === 0) {
  program.help();
}

async function handleGenerate(input: string, options: Record<string, any>) {
  const { orientation, format, data, output } = options;

  const start = Date.now();
  const s_gen = ora(chalk.dim('Reading schema file...')).start();

  // Check if the schema file exists.
  if (!fs.existsSync(join(process.cwd(), input))) {
    s_gen.fail(chalk.red(`The schema file "${input}" does not exist!`));
    process.exit(1);
  }

  // Dynamically import the blueprint file.
  const mod = await import(join(process.cwd(), input)).then((m) => m.default);

  // Check if the schema file exports a function.
  if (typeof mod !== 'object' || !mod.schema) {
    s_gen.fail(chalk.red(`The schema file "${input}" does not export a valid schematic!`));
    process.exit(1);
  }

  s_gen.succeed();

  // Data from the command line takes precedence.
  const s_data = ora(chalk.dim('Parsing dynamic data...')).start();
  let json: Record<string, any> | undefined = undefined;
  json = mod.data;

  if (data) {
    try {
      // Check if data is a JSON string.
      if (data.startsWith('{')) {
        json = JSON.parse(data);
      }

      // Check if data is a path to a JSON file.
      if (fs.existsSync(join(process.cwd(), data))) {
        json = JSON.parse(fs.readFileSync(join(process.cwd(), data), 'ascii'));
      }
    } catch {
      s_data.fail(chalk.red(`The data provided is not valid JSON!`));
      process.exit(1);
    }
  }

  s_data.succeed();

  // Generate the PDF.
  const s_pdf = ora(chalk.dim('Generating document...')).start();
  const pdf = new Blueprint({
    schema: mod.schema,
    data: json,
    config: {
      orientation,
      format,
    },
  });

  const buffer = await pdf.generate('string');

  // Save the PDF.
  fs.writeFileSync(join(process.cwd(), output), buffer);
  s_pdf.succeed();

  console.log(chalk.bold.green(`✨ Built in ${Date.now() - start}ms`));
}
