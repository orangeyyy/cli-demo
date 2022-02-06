import Generator, { GeneratorOptions } from 'yeoman-generator';
import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import walker from 'walker';

export interface IOptions {
  name: string;
  react: boolean;
  type: string;
  tags: string[];
}

export default class ProjectGenerator extends Generator {
  answer: IOptions | null;

  constructor(args: string | string[], opts: GeneratorOptions) {
    super(args, opts);
    console.log('***', opts);
    this.argument('path', { type: String, required: false });

    this.option('prettier');
    this.answer = null;
  }

  async prompting() {
    const answer: IOptions = await this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'project name'
      },
      {
        type: 'confirm',
        name: 'react',
        message: 'is a React project?',
      },
      {
        type: 'list',
        name: 'type',
        choices: ['JS', 'TS', 'ES'],
        message: 'what kind of the project?',
        default: 'TS',
      },
      {
        type: 'checkbox',
        name: 'tags',
        choices: [
          {
            name: '文档',
            value: 'doc',
          },
          {
            name: '应用',
            value: 'app',
            checked: true,
          },
          {
            name: '组件库',
            value: 'comp',
            disabled: true,
          },
        ],
        message: 'project tags',
      },
    ]);

    this.answer = answer;
    return answer;
  }

  writing() {
    const sourceRoot = this.sourceRoot();
    this.log(`+++${JSON.stringify(this.answer, null, 2)}`);
    this.log(`prettier: ${this.options.prettier}`);
    this.config.set('react', this.answer?.react);
    this.config.set('type', 'function');
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
              name: this.answer?.name,
              react: this.answer?.react,
              type: this.answer?.type,
              tags: this.answer?.tags,
              path: this.options.path,
              prettier: this.options.prettier,
              escapeStr: '   <div>hello</div>',
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

  install() {
    this.spawnCommandSync('npm', ['install']);
  }

  end() {
    this.config.save();
    this.log('project init finished !!!');
  }
}
