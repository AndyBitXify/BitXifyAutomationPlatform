import { PowerShell } from 'node-powershell';
import fs from 'fs/promises';
import logger from '../logger.js';

export class PowerShellRunner {
  constructor(scriptId) {
    this.scriptId = scriptId;
    this.ps = null;
  }

  async run(content) {
    this.ps = new PowerShell({
      executionPolicy: 'Bypass',
      noProfile: true
    });

    const tempFile = `temp_${this.scriptId}.ps1`;

    try {
      await fs.writeFile(tempFile, content);

      this.ps.on('output', data => {
        logger.debug('PowerShell output', { scriptId: this.scriptId, output: data });
        return data;
      });

      this.ps.on('error', error => {
        logger.error('PowerShell error', { scriptId: this.scriptId, error });
        throw error;
      });

      await this.ps.addCommand(`. "${tempFile}"`);
      const output = await this.ps.invoke();

      return output;
    } finally {
      try {
        await fs.unlink(tempFile);
      } catch (error) {
        logger.error('Failed to remove temp file', { scriptId: this.scriptId, error });
      }
      
      if (this.ps) {
        await this.ps.dispose();
        this.ps = null;
      }
    }
  }

  async stop() {
    if (this.ps) {
      try {
        await this.ps.dispose();
        this.ps = null;
      } catch (error) {
        logger.error('Failed to stop PowerShell script', { scriptId: this.scriptId, error });
        throw error;
      }
    }
  }
}