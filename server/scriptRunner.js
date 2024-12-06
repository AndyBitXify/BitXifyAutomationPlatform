import logger from './logger.js';
import { RunnerFactory } from './runners/RunnerFactory.js';

export class ScriptRunner {
  constructor(scriptId, content, type) {
    this.scriptId = scriptId;
    this.content = content;
    this.type = type;
    this.output = '';
    this.status = 'idle';
    this.startTime = null;
    this.runner = RunnerFactory.createRunner(type, scriptId);
  }

  async run() {
    try {
      this.startTime = Date.now();
      this.status = 'running';
      logger.info('Starting script execution', { scriptId: this.scriptId });

      const output = await this.runner.run(this.content);
      this.output = output;
      this.status = 'success';
      
      logger.info('Script completed successfully', { 
        scriptId: this.scriptId,
        executionTime: Date.now() - this.startTime
      });
    } catch (error) {
      this.status = 'failed';
      this.output = `Error: ${error.message}\n${this.output}`;
      
      logger.error('Script execution failed', { 
        scriptId: this.scriptId,
        error: error.message,
        stack: error.stack,
        executionTime: Date.now() - this.startTime
      });
      
      throw error;
    }
  }

  async stop() {
    try {
      await this.runner.stop();
      this.status = 'stopped';
      this.output += '\nScript execution stopped by user';
      
      logger.info('Script stopped by user', { 
        scriptId: this.scriptId,
        executionTime: Date.now() - this.startTime
      });
    } catch (error) {
      logger.error('Failed to stop script', { 
        scriptId: this.scriptId,
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  getStatus() {
    return {
      status: this.status,
      output: this.output,
      executionTime: this.startTime ? Date.now() - this.startTime : 0
    };
  }
}