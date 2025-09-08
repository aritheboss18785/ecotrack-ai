# Contributing to EcoTrack AI

Thank you for your interest in contributing to EcoTrack AI! We welcome contributions that improve accuracy, user experience, and functionality.

## 🎯 Ways to Contribute

### 1. **Emission Factor Updates**
- Submit PRs with newer scientific data
- Add sources from recent FAO, EPA, or DEFRA reports
- Improve accuracy of existing factors

### 2. **AI Parser Improvements**
- Add support for new activity patterns
- Improve natural language understanding
- Enhance confidence scoring algorithms

### 3. **UI/UX Enhancements**
- Better data visualizations
- Improved mobile responsiveness
- Accessibility improvements

### 4. **Testing & Validation**
- Real-world accuracy testing
- User experience feedback
- Performance optimization

## 🛠️ Development Setup

1. **Fork the repository**
2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/ecotrack-ai.git
   cd ecotrack-ai
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start development server**:
   ```bash
   npm run dev
   ```

## 📝 Pull Request Process

1. **Create a feature branch**: `git checkout -b feature/your-feature-name`
2. **Make your changes** with clear commit messages
3. **Test your changes**: `npm run test` and `npm run build`
4. **Update documentation** if needed
5. **Submit a pull request** with:
   - Clear description of changes
   - Testing performed
   - Screenshots for UI changes

## 🧪 Testing

- **Build test**: `npm run build`
- **System validation**: `npm run test`
- **Manual testing**: Test the affected features thoroughly

## 📊 Coding Standards

- **TypeScript**: Use strict typing
- **Components**: Follow React best practices
- **Styling**: Use Tailwind CSS classes
- **Comments**: Document complex logic
- **Imports**: Use organized import structure

## 🌱 Emission Factor Guidelines

When adding or updating emission factors:

1. **Source Verification**: Only use peer-reviewed sources
2. **Documentation**: Include source, date, and methodology
3. **Units**: Ensure consistent units (kg CO₂e)
4. **Testing**: Validate calculations with test cases

## 🚀 Feature Requests

- Open an issue with the `enhancement` label
- Describe the feature clearly
- Explain the use case and benefits
- Provide mockups or examples if helpful

## 🐛 Bug Reports

- Use the issue template
- Include steps to reproduce
- Provide browser/OS information
- Add screenshots if applicable

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Recognition

Contributors will be recognized in our README and release notes. Thank you for helping make carbon tracking more accessible!