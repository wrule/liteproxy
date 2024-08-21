import fs from "fs";
import path from "path";
import http, { Server } from "http";
import express, { Express } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import type { Options } from "http-proxy-middleware";
import dayjs from "dayjs";

export
async function dimport(jsFilePath: string) {
  try {
    return (await import(/* @vite-ignore */jsFilePath)).default ?? { };
  } catch (error) {
    console.log(error);
    return { }
  }
}

export
type ProxyConfig = { [path: string]: Options };

export
class HttpProxy {
  public constructor(private readonly port: number) {
    this.app = express();
    this.server = http.createServer(this.app);
  }

  private app: Express;
  private server: Server;

  private async dimport(jsFilePath: string) {
    try {
      return (await import(/* @vite-ignore */jsFilePath)).default ?? { };
    } catch (error) {
      console.log(error);
      return { }
    }
  }

  private readonly dirPath = path.join(process.cwd(), 'configs');

  private configPath(port: number) {
    return path.join(this.dirPath, `${port}.js`);
  }

  private async loadConfig(port: number) {
    const lines = fs.readFileSync(this.configPath(port), 'utf8').split('\n');
    const params = Object.fromEntries(
      lines
        .map((line) => line.trim())
        .filter((line) => line.startsWith('//$'))
        .map((line) => line.slice(3).trim())
        .map((line) => line.split('=').map((seg) => seg.trim()).filter((seg) => seg))
        .filter((segs) => segs.length >= 2)
        .map((segs) => [segs[0], segs[1]])
    );
    return {
      port,
      name: params.name || '未命名',
      enabled: params.enabled !== 'false',
      config: await this.dimport(this.configPath(port)),
      configCode: lines.filter((line) => !line.trim().startsWith('//$')).join('\n'),
    };
  }

  public async Load() {

  }

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

  private readonly dirPath = path.join(process.cwd(), 'configs');

  private configPath(port: number) {
    return path.join(this.dirPath, `${port}.js`);
  }

  private allPorts() {
    return fs.readdirSync(this.dirPath)
      .filter((name) => /\d+\.js/.test(name))
      .filter((name) => fs.statSync(path.join(this.dirPath, name)).isFile())
      .map((name) => Number(name.replace('.js', '')));
  }

  private async loadConfig(port: number) {
    let lines: string[] = [];
    try {
      lines = fs.readFileSync(this.configPath(port), 'utf8').split('\n');
    } catch (error) {
      console.log(error);
      return null;
    }
    const params = Object.fromEntries(
      lines
        .map((line) => line.trim())
        .filter((line) => line.startsWith('//$'))
        .map((line) => line.slice(3).trim())
        .map((line) => line.split('=').map((seg) => seg.trim()).filter((seg) => seg))
        .filter((segs) => segs.length >= 2)
        .map((segs) => [segs[0], segs[1]])
    );
    return {
      port,
      name: params.name || '',
      enabled: params.enabled === 'true',
      configPath: this.configPath(port),
      configCode: lines.filter((line) => !line.trim().startsWith('//$')).join('\n'),
    };
  }

  private async listConfig(pageNum: number, pageSize: number) {
    if (pageNum < 1) pageNum = 1;
    if (pageSize < 1) pageSize = 1;
    const allConfigs = (await Promise.all(this.allPorts().map((port) => this.loadConfig(port))))
      .filter((config) => config);
    const total = allConfigs.length;
    const pageCount = Math.ceil(total / pageSize);
    if (pageNum > pageCount) pageNum = pageCount;
    return {
      total, pageNum, pageSize, pageCount,
      list: allConfigs.slice((pageNum - 1) * pageSize, pageNum * pageSize),
    };
  }

  private saveConfig(port: number, configCode: string, name: string, enabled: boolean) {
    fs.writeFileSync(
      this.configPath(port),
      `//$ name = ${name}\n//$ enabled = ${enabled}\n${configCode}\n`,
      'utf8',
    );
  }

  private addConfig(port: number, configCode: string, name: string, enabled: boolean) {
    if (this.allPorts().includes(port)) throw Error('duplicate port');
    return this.saveConfig(port, configCode, name, enabled);
  }

  private deleteConfig(port: number) {
    fs.rmSync(this.configPath(port));
  }

  public Add(port: number, configCode: string, name: string, enabled: boolean) {
    return this.addConfig(port, configCode, name, enabled);
  }

  public Remove(port: number) {
    return this.deleteConfig(port);
  }

  public Update(port: number, configCode: string, name: string, enabled: boolean) {
    return this.saveConfig(port, configCode, name, enabled);
  }

  public Query(pageNum: number, pageSize: number) {
    return this.listConfig(pageNum, pageSize);
  }

  public Find(port: number) {
    return this.loadConfig(port);
  }
}

export default
async function main() {
  console.log('你好，世界');
  const hub = new HttpProxyHub();
}
