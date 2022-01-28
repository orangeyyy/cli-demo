import { Command } from 'commander';

import pkg from '../package.json';

export const exec = () => {
  const program = new Command();
  program.version(pkg.version);
  program.argument('<name>', 'user name');
  program.option('-d, --debug', 'output debug info');
  program.option('-t, --input-type <type>', 'input type');
  program.action((name, { debug, inputType }) => {
    console.log('---', name, debug, inputType);
  });

  program.hook('preAction', () => {
    console.log('*** pre-action');
  });

  program
    .command('init <name> [type]')
    .option('-n, --new')
    .description('init a project')
    .action((name, type, options) => {
      console.log('*-*', name, type, options);
    })
    .addHelpText(
      'after',
      `

Example call:
  $ bana init hello world -n`
    );

  program.addHelpText('beforeAll', `hello world ******`);

  program.parse();

  console.log('+++', program.opts().debug, program.opts().inputType);
};
