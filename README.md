# SuperFastAPI

SuperFastAPI is a project scaffolding tool designed to quickly generate a FastAPI-based backend project with batteries-included features and a modular structure. It leverages templates and a CLI to help you bootstrap production-ready Python web APIs in seconds.

Check it out here: [supfastapi on npm](https://www.npmjs.com/package/supfastapi)

## Features
- **CLI Tool**: Easily generate new FastAPI projects from the command line.
- **Template System**: Uses Handlebars templates for flexible project generation.
- **Modular Structure**: Includes pre-built modules for authentication, database integration (Supabase), configuration, and more.
- **Best Practices**: Follows modern Python and FastAPI best practices for project layout and code organization.
- **Extensible**: Add or customize templates to fit your needs.

## Project Structure
```
SuperFastAPI/
├── bin/
│   └── superfastapi.js         # CLI entry point
├── src/
│   ├── cli.js                  # CLI logic
│   ├── generator.js            # Project generator logic
│   └── ...
├── templates/                  # Handlebars templates for project files
│   ├── example.env.hbs
│   ├── pyproject.toml.hbs
│   ├── README.md.hbs
│   ├── start.sh.hbs
│   └── app/                    # FastAPI app templates
│       └── ...
├── tests/                      # Unit and integration tests
├── package.json                # Node.js project metadata
└── ...
```

## Getting Started

### Prerequisites
- Node.js (for running the CLI)
- Python 3.8+ (for generated FastAPI projects)

### Installation
Clone this repository and install dependencies:
```bash
git clone https://github.com/Mohd-Mursaleen/SuperFastAPI.git
cd SuperFastAPI
npm install
```

### Usage
To generate a new FastAPI project, run:
```bash
npx supfastapi <project-name>
```
Or, if installed globally:
```bash
supfastapi <project-name>
```
Follow the CLI prompts to customize your project.

## Templates
All project files are generated from Handlebars templates in the `templates/` directory. You can modify or add templates to customize the generated projects.

## Testing
Run tests with:
```bash
npm test
```

## Contributing
Contributions are welcome! Please open issues or pull requests for bug fixes, features, or improvements.

## License
MIT License
