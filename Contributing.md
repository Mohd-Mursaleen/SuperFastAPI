
# Contributing to SuperFastAPI

Thank you for your interest in contributing to SuperFastAPI! We welcome contributions from the community and are grateful for any help you can provide.

## 🤝 How to Contribute

### Code Contributions

#### Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/SuperFastAPI.git
   cd SuperFastAPI
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

#### Development Workflow

1. **Make your changes** following our coding standards
2. **Add tests** for new functionality
3. **Run the test suite**:
   ```bash
   npm test
   ```
4. **Test the CLI manually**:
   ```bash
   node bin/superfastapi.js test-project
   ```

#### Code Standards

- **JavaScript Style**: Follow existing code style and use ESLint
- **Commit Messages**: Use clear, descriptive commit messages
- **Documentation**: Update README.md if adding new features
- **Templates**: Test template changes with different configurations

#### Testing

- **Unit Tests**: Add tests for new functions and classes
- **Integration Tests**: Test CLI workflows end-to-end
- **Template Tests**: Verify generated projects work correctly

Run tests before submitting:
```bash
# Run all tests
npm test

# Run specific test file
npm test -- tests/cli-prompts.test.js

# Run tests in watch mode
npm test -- --watch
```

#### Submitting Changes

1. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Add: new feature description"
   ```

2. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create a Pull Request** with:
   - Clear title and description
   - Reference any related issues
   - Screenshots/examples if applicable
   - Test results

## 🏗️ Project Structure

```
SuperFastAPI/
├── bin/
│   └── superfastapi.js         # CLI entry point
├── src/
│   ├── cli.js                  # CLI interface and prompts
│   └── generator.js            # Project generation logic
├── templates/                  # Handlebars templates
│   ├── app/                    # FastAPI app templates
│   ├── *.hbs                   # Root level file templates
│   └── ...
├── tests/                      # Test suites
│   ├── cli-prompts.test.js     # CLI interaction tests
│   ├── template-generation.test.js  # Template tests
│   └── ...
└── package.json
```

## 🎯 Areas for Contribution

We especially welcome contributions in these areas:

- **New Templates**: Additional FastAPI project templates
- **Database Support**: New database integrations
- **Authentication**: Additional auth providers
- **Documentation**: Improvements to docs and examples
- **Testing**: More comprehensive test coverage
- **Performance**: CLI speed and efficiency improvements

## 🐛 Bug Reports

When reporting bugs, please include:

- **SuperFastAPI version**: `npm list supfastapi`
- **Node.js version**: `node --version`
- **Operating System**: Windows/macOS/Linux
- **Steps to reproduce** the issue
- **Expected vs actual behavior**
- **Error messages** (if any)

## 💡 Feature Requests

For feature requests, please provide:

- **Clear description** of the feature
- **Use case** and motivation
- **Proposed implementation** (if you have ideas)
- **Examples** of similar features in other tools

## 📋 Pull Request Checklist

Before submitting a PR, ensure:

- [ ] Code follows existing style and conventions
- [ ] Tests pass (`npm test`)
- [ ] New features include tests
- [ ] Documentation is updated
- [ ] Commit messages are clear
- [ ] PR description explains the changes

## 🔄 Release Process

1. **Version Bump**: Update version in `package.json`
2. **Changelog**: Update with new features/fixes
3. **Testing**: Comprehensive testing across platforms
4. **Tagging**: Create git tag for release
5. **Publishing**: Publish to npm registry

## 📞 Getting Help

Need help contributing? Reach out:

- 📧 **Email**: mohdmursaleen1207@gmail.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/Mohd-Mursaleen/SuperFastAPI/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/Mohd-Mursaleen/SuperFastAPI/discussions)

## 📝 License

By contributing to SuperFastAPI, you agree that your contributions will be licensed under the MIT License.

## 🙏 Acknowledgments

Thank you to all contributors who help make SuperFastAPI better!

- [FastAPI](https://fastapi.tiangolo.com/) - The amazing Python web framework
- [Poetry](https://python-poetry.org/) - Modern Python dependency management
- [Supabase](https://supabase.com/) - Open source Firebase alternative
- [Alembic](https://alembic.sqlalchemy.org/) - Database migration tool

---

**Happy Contributing! 🚀**
