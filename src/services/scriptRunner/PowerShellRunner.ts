import { exec } from 'child_process';
import { promisify } from 'util';
import type { ScriptRunner } from './types';

const execAsync = promisify(exec);

export class PowerShellRunner implements ScriptRunner {
  async execute(script: string): Promise<{ output: string; error?: string }> {
    try {
      // Create a temporary file for the script
      const tempFile = `temp_${Date.now()}.ps1`;
      await fs.writeFile(tempFile, script);

      // Execute with proper security flags
      const { stdout, stderr } = await execAsync(`powershell -NoProfile -NonInteractive -ExecutionPolicy Bypass -File ${tempFile}`);

      // Cleanup
      await fs.unlink(tempFile);

      return {
        output: stdout,
        error: stderr || undefined
      };
    } catch (error) {
      return {
        output: '',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}