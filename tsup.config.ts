import { defineConfig } from 'tsup';
import { vanillaExtractPlugin } from '@vanilla-extract/esbuild-plugin';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  treeshake: true,
  external: ['react', 'react-dom', '@iconify/react'],
  esbuildPlugins: [
    vanillaExtractPlugin({
      // CSS를 JS에 자동 주입
      identifiers: 'short',
    }),
  ],
  esbuildOptions(options) {
    options.banner = {
      js: '"use client";',
    };
  },
});
