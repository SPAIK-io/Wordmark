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
};

module.exports = withPWA(nextConfig);