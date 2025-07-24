# Contributing to CrawlDock

Thank you for your interest in contributing to CrawlDock! This document provides guidelines for contributing to this project.

## 🎯 **How to Contribute**

### **Types of Contributions We Welcome**

- 🐛 **Bug fixes** - Help us squash bugs
- ✨ **New features** - Add new search engines or capabilities
- 📚 **Documentation** - Improve docs, add examples, fix typos
- 🧪 **Testing** - Add tests, improve test coverage
- 🔧 **Performance** - Optimize search speed, reduce memory usage
- 🎨 **UI/UX** - Improve error messages, logging, user experience
- 🌐 **Internationalization** - Add support for more languages/regions
- 🔒 **Security** - Security improvements and vulnerability fixes

### **Before You Start**

1. **Check existing issues** - Your idea might already be discussed
2. **Read the documentation** - Understand the project structure
3. **Test locally** - Ensure your changes work as expected
4. **Follow the coding standards** - Maintain consistency

## 🛠 **Development Setup**

### **Prerequisites**
- Node.js 18+
- npm or yarn
- Git

### **Local Development**
```bash
# Clone the repository
git clone https://github.com/yourusername/crawldock.git
cd crawldock

# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode
npm run dev

# Test the server
npm start
```

### **Environment Setup**
```bash
# Copy example configuration
cp .env.example .env

# Create .env file (optional, for Google API testing)
cp .env.example .env
# Edit .env with your API keys
```

## 📝 **Coding Standards**

### **TypeScript Guidelines**
- Use TypeScript for all new code
- Follow existing naming conventions
- Add proper type annotations
- Use interfaces for complex objects

### **Code Style**
- Use 2-space indentation
- Follow existing file structure
- Add JSDoc comments for public functions
- Keep functions small and focused

### **Logging Standards**
- Use the existing logger from `src/logger.ts`
- Include correlation IDs in logs
- Use appropriate log levels (error, warn, info, debug)
- Add context to log messages

### **Error Handling**
- Use try-catch blocks appropriately
- Provide meaningful error messages
- Log errors with context
- Handle edge cases gracefully

## 🧪 **Testing**

### **Running Tests**
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- --grep "search engine"
```

### **Writing Tests**
- Test both success and failure scenarios
- Mock external API calls
- Test edge cases and error conditions
- Maintain good test coverage

### **Manual Testing**
```bash
# Test server startup
node dist/index.js

# Test search functionality
node test-search.js

# Test environment loading
node test-env.js
```

## 📦 **Pull Request Process**

### **1. Create a Feature Branch**
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### **2. Make Your Changes**
- Write clear, focused commits
- Follow the coding standards
- Add tests for new functionality
- Update documentation if needed

### **3. Test Your Changes**
```bash
# Build the project
npm run build

# Run tests
npm test

# Test manually
npm start
```

### **4. Commit Your Changes**
```bash
git add .
git commit -m "feat: add new search engine support"
# Use conventional commit messages:
# feat: new feature
# fix: bug fix
# docs: documentation changes
# style: formatting changes
# refactor: code refactoring
# test: adding tests
# chore: maintenance tasks
```

### **5. Push and Create PR**
```bash
git push origin feature/your-feature-name
```

### **6. Pull Request Guidelines**
- **Title**: Clear, descriptive title
- **Description**: Explain what and why, not how
- **Linked issues**: Reference related issues
- **Screenshots**: If UI changes are involved
- **Testing**: Describe how you tested

## 🏷 **Issue Guidelines**

### **Bug Reports**
- Use the bug report template
- Include steps to reproduce
- Add error logs and screenshots
- Specify your environment (OS, Node.js version, etc.)

### **Feature Requests**
- Use the feature request template
- Explain the problem you're solving
- Describe the proposed solution
- Consider implementation complexity

## 🎯 **Areas for Contribution**

### **High Priority**
- 🔍 **New Search Engines** - Bing, Yandex, Baidu
- 🌐 **Internationalization** - Multi-language support
- 📊 **Analytics** - Usage statistics and insights
- 🔒 **Security** - API key encryption, rate limiting improvements

### **Medium Priority**
- 🎨 **UI Improvements** - Better error messages, progress indicators
- 📈 **Performance** - Caching, connection pooling
- 🧪 **Testing** - More comprehensive test coverage
- 📚 **Documentation** - More examples, tutorials

### **Low Priority**
- 🔧 **Configuration** - More customization options
- 📱 **Mobile** - Mobile-optimized responses
- 🌍 **Geolocation** - Location-based search results

## 🤝 **Community Guidelines**

### **Be Respectful**
- Be kind and respectful to all contributors
- Welcome newcomers and help them get started
- Give constructive feedback
- Celebrate contributions, no matter how small

### **Be Helpful**
- Answer questions in issues and discussions
- Review pull requests thoughtfully
- Share knowledge and best practices
- Mentor new contributors

### **Be Patient**
- Maintainers are volunteers
- Response times may vary
- Complex changes take time to review
- Not all suggestions can be implemented

## 📞 **Getting Help**

### **Before Asking**
- Check existing issues and discussions
- Read the documentation thoroughly
- Try to reproduce the issue locally
- Search for similar problems

### **Where to Ask**
- **Issues**: For bugs and feature requests
- **Discussions**: For questions and general help
- **Pull Requests**: For code reviews and feedback

## 🏆 **Recognition**

### **Contributor Recognition**
- All contributors will be listed in the README
- Significant contributions will be highlighted
- Contributors will be added to the repository
- Special recognition for major features

### **Types of Contributions**
- **Code Contributors**: Direct code changes
- **Documentation Contributors**: Docs and examples
- **Bug Reporters**: Finding and reporting issues
- **Feature Requesters**: Suggesting improvements
- **Reviewers**: Code review and feedback

## 📄 **License**

By contributing to CrawlDock, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to CrawlDock! 🚀 