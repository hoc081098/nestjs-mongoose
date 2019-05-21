import * as dotenv from 'dotenv';
import * as fs from 'fs';

export class ConfigService {
  private readonly envConfig: { [key: string]: string };

  constructor(filePath: string) {
    this.envConfig = dotenv.parse(fs.readFileSync(filePath));
    console.log(`[ConfigService::constructor] envConfig=${JSON.stringify(this.envConfig)}`);
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}
