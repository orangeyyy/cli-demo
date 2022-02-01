import AnyProxy, {RuleModule, RequestDetail, ResponseDetail} from 'anyproxy';
import cheerio from 'cheerio';

import chalk from 'chalk';

const redirectRule: RuleModule = {
  summary: 'redirect baidu to local file',
  async beforeSendRequest(requestDetail: RequestDetail) {
    if (requestDetail.url.includes('baidu.com')) {
      return {
        response: {
          statusCode: 200,
          header: {
            'Content-Type': 'text/html;charset=utf-8',
          },
          body: `
            <!DOCTYPE html>
            <html>
              <head></head>
              <body>hello you have been proxy by anyproxy</body>
            </html>
          `,
        }
      }
    }
    return null;
  },
  async beforeDealHttpsRequest() {
    return true;
  }
}

const ajustContent: RuleModule = {
  summary: 'adjust content of the response',
  async beforeSendResponse(requestDetail: RequestDetail, responseDetail: ResponseDetail) {
    if (requestDetail.url.includes('baidu.com')) {
      const $ = cheerio.load(responseDetail.response.body);
      $('#s-top-left').prepend('<a href="https://www.taobao.com" _target="blank" class="mnav c-font-normal c-color-t">taobaoXXX</a>')
      $('#s_lg_img').attr('src', 'https://gw.alicdn.com/imgextra/i3/O1CN01uRz3de23mzWofmPYX_!!6000000007299-2-tps-143-59.png');
      return {
        response: {
          ...responseDetail.response,
          body: $.html(),
        }
      }
    }
    return null;
  },
  async beforeDealHttpsRequest() {
    return true;
  }
}


const proxy =new  AnyProxy.ProxyServer({
  port: 8001,
  throttle: 10000,
  rule: ajustContent,
  webInterface: {
    enable: true,
    webPort: 8002
  },
});

export default () => {
  proxy.on('ready', () => {
    console.log(chalk.green('proxy is ready!!!!'));
  });
  
  proxy.on('error', (err) => {
    console.log(chalk.red('proxy has error!!!'), err);
  });
  
  proxy.start();
}

export function close() {
  proxy.close();
  console.log(chalk.blue('close proxy'));
}

