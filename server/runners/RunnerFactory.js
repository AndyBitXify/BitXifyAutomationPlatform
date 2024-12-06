import { PowerShellRunner } from './PowerShellRunner.js';
import { BashRunner } from './BashRunner.js';

export class RunnerFactory {
  static createRunner(type, scriptId) {
    switch (type) {
      case 'powershell':
        return new PowerShellRunner(scriptId);
      case 'bash':
        return new BashRunner(scriptId);
      default:
        throw new Error(`Unsupported script type: ${type}`);
    }
  }
}