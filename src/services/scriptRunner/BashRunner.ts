import { exec } from 'child_process';
import { promisify } from 'util';
import type { ScriptRunner } from './types';

const execAsync = promisify(exec);

export class BashRunner implements ScriptRunner {
  async execute(script: string): Promise<{ output: string; error?: string }> {
    try {
      // Create a temporary file for the script
      const tempFile = `temp_${Date.now()}.sh`;
      await fs.writeFile(tempFile, script);
      
      // Set proper permissions
      await fs.chmod(tempFile, '755');

      // Execute script
      const { stdout, stderr } = await execAsync(`bash ${tempFile}`);

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