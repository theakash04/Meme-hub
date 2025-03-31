import { defineConfig } from 'vite';
import { VitePWA } from "vite-plugin-pwa";
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: [
                'favicon-16x16.png',
                'favicon-32x32.png',
                'apple-touch-icon.png',
            ],
            devOptions: {
                enabled: true,
            },
            manifest: {
                name: 'Meme-Hub',
                short_name: 'M-HUB',
                description: 'A collaborative meme maker and editor',
                theme_color: '#ffffff',
                icons: [
                    {
                        src: '/icons/pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: '/icons/pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                ],
            },
        }),
    ],
})
