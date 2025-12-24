# Contributing to @sveltopia/regions

Thank you for your interest in contributing to @sveltopia/regions! We welcome contributions from the community.

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+

### Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/regions.git
   cd regions
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Create a new branch:
   ```bash
   git checkout -b feat/your-feature-name
   ```

## Development Workflow

### Running Tests

```bash
pnpm test          # Run unit tests with coverage
pnpm test:watch    # Run tests in watch mode
```

### Type Checking

```bash
pnpm check         # Run TypeScript type checking
```

### Building

```bash
pnpm build         # Build the package
```

### Code Quality

Before submitting a PR, ensure:
- All tests pass: `pnpm test`
- Types are valid: `pnpm check`
- Code follows existing style conventions
- New features include tests
- Documentation is updated if needed

## Submitting Changes

1. Commit your changes with a clear commit message
2. Push to your fork
3. Open a Pull Request against the `main` branch
4. Provide a clear description of the changes
5. Reference any related issues

### Commit Message Format

We follow conventional commits:

```
feat: add new feature
fix: resolve bug
docs: update documentation
test: add tests
refactor: refactor code
chore: maintenance tasks
```

## Code Style

- Use TypeScript for all code
- Follow existing code patterns
- Use meaningful variable names
- Add JSDoc comments for public APIs
- Keep functions small and focused

## Testing Guidelines

- Write unit tests for new features
- Maintain test coverage above 90%
- Test both success and error cases
- Use descriptive test names

## Questions?

Feel free to open an issue for:
- Bug reports
- Feature requests
- Questions about contributing
- General discussions

## License

By contributing to @sveltopia/regions, you agree that your contributions will be licensed under the MIT License.
