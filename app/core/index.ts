import fs from "fs";
import http, { Server } from "http";
import express, { Express } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import type { Options } from "http-proxy-middleware";
import dayjs from "dayjs";

export
type ProxyConfig = { [path: string]: Options };

export
class HttpProxy {
  public constructor(
    private readonly port: number,
    private config: ProxyConfig,
    private name = '',
  ) {
    this.Reset();
  }

  private app!: Express;
  private server!: Server;

  public Reset() {
    this.app = express();
    Object.entries(this.config).forEach(([path, config]) => {
      this.app.use(path, createProxyMiddleware(config));
    });
    this.server = http.createServer(this.app);
  }

  public Listen() {
    return new Promise<void>((resolve, reject) => {
      if (this.server.listening) resolve();
      else {
        try {
          this.server.listen(this.port, () => resolve());
        } catch (error) {
          reject(error);
        }
      }
    });
  }

  public Close() {
    return new Promise<void>((resolve, reject) => {
      if (!this.server.listening) resolve();
      else {
        try {
          this.server.close((error?: Error) => {
            if (error) reject(error);
            else resolve();
          });
        } catch (error) {
          reject(error);
        }
      }
    });
  }

  public async Restart() {
    await this.Close();
    await this.Listen();
  }

  public async SetConfig(config: ProxyConfig) {
    const listening = this.server.listening;
    await this.Close();
    this.config = config;
    this.Reset();
    if (listening) await this.Listen();
  }

  public set Name(name: string) {
    this.name = name;
  }

  public get Meta() {
    return {
      name: this.name,
      port: this.port,
      listening: this.server.listening,
      config: this.config,
    };
  }
}

export
class HttpProxyHub {
  public constructor() { }

  public store: HttpProxy[] = [];

  public Add(port: number, configCode: string, name = '') {
    if (!name) name = '新建服务_' + dayjs().format('YYYY-MM-DD_HH-mm-ss');
    const jsFileName = `${port}_${name}.js`;
    fs.writeFileSync(jsFileName, 'module.exports =\n' + configCode.trim() + '\n', 'utf8');
  }
}

export default
async function main() {
  console.log('你好，世界');
  const hub = new HttpProxyHub();
  hub.Add(2231, `
{
  // 登录代理
  '/login': {
    target: 'http://' + XSeaHost + ':' + PaaSPort,
    changeOrigin: true,
    headers: { Connection: 'keep-alive' },
    cookieDomainRewrite: '',
    // 混合重构版本需要以下配置
    // router: (req) => {
    //   const pathname = req.url;
    //   const mode = req.query.mode || 'lite';
    //   if (pathname.startsWith('/login')) {
    //     console.log('[登录代理]', pathname, mode);
    //     if (mode === 'pro') {
    //       return 'http://' + XSeaHost + ':' + PaaSPort;
    //     }
    //   }
    // },
  },
  // 显式访问企业版的代理
  '/pro_api': {
    target: 'http://' + XSeaHost + ':' + XSeaPort,
    changeOrigin: true,
    headers: { Connection: 'keep-alive' },
    cookieDomainRewrite: '',
    pathRewrite: { '^/pro_api' : '/api' },
  },
  '/paas': {
    target: 'http://' + XSeaHost + ':' + PaaSPort,
    changeOrigin: true,
    headers: { Connection: 'keep-alive' },
    cookieDomainRewrite: '',
  },
  '/api/paas': {
    target: 'http://' + XSeaHost + ':' + PaaSPort,
    changeOrigin: true,
    headers: { Connection: 'keep-alive' },
    cookieDomainRewrite: '',
  },
  // 微前端支持
  '/old_xsea': {
    target: 'http://' + VueXSeaHost + ':' + VueXSeaPort,
    changeOrigin: true,
    headers: { Connection: 'keep-alive' },
    cookieDomainRewrite: '',
  },
  // 基础代理
  '/api': {
    target: 'http://' + host + ':' + port,
    changeOrigin: true,
    headers: { Connection: 'keep-alive' },
    cookieDomainRewrite: '',
  },
}
  `.trim());
}
