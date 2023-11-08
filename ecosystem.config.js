module.exports = {
    apps: [
        {
            name: "new.resellcle.com",
            exec_mode: "cluster",
            instances: "1",
            script: "node_modules/next/dist/bin/next",
            args: "start",
            env: {
                NODE_ENV: "production",
                PORT: 3008,
                DOMAIN: "resellcle.com",
                COOKIE_SECURE: "true",
                REMOTE_PATTERN_HTTP: "false",
                RECAPTCHA_SITE_KEY: "6LdrpJgoAAAAAJS-UISxQsPGIhauG102oMBe0JQu",
            },
        },
    ],
};
