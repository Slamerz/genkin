export default {
  baseDir: './dist',
  files: [
    {
      path: 'index.js',
      maxSize: '1kb',
      compression: 'gzip'
    },
    {
      path: 'index.cjs',
      maxSize: '1kb',
      compression: 'gzip'
    },
    {
      path: 'core.js',
      maxSize: '1kb',
      compression: 'gzip'
    },
    {
      path: 'core.cjs',
      maxSize: '1kb',
      compression: 'gzip'
    },
    {
      path: 'operations.js',
      maxSize: '1kb',
      compression: 'gzip'
    },
    {
      path: 'operations.cjs',
      maxSize: '1kb',
      compression: 'gzip'
    },
    {
      path: 'currencies.js',
      maxSize: '1kb',
      compression: 'gzip'
    },
    {
      path: 'currencies.cjs',
      maxSize: '1kb',
      compression: 'gzip'
    },
    {
      path: 'formatters.js',
      maxSize: '1kb',
      compression: 'gzip'
    },
    {
      path: 'formatters.cjs',
      maxSize: '1kb',
      compression: 'gzip'
    },
    {
      path: 'utils.js',
      maxSize: '1kb',
      compression: 'gzip'
    },
    {
      path: 'utils.cjs',
      maxSize: '1kb',
      compression: 'gzip'
    }
  ],
  groups: [
    {
      name: 'Entry Point Bundles',
      path: '{index,core,operations,currencies,formatters,utils}.{js,cjs}',
      maxSize: '8kb'
    },
    {
      name: 'All Bundles',
      path: '**/*.{js,cjs}',
      maxSize: '25kb'
    }
  ],
  reportOutput: ['console', 'json'],
  verbose: false
}; 