import { Command } from 'commander';
import glob from 'glob';
import Init from './yeoman';
import proxy, {close} from './anyproxy';

import pkg from '../package.json';

const init = new Init();

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

  program
    .command('glob')
    .action(() => {
      console.log('$', glob.sync('*.js', {
        ignore: 'node_modules/**/*.js',
        matchBase: true
      }));
      console.log('$$', glob.sync('.*.js'));
      console.log('$$$', glob.sync('*.{js,json,ts}', {
        ignore: 'node_modules/**/*.*',
        matchBase: true
      }));

      console.log('$$$$', glob.sync('c?*.{js,json,ts}', {
        ignore: 'node_modules/**/*.*',
        matchBase: true
      }));
    });

  program
    .command('project')
    .argument('[path]', '地址')
    .option('-p, --prettier', '是否使用prettier')
    .action((path, options) => {
      console.log(path, options);
      init.init('project', {
        prettier: true
      });
    });

  program
    .command('component')
    .action(() => {
      init.init('component');
    });

  program
    .command('proxy')
    .option('-c, -close', 'close the proxy')
    .action((options) => {
      if (options.close) {
        close();
      } else {
        proxy();
      }
    });

  program.parse();

  console.log('+++', program.opts().debug, program.opts().inputType);
};
