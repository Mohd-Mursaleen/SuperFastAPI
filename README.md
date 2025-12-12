# SuperFastAPI

[![npm version](https://badge.fury.io/js/superfastapi.svg)](https://www.npmjs.com/package/supfastapi)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A powerful command-line tool for generating production-ready FastAPI projects with modern Python best practices. SuperFastAPI helps developers quickly scaffold FastAPI applications with optional database integration, authentication, Docker support, and more.

## ✨ Features

- **🚀 Quick Setup**: Generate a complete FastAPI project in seconds
- **🗄️ Database Options**: Choose between PostgreSQL (with Docker), Supabase, or no database
- **🔐 Authentication**: Optional Supabase authentication integration
- **🐳 Docker Ready**: Optional Docker and docker-compose configuration
- **📦 Poetry Integration**: Modern Python dependency management with Poetry
- **🔧 CRUD Operations**: Pre-built CRUD directory structure for PostgreSQL projects
- **🧪 Migration Support**: Alembic integration for database migrations
- **⚡ Database Scripts**: Automated `db.sh` script for database management
- **📝 Well Documented**: Generated projects include comprehensive documentation
- **🎯 Best Practices**: Follows FastAPI and Python best practices

## 📋 Requirements

- **Node.js** 14+ (for running the CLI)
- **Python** 3.11+ (for generated projects)
- **Poetry** (for Python dependency management)
- **Docker** (optional, for PostgreSQL database)

## 🚀 Quick Start

### Installation

Install SuperFastAPI globally via npm:

```bash
npm install -g supfastapi
```

Or use it directly with npx (no installation required):

```bash
npx supfastapi my-api-project
```

### Basic Usage

Create a new FastAPI project:

```bash
superfastapi my-awesome-api
```

The CLI will guide you through the setup process with interactive prompts:

1. **Database Setup**: Choose your database option
   - No database setup
   - Supabase (cloud database)
   - PostgreSQL (requires Docker)

2. **Authentication**: Enable Supabase authentication (if using Supabase)

3. **Docker Setup**: Include Docker configuration files

## 🗄️ Database Options

### PostgreSQL with Docker

When you select PostgreSQL, SuperFastAPI automatically includes:

- **Docker Configuration**: `Dockerfile`, `docker-compose.yml`, `.dockerignore`
- **Database Client**: SQLAlchemy setup with PostgreSQL
- **Migrations**: Alembic configuration for database migrations
- **CRUD Operations**: Pre-built CRUD directory structure
- **Database Management**: `db.sh` script for common database operations

### Supabase Integration

Supabase option provides:

- **Database Client**: Supabase Python client setup
- **Authentication**: Optional JWT-based authentication system
- **Environment Configuration**: Pre-configured environment variables
- **API Routes**: Ready-to-use authentication endpoints

## 📁 Generated Project Structure

```
my-awesome-api/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI application entry point
│   ├── core/
│   │   ├── __init__.py
│   │   └── config.py           # Application configuration
│   ├── api/
│   │   ├── __init__.py
│   │   ├── routes/             # API route handlers
│   │   ├── schemas/            # Pydantic models
│   │   └── middleware/         # Custom middleware
│   ├── db/
│   │   ├── __init__.py
│   │   └── postgres.py         # Database connection (if PostgreSQL)
│   ├── crud/                   # CRUD operations (PostgreSQL only)
│   │   └── __init__.py
│   ├── models/                 # Database models
│   ├── services/               # Business logic
│   └── utils/                  # Utility functions
├── tests/
│   └── __init__.py
├── alembic/                    # Database migrations (PostgreSQL only)
├── docker-compose.yml          # Docker services (if Docker enabled)
├── Dockerfile                  # Application container (if Docker enabled)
├── db.sh                       # Database management script (PostgreSQL only)
├── pyproject.toml              # Poetry configuration
├── example.env                 # Environment variables template
├── start.sh                    # Application startup script
└── README.md                   # Project documentation
```

## 🐳 Docker Usage (PostgreSQL Projects)

For projects with PostgreSQL, use these commands:

```bash
# Start PostgreSQL database only
docker-compose up -d postgres

# Install Python dependencies
poetry install

# Run database migrations
./db.sh migrate

# Start the FastAPI application
poetry run uvicorn app.main:app --reload
```

## 🔧 Database Management (PostgreSQL)

The generated `db.sh` script provides convenient database operations:

```bash
# Check database status
./db.sh status

# Create a new migration
./db.sh create "add_users_table"

# Apply migrations
./db.sh migrate

# Show current migration
./db.sh current

# Show migration history
./db.sh history

# Open PostgreSQL shell
./db.sh shell

# Show all available commands
./db.sh help
```

## 🔐 Environment Configuration

Generated projects include an `example.env` file. Copy it to `.env` and configure:

```bash
cp example.env .env
```

### PostgreSQL Configuration
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/my_awesome_api
```

### Supabase Configuration
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key  # For auth features
```

## 📖 Examples

### Create a basic API project
```bash
superfastapi basic-api
# Select: No database setup
# Select: No Docker setup
```

### Create a project with PostgreSQL and Docker
```bash
superfastapi postgres-api
# Select: PostgreSQL (requires Docker)
# Docker setup is automatically included
```

### Create a project with Supabase authentication
```bash
superfastapi supabase-api
# Select: Supabase (cloud database)
# Select: Yes for authentication
# Select: Yes/No for Docker setup
```

## 🧪 Development

### Running Tests

```bash
npm test
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for detailed information on how to contribute to this project.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- 📧 Email: mohdmursaleen1207@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/Mohd-Mursaleen/SuperFastAPI/issues)

---

**Made with ❤️ for the FastAPI community**
