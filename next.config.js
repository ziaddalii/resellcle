/** @type {import('next').NextConfig} */
const nextConfig = {
    modularizeImports: {
        "@mui/icons-material": {
            transform: "@mui/icons-material/{{member}}",
        },
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    // Added to make Image/next accepts direct links
    images: {
        remotePatterns: [
            process.env.REMOTE_PATTERN_HTTP === "true" ?
                {
                    protocol: "http",
                    hostname: "**",
                    port: "3007",
                    pathname: "**",
                } : {
                    protocol: "https",
                    hostname: "**",
                    port: "",
                    pathname: "**",
                },
        ],
    },
    experimental: {
        serverActions: true,
    },
};

const withNextIntl = require("next-intl/plugin")(
    "./i18n.ts"
);

module.exports = withNextIntl(nextConfig);
