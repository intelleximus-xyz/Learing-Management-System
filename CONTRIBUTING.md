# Contributing to Learning Management System

Thank you for your interest in contributing to the LMS project! This document provides guidelines for contributing.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Maintain professional communication

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in Issues
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if applicable)
   - Environment details (OS, Node version, etc.)

### Suggesting Enhancements

1. Check if the enhancement has been suggested
2. Create an issue with:
   - Clear description of the feature
   - Use cases and benefits
   - Possible implementation approach

### Pull Requests

1. Fork the repository
2. Create a feature branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Make your changes following our coding standards

4. Test your changes thoroughly

5. Commit with clear messages:
   ```bash
   git commit -m "feat: add user profile page"
   ```

6. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

7. Create a Pull Request to `main` branch

## Development Setup

See [DEVELOPMENT.md](DEVELOPMENT.md) for detailed setup instructions.

## Coding Standards

### TypeScript
- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid using `any` type
- Use ESLint for code quality

### Naming Conventions
- **Variables/Functions**: camelCase (`getUserData`)
- **Classes/Components**: PascalCase (`UserProfile`)
- **Constants**: UPPER_SNAKE_CASE (`API_URL`)
- **Files**: camelCase for logic (`authController.ts`), PascalCase for components (`LoginForm.tsx`)

### Code Style
- Use 2 spaces for indentation
- Use single quotes for strings (except JSON)
- Add semicolons at the end of statements
- Use meaningful variable names
- Keep functions small and focused
- Add comments for complex logic

### Git Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) standard:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, no logic change)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Examples:
```
feat: add course enrollment feature
fix: resolve authentication token expiry issue
docs: update API documentation for assignments
refactor: simplify user authentication logic
test: add unit tests for course controller
```

### Pull Request Guidelines

1. **Title**: Use conventional commit format
2. **Description**: 
   - What changes were made
   - Why the changes were necessary
   - How to test the changes
3. **Tests**: Include tests for new features
4. **Documentation**: Update docs if needed
5. **Screenshots**: Include for UI changes

### Code Review Process

1. PRs require at least one approval
2. All CI checks must pass
3. Address reviewer feedback promptly
4. Keep PRs focused and small
5. Rebase on main if needed

## Project Structure

### Backend
```
backend/src/
├── config/       # Configuration files
├── controllers/  # Request handlers
├── middleware/   # Express middleware
├── routes/       # API routes
└── utils/        # Utility functions (future)
```

### Frontend
```
frontend/src/
├── app/          # Next.js pages
├── components/   # React components (future)
├── lib/          # Utilities and services
└── types/        # TypeScript types
```

## Testing Guidelines

### Backend Tests (Future)
- Unit tests for controllers
- Integration tests for API endpoints
- Use Jest and Supertest
- Aim for >80% coverage

### Frontend Tests (Future)
- Component tests with React Testing Library
- E2E tests with Cypress
- Snapshot tests for UI components

## Documentation

- Update README.md for user-facing changes
- Update docs/ for technical changes
- Add JSDoc comments for complex functions
- Update API.md for API changes

## Questions?

- Open an issue for general questions
- Tag maintainers for urgent matters
- Join discussions in GitHub Discussions (if enabled)

Thank you for contributing! 🎉
