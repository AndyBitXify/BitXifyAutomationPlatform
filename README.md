# BitXify Automation Platform

A modern desktop automation platform for managing VM and SSMS Database automation scripts. Built with React, TypeScript, and Electron for a native desktop experience.

![BitXify Screenshot](https://images.unsplash.com/photo-1607706189992-eae578626c86?auto=format&fit=crop&q=80&w=2070)

## Features

- 🚀 Script Management
  - Upload, delete, and run automation scripts
  - Real-time progress tracking
  - Categorized script organization
  - Version control and history

- 👥 User Management
  - Secure authentication
  - Role-based access control
  - Department-based organization
  - Activity logging

- 📊 Dashboard
  - Real-time execution monitoring
  - Success rate analytics
  - Resource utilization tracking
  - Performance metrics

- 💻 Desktop Integration
  - Native system notifications
  - Offline capability
  - Auto-updates
  - Cross-platform support

## Installation

### For Users

Download the latest release for your platform:

- Windows: `BitXify-Setup.exe` (installer) or `BitXify.exe` (portable)
- macOS: `BitXify.dmg`
- Linux: `BitXify.AppImage`, `bitxify.deb`, or `bitxify.rpm`

### For Developers

1. Clone the repository:
```bash
git clone https://github.com/yourusername/bitxify-automation-platform.git
cd bitxify-automation-platform
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run electron:dev
```

## Building from Source

### Prerequisites

- Node.js 18 or later
- npm 9 or later
- Git

### Build Commands

Build for current platform:
```bash
npm run electron:build
```

Build for specific platforms:
```bash
npm run electron:build:win    # Windows
npm run electron:build:mac    # macOS
npm run electron:build:linux  # Linux
```

Build for all platforms:
```bash
npm run electron:build:all
```

Builds will be available in the `dist-electron` directory.

## Development

### Project Structure

```
bitxify/
├── electron/           # Electron main process files
├── src/
│   ├── components/    # React components
│   ├── hooks/        # Custom React hooks
│   ├── services/     # Business logic and API calls
│   ├── types/        # TypeScript type definitions
│   └── utils/        # Utility functions
└── public/           # Static assets
```

### Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Desktop**: Electron
- **State Management**: React Hooks
- **UI Components**: Custom components with Framer Motion
- **Icons**: Lucide React
- **Build Tools**: Vite, Electron Builder

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## Security

- Context isolation enabled
- Proper permission handling
- Secure IPC communication
- Regular security updates

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- Documentation: [docs.bitxify.com](https://docs.bitxify.com)
- Issues: GitHub Issues
- Email: support@bitxify.com

## Acknowledgments

- React Team
- Electron Team
- All contributors

---

Made with ❤️ by the BitXify Team