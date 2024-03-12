import { defineConfig, loadEnv } from 'vite';
import vue from "@vitejs/plugin-vue";
import { createHtmlPlugin } from "vite-plugin-html";
import { fileURLToPath, URL } from "url";
import { VitePWA } from 'vite-plugin-pwa'
// target: browserslistToEsbuild(),
function virtualMessagePlugin() {
    const virtual = 'virtual:message'
    const resolvedVirtual = `\0${virtual}`
    return {
        name: 'vite-plugin-test',
        resolveId(id) {
            return id === virtual ? resolvedVirtual : null
        },
        load(id) {
            if (id === resolvedVirtual)
                return `export const message = 'Message from Virtual Module Plugin'`
        },
    }
}

export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, process.cwd(), 'VUE_APP_')
    const APP_VERSION = '1.0.0';

    return {
        define: {
        },
        resolve: {
            alias: [
                { find: '@axios', replacement: fileURLToPath(new URL('./src/assets/libraries/axios@1.6.5.js', import.meta.url)) },
                { find: '@vue-router', replacement: fileURLToPath(new URL('./src/assets/libraries/vue-router@4.2.5.global.js', import.meta.url)) },
                { find: '@vee-validate', replacement: fileURLToPath(new URL('./src/assets/libraries/vee-validate@4.12.4.js', import.meta.url)) },
                { find: '@number-input', replacement: fileURLToPath(new URL('./src/assets/libraries/custom-number-input.js', import.meta.url)) },
                { find: '@flatpickr', replacement: fileURLToPath(new URL('./src/assets/libraries/flatpickr@4.6.13.js', import.meta.url)) },
                { find: '@vue-flatpickr-component', replacement: fileURLToPath(new URL('./src/assets/libraries/vue-flatpickr-component@11.0.4.js', import.meta.url)) },
                { find: '@nprogress', replacement: fileURLToPath(new URL('./src/assets/libraries/nprogress@0.2.0.js', import.meta.url)) },
            ]
        },
        plugins: [
            vue(),
            createHtmlPlugin({
                inject: {
                    data: {
                        cdnScript: process.env.NODE_ENV === "production"
                            ? `<script src="/js/vue@3.4.5.global.prod.js"></script>`
                            : `<script src="/js/vue@3.4.5.global.js"></script>`,
                    },
                },
            }),
            VitePWA({
                registerType: 'autoUpdate',
                workbox: {
                    clientsClaim: true,
                    skipWaiting: true
                }
            })
        ],
        server: {
            open: true,
            port: env.VUE_APP_PORT,
            proxy: {
                '/api': {
                    target: env.VUE_APP_SERVER_PROXY,
                    changeOrigin: true,
                }
            }
        },
        esbuild: {
            minify: true
        },
        build: {
            target: 'esnext',
            minify: 'terser',
            terserOptions: {
                compress: {
                    drop_debugger: true,
                    drop_console: true,
                },
                mangle: true,
                output: {
                    comments: false,
                },
            },
            rollupOptions: {
                output: {
                    entryFileNames: `assets/[hash:22].js`,
                    chunkFileNames: `assets/[hash:22].js`,
                    assetFileNames: `assets/[hash:22].[ext]`
                }
            }
        }
    }
});

// manifest: {
//     "name": "Vue Login",
//     "short_name": "Login",
//     "theme_color": "#0d6efd",
//     "background_color": "#fff",
//     "display": "standalone",
//     "scope": "/",
//     "start_url": "/",
//     "icons": [
//         {
//             "src": "images/icons/icon-72x72.png",
//             "sizes": "72x72",
//             "type": "image/png"
//         },
//         {
//             "src": "images/icons/icon-96x96.png",
//             "sizes": "96x96",
//             "type": "image/png"
//         },
//         {
//             "src": "images/icons/icon-128x128.png",
//             "sizes": "128x128",
//             "type": "image/png"
//         },
//         {
//             "src": "images/icons/icon-144x144.png",
//             "sizes": "144x144",
//             "type": "image/png"
//         },
//         {
//             "src": "images/icons/icon-152x152.png",
//             "sizes": "152x152",
//             "type": "image/png"
//         },
//         {
//             "src": "images/icons/icon-192x192.png",
//             "sizes": "192x192",
//             "type": "image/png"
//         },
//         {
//             "src": "images/icons/icon-384x384.png",
//             "sizes": "384x384",
//             "type": "image/png"
//         },
//         {
//             "src": "images/icons/icon-512x512.png",
//             "sizes": "512x512",
//             "type": "image/png"
//         }
//     ]
// },
// // registerType: 'autoUpdate',
// // injectRegister: 'auto',
// // workbox: {
// //     cleanupOutdatedCaches: true,
// // },
// strategies: 'injectManifest',
// injectManifest: {
//     minify: false,
//     enableWorkboxModulesLogs: true,
//     buildPlugins: {
//         vite: [virtualMessagePlugin()],
//     },
// },
// registerType: 'autoUpdate',
// selfDestroying: true,
