# Tool Usage & Performance Optimization

## Tool Selection Strategy

### File Operations Priority
1. **Reading Files**: Use `read_file` for content analysis
2. **Editing Files**: Prefer `apply_diff` for targeted changes (batch multiple changes)
3. **Creating Files**: Use `write_to_file` for new files only
4. **Searching**: Use `search_files` for pattern matching
5. **Structure Analysis**: Use `list_code_definition_names` for code overview

### Efficient Tool Usage
- **Batch Operations**: Combine multiple changes in single `apply_diff` call
- **Sequential Processing**: One tool per message, wait for confirmation
- **Error Handling**: Always verify tool results before proceeding
- **Context Building**: Use environment_details and incremental analysis

### File Editing Best Practices
- **apply_diff**: Use multiple SEARCH/REPLACE blocks in single call for related changes
- **write_to_file**: Only for new files or complete rewrites, include ALL content
- **insert_content**: For adding new lines without modifying existing content
- **search_and_replace**: For simple text substitutions across files

## Performance Standards

### Frontend Performance Targets
- **Core Web Vitals**: LCP <2.5s, FID <100ms, CLS <0.1
- **Bundle Sizes**: Initial <1MB, vendor <500KB, CSS <100KB
- **Optimization**: Code splitting, lazy loading, image optimization

### Backend Performance Targets
- **Response Times**: API <200ms, DB queries <50ms
- **Scalability**: >1000 concurrent users, >500 RPS
- **Resource Usage**: <512MB memory, <70% CPU utilization

### Optimization Strategies
- **Frontend**: Code splitting, lazy loading, memoization, service workers
- **Backend**: Query optimization, caching (Redis), async operations, connection pooling
- **Network**: Compression, CDN usage, API response optimization

## Code Quality Standards

### Quality Metrics
- **Test Coverage**: >85% line coverage, >80% branch coverage
- **Code Complexity**: Cyclomatic <10, cognitive <15, nesting <4 levels
- **Maintainability**: <5% duplication, >70 maintainability index
- **Security**: 0 critical vulnerabilities, all high-priority patched

### Implementation Requirements
- **Functions**: Keep small and focused (single responsibility)
- **Variables**: Use descriptive, meaningful names
- **Comments**: Explain complex logic and business rules
- **Error Handling**: Comprehensive with specific exceptions
- **Testing**: Write tests before or immediately after implementation

## Workflow Optimization

### Development Cycle
1. **Analysis Phase**: Review environment_details, understand project structure
2. **Planning Phase**: Identify changes needed, plan tool sequence
3. **Implementation Phase**: Execute changes systematically, one tool at a time
4. **Validation Phase**: Test implementations, verify functionality
5. **Documentation Phase**: Update relevant documentation

### Error Recovery
- **Tool Failures**: Analyze error messages, retry with corrected parameters
- **Code Issues**: Use systematic debugging approach, isolate problems
- **Performance Problems**: Profile and optimize bottlenecks
- **Integration Issues**: Test cross-component interactions thoroughly

## Testing Standards

### Testing Pyramid
- **Unit Tests**: 85%+ coverage, fast execution, isolated tests
- **Integration Tests**: API endpoints, database operations, external services
- **E2E Tests**: Critical user journeys, cross-browser validation
- **Accessibility Tests**: axe-core, pa11y, manual screen reader testing

### Test Quality
- **Effectiveness**: >90% bug detection rate, <5% false positives
- **Automation**: >95% regression test automation, CI/CD integration
- **Maintenance**: Minimize flaky tests (<2%), optimize execution time

## Browser Testing Guidelines

### When to Use Browser Actions
- After UI changes for verification
- For testing user interactions
- To validate accessibility features
- For cross-browser compatibility testing

### Browser Testing Sequence
1. **Launch**: Start browser at specific URL
2. **Interact**: Click, type, hover as needed
3. **Verify**: Capture screenshots, check functionality
4. **Close**: Always close browser when complete

### Best Practices
- Target element centers for clicks (900x600 resolution)
- Wait for user confirmation between actions
- Use screenshots to verify state changes
- Test keyboard navigation and accessibility

## Continuous Improvement

### Monitoring and Metrics
- **Performance**: Track Core Web Vitals, API response times
- **Quality**: Monitor test coverage, code complexity, security vulnerabilities
- **User Experience**: Accessibility compliance, error rates, user satisfaction

### Optimization Approach
- **Measure First**: Establish baseline metrics before optimization
- **Prioritize Impact**: Focus on high-impact, user-facing improvements
- **Validate Changes**: Verify improvements and check for regressions
- **Document Learnings**: Share optimization techniques and results