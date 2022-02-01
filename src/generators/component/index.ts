import Generator, {GeneratorOptions} from 'yeoman-generator';
import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import walker from 'walker';


export function littleCamel(name: string) {
  return name.replace(/^[\d|\W]*|\W*$/g, '').replace(/^([A-Z])/, a => a.toLowerCase()).replace(/\W+([a-zA-Z1-9])/g, (res, a) => a.toUpperCase());
}

export function bigCamel(name: string) {
  return name.replace(/^[\d|\W]*|\W*$/g, '').replace(/^([a-z])/, a => a.toUpperCase()).replace(/\W+([a-zA-Z1-9])/g, (res, a) => a.toUpperCase());
}

export function pascal(name: string) {
  return name.replace(/^[\d|\W]*|\W*$/g, '').replace(/^([A-Z])/, a => a.toLowerCase()).replace(/\W*([0-9A-Z])/g, (res, a) => `-${a.toLowerCase()}`).replace(/\W+([a-z])/g, (res, a) => `-${a.toLowerCase()}`);
}

export interface IOptions {
  name: string;
  react: boolean;
  type: string;
  tags: string[];
}

export default class CompGenerator extends Generator {
  answer: IOptions | null = null;

  constructor(args: string | string[], opts: GeneratorOptions) {
    super(args, opts);
  }

  async prompting() {
    const answer: IOptions = await this.prompt([{
      type: 'input',
      name: 'name',
      message: 'component name'
    }, {
      type: 'list',
      name: 'type',
      choices: ['class', 'function'],
      message: 'what kind of the component?',
      default: this.config.get('type') || 'class'
    }]);

    this.answer = answer;
    return answer;
  }



  writing() {
    const sourceRoot = this.sourceRoot();
    const name = this.answer?.name || '';
    const destination = this.destinationPath(`src/components/${pascal(name)}`);
    fs.ensureDirSync(destination);
    this.destinationRoot(destination);
    return new Promise<void>((resolve, reject) => {
      walker(sourceRoot)
        .on('dir', (dir: string) => {
          const relativePath = path.relative(sourceRoot, dir);
          if (relativePath) {
            fs.ensureDirSync(this.destinationPath(relativePath));
            this.log(`${chalk.green('create')} dir ${relativePath}`);
          }
        })
        .on('file', (file: string) => {
          const relativePath = path.relative(sourceRoot, file);
          if (relativePath) {
            this.fs.copyTpl(file, this.destinationPath(relativePath), {
              name,
              type: this.answer?.type,
              bigCamelName: bigCamel(name),
              pascalName: pascal(name),
            });
          }
        })
        .on('end', () => {
          resolve();
        })
        .on('error', (err: Error) => {
          reject(err);
        });
    });
  }


  end() {
    this.log('component init finished !!!');
  }
}