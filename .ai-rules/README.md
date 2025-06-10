# 🤖 KiloCode AI Rules & Configuration System

A comprehensive, structured approach to AI-assisted software development with focus on quality, security, accessibility, and performance.

## 📋 Overview

This rules system defines operational guidelines, standards, and best practices for KiloCode AI assistant across all development scenarios. Each configuration file addresses specific aspects of software development while maintaining consistency and high standards.

## 🗂️ Rules Structure

### Core Configuration Files

| File | Purpose | Key Areas |
|------|---------|-----------|
| [`kilocode-core-rules.yaml`](.ai-rules/kilocode-core-rules.yaml) | Primary operational guidelines | Identity, capabilities, standards, methodology |
| [`communication-protocols.yaml`](.ai-rules/communication-protocols.yaml) | Communication standards | Style, response format, technical explanations |
| [`development-workflows.yaml`](.ai-rules/development-workflows.yaml) | Development methodologies | Project setup, feature development, debugging |
| [`tool-usage-patterns.yaml`](.ai-rules/tool-usage-patterns.yaml) | Tool optimization strategies | File operations, system commands, workflows |
| [`security-accessibility.yaml`](.ai-rules/security-accessibility.yaml) | Security and accessibility standards | Input validation, WCAG compliance, inclusive design |
| [`performance-quality.yaml`](.ai-rules/performance-quality.yaml) | Performance and quality standards | Optimization targets, code quality metrics |

## 🎯 Quick Reference Guide

### Core Principles
- **Direct Communication**: Clear, concise, no unnecessary pleasantries
- **Technical Excellence**: High-quality, production-ready code
- **Security First**: Comprehensive security measures in all implementations
- **Accessibility Mandatory**: WCAG 2.1 AA compliance minimum
- **Performance Focused**: Optimized for speed and efficiency
- **Quality Driven**: 85%+ test coverage, comprehensive error handling

### Development Standards
- **Python**: PEP 8, type hints, async/await, comprehensive error handling
- **TypeScript**: Strict mode, functional components, proper error boundaries
- **Testing**: Unit (85%+), integration, accessibility, performance testing
- **Security**: Input validation, authentication, encryption, privacy compliance
- **Accessibility**: Keyboard navigation, screen readers, color contrast, inclusive design

## 🛠️ Tool Usage Guidelines

### File Operations Priority
1. **Reading**: [`read_file`](tool:read_file) for content analysis
2. **Editing**: [`apply_diff`](tool:apply_diff) for targeted changes (preferred)
3. **Creating**: [`write_to_file`](tool:write_to_file) for new files only
4. **Searching**: [`search_files`](tool:search_files) for pattern matching
5. **Structure**: [`list_code_definition_names`](tool:list_code_definition_names) for overview

### Workflow Optimization
- **Batch Operations**: Combine multiple changes in single [`apply_diff`](tool:apply_diff)
- **Sequential Processing**: One tool per message, wait for confirmation
- **Error Handling**: Always verify tool results before proceeding
- **Context Building**: Use environment_details and incremental analysis

## 🔐 Security Standards

### Input Security
- **Validation**: Server-side validation mandatory, client-side for UX
- **Sanitization**: Escape output, parameterized queries, input filtering
- **Injection Prevention**: SQL, XSS, command injection protection

### Authentication & Authorization
- **Passwords**: bcrypt/Argon2 hashing, 12+ character requirements
- **Sessions**: Secure session management, proper token handling
- **Access Control**: RBAC, least privilege, resource-level permissions

### Data Protection
- **Encryption**: AES-256 at rest, TLS 1.3 in transit
- **Privacy**: GDPR compliance, data minimization, user consent

## ♿ Accessibility Standards

### WCAG 2.1 AA Compliance
- **Perceivable**: Alt text, 4.5:1 contrast, semantic HTML
- **Operable**: Keyboard navigation, focus indicators, timing controls
- **Understandable**: Clear language, predictable functionality
- **Robust**: Valid markup, ARIA implementation, screen reader compatibility

### Inclusive Design
- **Neurodivergent Support**: ADHD, autism, dyslexia considerations
- **Motor Accessibility**: Large touch targets, alternative input methods
- **Cognitive Support**: Clear structure, progress indicators, help systems

## ⚡ Performance Standards

### Frontend Targets
- **Core Web Vitals**: LCP <2.5s, FID <100ms, CLS <0.1
- **Bundle Sizes**: Initial <1MB, vendor <500KB, CSS <100KB
- **Optimization**: Code splitting, lazy loading, image optimization

### Backend Targets
- **Response Times**: API <200ms, DB queries <50ms
- **Scalability**: >1000 concurrent users, >500 RPS
- **Resource Usage**: <512MB memory, <70% CPU utilization

## 🏆 Quality Standards

### Code Quality Metrics
- **Complexity**: Cyclomatic <10, cognitive <15, nesting <4 levels
- **Coverage**: >85% line coverage, >80% branch coverage
- **Maintainability**: <5% duplication, >70 maintainability index
- **Security**: 0 critical vulnerabilities, all high-priority patched

### Testing Framework
- **Unit Tests**: 85%+ coverage, fast execution, isolated
- **Integration Tests**: API, database, external services
- **E2E Tests**: Critical user journeys, cross-browser validation
- **Accessibility Tests**: axe-core, pa11y, manual screen reader testing

## 🔄 Development Workflows

### Project Initialization
1. **Analysis**: Requirements, technology selection, architecture planning
2. **Foundation**: Directory structure, version control, package management
3. **Core Setup**: Application structure, routing, state management
4. **Development Environment**: Servers, debugging, testing, linting
5. **Deployment Preparation**: Build processes, environment variables, documentation

### Feature Development
1. **Requirements Analysis**: Break down features, identify dependencies
2. **Design Planning**: Component interfaces, data models, UX considerations
3. **Implementation**: Backend logic, frontend components, error handling
4. **Testing**: Unit, integration, accessibility, performance testing
5. **Integration**: System integration, cross-component testing, documentation

### Debugging Process
1. **Problem Identification**: Reproduce issue, gather error information
2. **Root Cause Analysis**: Code flow analysis, dependency examination
3. **Hypothesis Formation**: Specific hypotheses, testing approach
4. **Testing & Validation**: Systematic testing, tool usage, data verification
5. **Solution Implementation**: Targeted fixes, thorough testing, documentation

## 📊 Success Metrics

### Technical Excellence
- **Uptime**: >99.9%
- **Response Time**: <200ms API, <50ms DB
- **Error Rate**: <0.1%
- **Test Coverage**: >85%
- **Accessibility Score**: >95%

### User Experience
- **Task Completion**: >95%
- **User Satisfaction**: >4.5/5
- **Accessibility Usage**: Tracked and optimized
- **Feature Adoption**: Monitored and improved
- **Support Volume**: Minimized through quality

### Development Efficiency
- **Code Quality**: Improved maintainability scores
- **Development Velocity**: Faster feature delivery
- **Bug Escape Rate**: <5% to production
- **Technical Debt**: Managed and reduced
- **Team Productivity**: Enhanced through automation

## 🚀 Implementation Guidelines

### Getting Started
1. **Review Core Rules**: Start with [`kilocode-core-rules.yaml`](.ai-rules/kilocode-core-rules.yaml)
2. **Understand Communication**: Read [`communication-protocols.yaml`](.ai-rules/communication-protocols.yaml)
3. **Learn Workflows**: Study [`development-workflows.yaml`](.ai-rules/development-workflows.yaml)
4. **Master Tools**: Practice with [`tool-usage-patterns.yaml`](.ai-rules/tool-usage-patterns.yaml)
5. **Apply Standards**: Implement [`security-accessibility.yaml`](.ai-rules/security-accessibility.yaml) and [`performance-quality.yaml`](.ai-rules/performance-quality.yaml)

### Best Practices
- **Start Small**: Begin with simple projects to learn patterns
- **Iterate Quickly**: Make small changes, test frequently
- **Document Everything**: Clear documentation for all implementations
- **Test Thoroughly**: Comprehensive testing at all levels
- **Monitor Continuously**: Track performance, security, and accessibility
- **Improve Constantly**: Regular retrospectives and optimization

## 🔗 Related Resources

### External Standards
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [OWASP Security Guidelines](https://owasp.org/www-project-top-ten/)
- [Web Performance Best Practices](https://web.dev/performance/)
- [React Best Practices](https://react.dev/learn)
- [Python PEP 8 Style Guide](https://pep8.org/)

### Tools and Frameworks
- [axe-core Accessibility Testing](https://github.com/dequelabs/axe-core)
- [Lighthouse Performance Auditing](https://developers.google.com/web/tools/lighthouse)
- [SonarQube Code Quality](https://www.sonarqube.org/)
- [OWASP ZAP Security Testing](https://www.zaproxy.org/)
- [Jest Testing Framework](https://jestjs.io/)

---

**Remember**: These rules are living guidelines that evolve with technology and best practices. The goal is always to create secure, accessible, performant, and maintainable software that serves users effectively.

*Version 2.0 - Comprehensive AI Development Assistant Rules*