import shell from 'shelljs';
import fs from 'fs/promises';
import logger from '../logger.js';

export class BashRunner {
  constructor(scriptId) {
    this.scriptId = scriptId;
    this.process = null;
  }

  async run(content) {
    const tempFile = `temp_${this.scriptId}.sh`;

    try {
      await fs.writeFile(tempFile, content);
      await fs.chmod(tempFile, '755');

      return new Promise((resolve, reject) => {
        let output = '';
        
        this.process = shell.exec(tempFile, { async: true });

        this.process.stdout.on('data', data => {
          output += data;
          logger.debug('Bash output', { scriptId: this.scriptId, output: data });
        });

        this.process.stderr.on('data', data => {
          output += data;
          logger.warn('Bash error', { scriptId: this.scriptId, error: data });
        });

        this.process.on('close', async code => {
          this.process = null;
          
          if (code === 0) {
            resolve(output);
          } else {
            reject(new Error(`Script exited with code ${code}`));
          }
        });
      });
    } finally {
      try {
        await fs.unlink(tempFile);
      } catch (error) {
        logger.error('Failed to remove temp file', { scriptId: this.scriptId, error });
      }
    }
  }

  async stop() {
    if (this.process) {
      try {
        this.process.kill();
        this.process = null;
      } catch (error) {
        logger.error('Failed to stop Bash script', { scriptId: this.scriptId, error });
        throw error;
      }
    }
  }
}