import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import logger from './logger.js';
import fs from 'fs/promises';
import { authController } from './auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure logs directory exists
const logDir = join(__dirname, 'logs');
try {
  await fs.mkdir(logDir, { recursive: true });
} catch (error) {
  console.error('Failed to create logs directory:', error);
}

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Store running scripts with cleanup handlers
const runningScripts = new Map();
const scriptOutputs = new Map();

io.on('connection', (socket) => {
  logger.info('WebSocket client connected');

  socket.on('disconnect', () => {
    logger.info('WebSocket client disconnected');
  });
});

// Function to broadcast script status updates
const broadcastStatus = (scriptId, status, progress, output = '') => {
  io.emit('scriptStatus', { scriptId, status, progress, output });
};

// Cleanup function for graceful shutdown
const cleanup = async () => {
  logger.info('Server shutting down, cleaning up running scripts...');
  for (const [id, script] of runningScripts.entries()) {
    try {
      if (script.process) {
        script.process.kill();
      }
      logger.info(`Cleaned up script ${id}`);
    } catch (error) {
      logger.error(`Failed to clean up script ${id}:`, error);
    }
  }
  runningScripts.clear();
  process.exit(0);
};

// Handle graceful shutdown
process.on('SIGTERM', cleanup);
process.on('SIGINT', cleanup);

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`Incoming ${req.method} request to ${req.url}`, {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
});

// Auth routes
app.post('/api/auth/login', authController.login);
app.post('/api/auth/register', authController.register);
app.get('/api/auth/profile', authController.getProfile);

app.post('/api/scripts/:id/execute', async (req, res) => {
  const { id } = req.params;
  const { content, type } = req.body;

  if (!content || !type) {
    return res.status(400).json({
      success: false,
      error: 'Script content and type are required',
    });
  }

  if (runningScripts.has(id)) {
    return res.status(400).json({
      success: false,
      error: 'Script is already running',
    });
  }

  logger.info(`Starting script execution`, {
    scriptId: id,
    scriptType: type,
  });

  try {
    const tempFile = join(__dirname, `temp_${id}.ps1`);
    await fs.writeFile(tempFile, content);
    logger.info('Temporary script file created', { scriptId: id, tempFile });

    const startTime = Date.now();

    if (type === 'powershell') {
      const psProcess = spawn('powershell.exe', ['-ExecutionPolicy', 'Bypass', '-File', tempFile]);

      runningScripts.set(id, { process: psProcess });

      let output = '';
      let progress = 0;

      psProcess.stdout.on('data', (data) => {
        const chunk = data.toString();
        const currentOutput = scriptOutputs.get(id) || '';
        const updatedOutput = currentOutput + chunk;
        scriptOutputs.set(id, updatedOutput);
        
        // Calculate progress based on output length
        const progress = Math.min(Math.round((updatedOutput.length / 1000) * 100), 90);
        
        broadcastStatus(id, 'running', progress, updatedOutput);
        logger.info('PowerShell Output', { scriptId: id, output: chunk });
      });

      psProcess.stderr.on('data', (data) => {
        const chunk = data.toString();
        const currentOutput = scriptOutputs.get(id) || '';
        scriptOutputs.set(id, currentOutput + chunk);
        broadcastStatus(id, 'failed', 100, currentOutput + chunk);
        logger.error('PowerShell Error', { scriptId: id, error: chunk });
      });

      psProcess.on('close', (code) => {
        runningScripts.delete(id);
        const finalOutput = scriptOutputs.get(id) || '';
        scriptOutputs.delete(id);
        
        try {
          fs.unlink(tempFile).catch((unlinkError) =>
            logger.error('Failed to delete temporary script file', { scriptId: id, tempFile, error: unlinkError })
          );
        } catch (unlinkError) {
          logger.error('Failed to delete temporary script file', { scriptId: id, tempFile, error: unlinkError });
        }

        if (code === 0) {
          broadcastStatus(id, 'success', 100, finalOutput);
          logger.info('Script execution completed', { scriptId: id, output: finalOutput });
          res.status(200).json({
            success: true,
            output: finalOutput,
            executionTime: Date.now() - startTime,
          });
        } else {
          broadcastStatus(id, 'failed', 100, finalOutput || 'Unknown error');
          logger.error('Script execution failed', { scriptId: id, error: 'Unknown error' });
          res.status(500).json({
            success: false,
            error: 'Unknown error',
          });
        }
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Unsupported script type',
      });
    }
  } catch (error) {
    runningScripts.delete(id);
    logger.error('Script execution error', {
      scriptId: id,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.post('/api/scripts/:id/stop', async (req, res) => {
  const { id } = req.params;
  const runningScript = runningScripts.get(id);

  if (runningScript) {
    try {
      // Kill the process
      if (runningScript.process) {
        process.kill(-runningScript.process.pid);
        runningScript.process.kill();
      }
      
      // Clean up resources
      runningScripts.delete(id);
      
      logger.info('Script stopped successfully', { scriptId: id });
      res.status(200).json({ 
        success: true,
        message: 'Script stopped successfully'
      });
    } catch (error) {
      logger.error('Failed to stop script', { scriptId: id, error });
      res.status(500).json({ 
        success: false,
        error: 'Failed to stop script'
      });
    }
  } else {
    res.status(404).json({
      success: false,
      error: 'No running script found with the given ID'
    });
  }
});

server.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`);
});