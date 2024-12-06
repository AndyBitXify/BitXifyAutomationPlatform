import jwt from 'jsonwebtoken';
import logger from './logger.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// In-memory user storage (replace with a database in production)
const users = new Map();

// Add a test user
users.set('test', {
  id: '1',
  username: 'test',
  password: 'test',
  name: 'Test User',
  department: 'Development',
  role: 'Developer',
  createdAt: new Date().toISOString()
});

export const authController = {
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      const user = users.get(username);

      if (!user || user.password !== password) {
        logger.warn('Login failed: Invalid credentials', { username });
        return res.status(401).json({ 
          success: false, 
          error: 'Invalid username or password' 
        });
      }

      const token = jwt.sign(
        { userId: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      const { password: _, ...userWithoutPassword } = user;

      logger.info('User logged in successfully', { userId: user.id, username });
      
      res.json({
        success: true,
        token,
        user: userWithoutPassword
      });
    } catch (error) {
      logger.error('Login error', { error: error.message, stack: error.stack });
      res.status(500).json({ 
        success: false, 
        error: 'Internal server error' 
      });
    }
  },

  register: async (req, res) => {
    try {
      const { username, password, name, department, role } = req.body;

      if (users.has(username)) {
        logger.warn('Registration failed: Username already exists', { username });
        return res.status(400).json({ 
          success: false, 
          error: 'Username already exists' 
        });
      }

      const newUser = {
        id: Date.now().toString(),
        username,
        password,
        name,
        department,
        role,
        createdAt: new Date().toISOString()
      };

      users.set(username, newUser);

      const token = jwt.sign(
        { userId: newUser.id, username },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      const { password: _, ...userWithoutPassword } = newUser;

      logger.info('User registered successfully', { userId: newUser.id, username });

      res.status(201).json({
        success: true,
        token,
        user: userWithoutPassword
      });
    } catch (error) {
      logger.error('Registration error', { error: error.message, stack: error.stack });
      res.status(500).json({ 
        success: false, 
        error: 'Internal server error' 
      });
    }
  },

  getProfile: async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ 
          success: false, 
          error: 'No token provided' 
        });
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = users.get(decoded.username);

      if (!user) {
        return res.status(404).json({ 
          success: false, 
          error: 'User not found' 
        });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json({
        success: true,
        user: userWithoutPassword
      });
    } catch (error) {
      logger.error('Get profile error', { error: error.message, stack: error.stack });
      res.status(401).json({ 
        success: false, 
        error: 'Invalid token' 
      });
    }
  }
};