# Release Schedule

## Quarterly Release Cycle

This document outlines the quarterly release schedule for RadReport Templates.

---

## Release Cadence

| Quarter | Release Date | Focus Areas |
|---------|-------------|-------------|
| Q2 2026 | 2026-06-30 | Template expansion, AI enhancements |
| Q3 2026 | 2026-09-30 | New RADS systems, FHIR R5 support |
| Q4 2026 | 2026-12-31 | Performance optimization, accessibility |
| Q1 2027 | 2027-03-31 | Community features, analytics |

---

## Release Process

### Pre-Release (Week -2)
1. **Feature Freeze** - No new features merged
2. **Code Freeze** - Only bug fixes and documentation updates
3. **Testing** - Full regression testing
4. **Security Audit** - npm audit, dependency updates

### Release Week (Week 0)
1. **Version Bump** - Update version in package.json
2. **Changelog Update** - Document all changes since last release
3. **Build Verification** - Ensure build passes
4. **Release Candidate** - Create RC for final testing
5. **Final Release** - Publish to npm and GitHub

### Post-Release (Week +1)
1. **Announcement** - Release notes blog post
2. **Social Media** - Twitter, LinkedIn announcements
3. **Community Update** - GitHub Discussions announcement

---

## Version Numbering

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (X.0.0) - Breaking changes
- **MINOR** (1.X.0) - New features, backwards compatible
- **PATCH** (1.0.X) - Bug fixes, backwards compatible

### Version Bump Guidelines

| Change Type | Version Bump |
|-------------|--------------|
| New template category | MINOR |
| New export format | MINOR |
| Schema changes | MAJOR |
| API endpoint changes | MAJOR |
| Bug fixes | PATCH |
| Documentation updates | PATCH |
| Performance improvements | PATCH |

---

## Hotfix Release

For critical bug fixes, hotfix releases can be issued outside the quarterly cycle.

### Hotfix Criteria
- Security vulnerability
- Data loss prevention
- Complete functionality break

### Hotfix Process
1. Create hotfix branch from last tag
2. Apply fix and test
3. Bump patch version
4. Release immediately
5. Merge back to main

---

## Communication

### Release Channels
- GitHub Releases
- npm package updates
- Twitter/X announcements
- LinkedIn posts
- GitHub Discussions

### Support Windows
- **Current Release:** Always supported
- **Previous Release:** 6 months of security updates
- **LTS (Long Term Support):** Major versions supported for 18 months

---

## Contact

For questions about the release schedule, open a [GitHub Discussion](https://github.com/radreport/templates/discussions).
