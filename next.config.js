const withPWA = require('next-pwa')({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    register: true,
})

/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['lucide-react'],
    experimental: {
        serverComponentsExternalPackages: ['@neplex/vectorizer'],
    },
    webpack: (config, { isServer }) => {
        if (isServer) {
            // Externalize native modules to prevent webpack from bundling them
            config.externals = config.externals || [];
            config.externals.push({
                '@neplex/vectorizer': 'commonjs @neplex/vectorizer',
                '@neplex/vectorizer-darwin-arm64': 'commonjs @neplex/vectorizer-darwin-arm64',
                '@neplex/vectorizer-darwin-x64': 'commonjs @neplex/vectorizer-darwin-x64',
                '@neplex/vectorizer-linux-x64-gnu': 'commonjs @neplex/vectorizer-linux-x64-gnu',
                '@neplex/vectorizer-win32-x64-msvc': 'commonjs @neplex/vectorizer-win32-x64-msvc',
            });
        }
        return config;
    },
};

module.exports = withPWA(nextConfig);