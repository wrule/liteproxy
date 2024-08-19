import fs from "fs";
import path from "path";
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

  private async getAllConfigs() {
    const prefix = path.join(process.cwd(), './configs/');
    const configs = fs.readdirSync(prefix)
      .filter((name) => fs.statSync(path.join(prefix, name)).isFile())
      .filter((name) => name.endsWith('.js'))
      .filter((name) => /^\d+\./.test(name))
      .map((name) => {
        const segs = name.split('.');
        return {
          port: Number(segs[0]),
          name: segs[1],
          config: { } as any,
          jsFilePath: path.join(prefix, name),
        };
      });
    const imports = await Promise.all(configs.map((config) => import(/* @vite-ignore */config.jsFilePath)));
    configs.forEach((config, index) => {
      config.config = imports[index].default;
    });
    return configs;
  }

  public Add(port: number, configCode: string, name = '') {
    if (!name) name = '新建服务_' + dayjs().format('YYYY-MM-DD_HH-mm-ss');
    const jsFilePath = path.join('./configs/', `${port}.${name}.js`);
    fs.writeFileSync(jsFilePath, 'export default\n' + configCode.trim() + '\n', 'utf8');
    this.getAllConfigs();
  }
}

export default
async function main() {
  console.log('你好，世界');
  const hub = new HttpProxyHub();
  hub.Add(2231, `
{
  '/': {
    target: 'http://xfiregod.perfma-inc.com/',
    changeOrigin: true,
  },
}
  `.trim());
}
