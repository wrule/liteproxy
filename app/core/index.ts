import http, { Server } from "http";
import express, { Express } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import type { Options } from "http-proxy-middleware";

export
type ProxyConfig = { [path: string]: Options };

export
class HttpProxy {
  public constructor(
    private readonly port: number,
    private config: ProxyConfig,
    private name = '',
  ) {
    this.app = express();
    Object.entries(this.config).forEach(([path, config]) => {
      this.app.use(path, createProxyMiddleware(config));
    });
    this.server = http.createServer(this.app);
  }

  private app: Express;
  private server: Server;

  public Listen() {
    this.server.listen(this.port);
  }

  public Close() {
    this.server.close();
  }

  public get Name() {
    return this.name;
  }

  public set Name(name: string) {
    this.name = name;
  }

  public get Config() {
    return this.config;
  }

  public set Config(config: ProxyConfig) {
    this.config = config;
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

export default
async function main() {
  console.log('你好，世界');
  const p = new HttpProxy(4001, {
    '/': {
      target: 'http://xfiregod.perfma-inc.com/',
      changeOrigin: true,
    },
  });
  p.Listen();
}
