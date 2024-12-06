import { PowerShellRunner } from './PowerShellRunner';
import { BashRunner } from './BashRunner';
import type { ScriptRunner } from './types';
import type { Script } from '../../types/script';

export class ScriptRunnerFactory {
  static getRunner(script: Script): ScriptRunner {
    switch (script.type) {
      case 'powershell':
        return new PowerShellRunner();
      case 'bash':
        return new BashRunner();
      default:
        throw new Error(`Unsupported script type: ${script.type}`);
    }
  }
}