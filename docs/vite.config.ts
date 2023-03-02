import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite'
import { ArcoResolver } from 'unplugin-vue-components/resolvers';
import { SearchPlugin } from 'vitepress-plugin-search'
import viteCompression from 'vite-plugin-compression'

export default defineConfig({
    plugins: [
        // SearchPlugin({
        // encode: false,
        // tokenize: 'full'
        // }),
        Components({
            dirs: ['.vitepress/theme/components'],
            include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
            resolvers: [ArcoResolver({ sideEffect: true, resolveIcons: true })]
        }),
        viteCompression({
            verbose: true,
            disable: false,
            threshold: 10240,
            algorithm: 'gzip',
            ext: '.gz',
        })
    ],
    ssr: { noExternal: ['@arco-design/web-vue'] },
    build: {
        chunkSizeWarningLimit: 2000,
        minify: 'terser',
        rollupOptions: {
            output: {
                chunkFileNames: 'static/js/[name]-[hash].js',
                entryFileNames: 'static/js/[name]-[hash].js',
                assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        return id.toString().split('node_modules/')[1].split('/')[0].toString();
                    }
                }
            }
        }
    }
})
