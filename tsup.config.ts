import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    core: 'src/core/index.ts',
    operations: 'src/operations/index.ts',
    formatters: 'src/formatters/index.ts',
    currencies: 'src/currencies/index.ts',
    utils: 'src/utils/index.ts',
    'dinero-v1': 'src/dinero-v1/index.ts',
    'dinero-v2': 'src/dinero-v2/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  splitting: true,
  sourcemap: true,
  treeshake: true,
});
