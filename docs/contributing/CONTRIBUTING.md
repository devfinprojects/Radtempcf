# Contributing to RadTempCF

Thank you for your interest in contributing to RadTempCF!

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/Radtempcf.git`
3. Create a feature branch: `git checkout -b feature/your-feature-name`

## Pull Request Guidelines

### Before Submitting

- [ ] Ensure all tests pass: `npm test`
- [ ] Run linting: `npm run lint`
- [ ] Format code: `npm run format`
- [ ] Validate JSON schemas: `npm run validate`

### PR Description

Include the following in your PR:

1. **Description**: What does this PR do?
2. **Related Issues**: Link to any related issues
3. **Testing**: Describe how you tested the changes
4. **Screenshots**: If applicable, add UI screenshots

### Code Style

- Use TypeScript for all new code
- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful commit messages

## Template Guidelines

When adding new templates:

1. Follow the JSON schema in `docs/schemas/template.schema.json`
2. Include all required fields
3. Add appropriate RADS classifications if applicable
4. Include proper metadata

## Reporting Issues

Use GitHub Issues to report bugs or request features. Include:

- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Environment details
