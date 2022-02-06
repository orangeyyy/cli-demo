import Environment from 'yeoman-environment';
import path from 'path';

export default class Env {
  env: Environment;
  constructor() {
    this.env = Environment.createEnv();
    const generatorsPath = path.join(__dirname, 'generators');
    this.env.register(`${generatorsPath}/project`, 'init:project');
    this.env.register(`${generatorsPath}/component`, 'init:component');
  }

  init = async (type: string, opts = {}) => {
    debugger;
    return new Promise<void>((resolve, reject) => {
      this.env.run(`init:${type}`, opts).then(
        (err) => {
          if (err) {
            console.error(err.message || 'got some error!');
            reject();
          }
          resolve();
        },
        (err) => {
          console.error(err.message || 'got some error!');
          reject();
        }
      );
    });
  };
}
