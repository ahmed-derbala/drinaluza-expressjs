# Drinaluza Backend

![Node.js](https://img.shields.io/badge/Node.js-24-green)
![Express](https://img.shields.io/badge/Express-5.2.1-blue)
![License](https://img.shields.io/badge/License-Private-red)

Backend server for **Drinaluza** - a comprehensive small businesses management application.

## 📱 Applications

- **Android App**: [Download from Google Drive](https://drive.google.com/drive/folders/1euN1ogdssvbiq4wJdxYQBYqMXWbwIpBm?usp=drive_link)
- **Web App**: [Netlify](https://drinaluza.netlify.app/) | [Vercel](https://drinaluza.vercel.app/)

*(CTRL+click to open in new tab)*

## ✨ Features

- **Modern Stack**: Built with Node.js 24 and Express 5
- **Clean Architecture**: Well-organized, modular codebase
- **Configuration**: Everything is configurable in `src/config`
- **Process Management**: PM2 support with clustering
- **Real-time Communication**: Socket.io integration
- **Advanced Logging**: Custom JSON logs with Morgan and Winston (file, console, MongoDB) with memory management
- **Database**: Mongoose ODM for MongoDB
- **Security**: API rate limiting, Helmet, CORS
- **Performance**: Compression middleware, clustering support
- **Code Quality**: Prettier formatting with pre-commit hooks
- **API Documentation**: Swagger UI and Postman collection
- **Media Storage**: Cloudinary integration
- **Authentication**: JWT-based authentication system

## 📋 Prerequisites

- Node.js 24 or higher
- npm or yarn
- MongoDB instance
- Cloudinary account (for media storage)

## 🚀 Quick Start

### First Time Setup

Install dependencies and run the server in local mode:

```bash
npm run frl
```

This command will:
1. Copy the default configuration to local config
2. Install all dependencies
3. Start the server in local mode with hot-reload

### Manual Installation

```bash
# Install dependencies
npm install

# Copy configuration file
cp src/config/default.config.js src/config/local.config.js

# Start in local mode
npm run start:local
```

## 🔧 Configuration

The server configuration is located in `src/config/`. You can modify:

- Port number
- Database connection strings
- JWT secrets
- Cloudinary credentials
- Logging settings
- Cluster settings

### Environment Variables

Create a `.env` file based on `sample.env`:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 📁 Project Structure

```
drinaluza-expressjs/
├── src/
│   ├── config/          # Configuration files
│   ├── core/            # Core functionality (auth, db, helpers, etc.)
│   ├── features/        # Feature modules (users, businesses, orders, etc.)
│   └── main.js          # Application entry point
├── docs/                # Documentation and Postman collection
├── public/              # Static files
├── backups/             # Package backups
└── package.json         # Dependencies and scripts
```

## 🔌 API Documentation

### Swagger UI

Access the interactive API documentation at:

```
http://127.0.0.1:5001/swagger
```

### Postman Collection

Import the Postman collection from:

```
docs/drinaluza.postman_collection.json
```

## 🛠️ Available Scripts

### Development

```bash
npm run start:local      # Start in local mode with hot-reload
npm run dev              # Alias for start:local
npm run debug            # Start with debug mode
```

### Production

```bash
npm run start:prod               # Start in production mode
npm run start:prod-pm2           # Start with PM2 clustering
npm run start:prod-pm2-monit     # Start with PM2 and monitor
npm run reload                   # Reload PM2 processes
npm run stop                     # Stop all PM2 processes
npm run delete                   # Delete all PM2 processes
npm run monit                    # Open PM2 monitor
```

### Package Management

```bash
npm run update        # Update all packages to latest version
npm run restore       # Restore packages from /backups
npm run clean         # Delete and reinstall packages
npm run clean:only    # Only clean node_modules
npm run clean:prod    # Clean for production
npm run backup        # Backup current packages to /backups
```

### Code Quality

```bash
npm run format        # Format code with Prettier
npm run push          # Version bump, format, commit, and push
```

### Configuration

```bash
npm run config:new-prod    # Create new production config
npm run config:prod        # Create production config if not exists
```

### Build

```bash
npm run build:prod    # Build for production
npm run build:run     # Build and run production
```

## 🏗️ Architecture

The application follows a clean architecture pattern with:

- **Core Layer**: Shared utilities, database connections, authentication, logging
- **Feature Layer**: Modular features (users, businesses, products, orders, reviews, dashboard, feed)
- **Config Layer**: Environment-specific configurations

### Features Modules

- **Users**: User management and authentication
- **Businesses**: Business profile management
- **Products**: Product catalog management
- **Orders**: Order processing and management
- **Reviews**: Customer reviews system
- **Dashboard**: Analytics and reporting
- **Feed**: Activity feed and notifications

## 🚦 Deployment

### Production Build

```bash
npm run build:prod
```

### Production Run with PM2

```bash
npm run frp
```

This will:
1. Create production config
2. Clean install production dependencies
3. Start with PM2 clustering and monitoring

## 🐛 Troubleshooting

### Port Already in Use

Change the port in `src/config/local.config.js` or `src/config/production.config.js`.

### Database Connection Issues

Verify your MongoDB connection string in the configuration file.

### Cloudinary Upload Issues

Ensure your Cloudinary credentials are correctly set in the `.env` file.

## 📝 License

This project is private and proprietary.

## 👤 Author

**Ahmed Derbala** - [derbala.ahmed531992@gmail.com](mailto:derbala.ahmed531992@gmail.com)

## 🌐 Repository

[GitHub Repository](https://github.com/ahmed-derbala/drinaluza-expressjs)