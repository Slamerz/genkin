# Bundle Size Monitoring

This project uses automated bundle size monitoring to ensure the library stays lightweight and performant.

## Quick Start

```bash
# Install dependencies
bun install

# Run bundle size analysis
bun run bundle:size

# Run bundlemon analysis with limits
bun run bundle:analyze
```

## Available Commands

### `bun run bundle:size`
Analyzes current bundle sizes and displays a detailed report with:
- Raw and gzipped sizes for all bundles
- Compression ratios
- Warnings for large bundles (>20KB gzipped)
- Summary statistics

### `bun run bundle:analyze`
Runs BundleMon to check against configured size limits and track changes over time.

## Bundle Size Limits

Current size limits (gzipped) are configured in `bundlemon.config.js`:

- **Main bundle** (`index.js/cjs`): 25KB
- **Core** (`core.js/cjs`): 15KB
- **Operations** (`operations.js/cjs`): 10KB
- **Currencies** (`currencies.js/cjs`): 8KB
- **Formatters** (`formatters.js/cjs`): 5KB
- **Utils** (`utils.js/cjs`): 3KB

## Automated Monitoring

### GitHub Actions
Bundle sizes are automatically monitored on:
- Pull requests (with size comparison comments)
- Pushes to main branch

### CI Integration
The bundle size check will fail if:
- Any bundle exceeds its size limit
- Total bundle size increases significantly

## Interpreting Results

### Size Analysis Output
```
📦 Bundle Size Analysis

🌟 ESM Bundles
File                 Raw Size       Gzipped        Compression
─────────────────────────────────────────────────────────────────
index.js            45.2 KB        12.3 KB        72.8%
core.js             28.1 KB        8.9 KB         68.3%
```

### What to Monitor
- **Gzipped sizes** are most important (what users download)
- **Compression ratios** should typically be 60-80%
- **Large bundle warnings** indicate potential optimization opportunities

## Optimization Tips

### Keep Bundles Small
- Use tree-shaking friendly exports
- Avoid large dependencies in core modules
- Consider code splitting for optional features

### Monitor Dependencies
```bash
# Analyze what's contributing to bundle size
bun run build && bun bundlemon --analyze
```

### Regular Audits
- Review bundle sizes monthly
- Investigate size increases > 10%
- Consider breaking changes for major size reductions

## Configuration

### Adjusting Size Limits
Edit `bundlemon.config.js` to modify size limits:

```javascript
{
  path: 'index.js',
  maxSize: '30kb',  // Increase limit
  compression: 'gzip'
}
```

### Adding New Bundles
When adding new entry points, update:
1. `bundlemon.config.js` - Add size limits
2. Bundle analysis scripts - Include in monitoring

## Troubleshooting

### Bundle Too Large
1. Check what's included: `bun run bundle:analyze --verbose`
2. Review imports and dependencies
3. Consider splitting large modules
4. Use dynamic imports for optional features

### CI Failures
1. Run locally: `bun run bundle:analyze`
2. Check size increase reason
3. Update limits if increase is justified
4. Optimize code if increase is unwanted 