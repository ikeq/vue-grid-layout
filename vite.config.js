import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue2';
import vueJsx from '@vitejs/plugin-vue2-jsx';
import pkg from './package.json';

export default defineConfig((env) => {
  return {
    plugins: [vue(), vueJsx()],
    build: {
      minify: false,
      lib: {
        entry: 'src/components/index.js',
        formats: ['es'],
      },
      rollupOptions: {
        external: Object.keys(pkg.dependencies),
      },
    },
    define: {
      __DEV__: env.command === 'serve',
    },
    css: {
      modules: {
        localsConvention: 'camelCaseOnly',
        generateScopedName(name, filename, css) {
          // const cls = `${relative(srcRoot, join(filename, '..')).replace(/[\/\\]/g, '-')}-${name}`;

          return `vg-${name}`;
        },
      },
    },
  };
});
