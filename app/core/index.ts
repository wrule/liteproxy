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

  private configPath(port: number) {
    return path.join(process.cwd(), 'configs', `${port}.js`);
  }

  public loadConfig(port: number) {
    const params = Object.fromEntries(fs.readFileSync(this.configPath(port), 'utf8')
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.startsWith('//'))
      .map((line) => line.slice(2).trim())
      .map((line) => line.split('=').map((seg) => seg.trim()).filter((seg) => seg))
      .filter((segs) => segs.length >= 2)
      .map((segs) => [segs[0], segs[1]]));
    return {
      name: params.name || '未命名',
      enabled: params.enabled !== 'false',
    };
  }

  private saveConfig(port: number, configCode: string) {

  }

  private async dimport(jsFilePath: string) {
    try {
      return await import(/* @vite-ignore */jsFilePath);
    } catch (error) {
      console.log(error);
      return { default: { } };
    }
  }
}

export default
async function main() {
  console.log('你好，世界');
  const hub = new HttpProxyHub();
  console.log(hub.loadConfig(9021));
}
