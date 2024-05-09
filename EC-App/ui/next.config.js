loadEnv(process.env.APP_ENV);

/** @type {import('next').NextConfig} */
const nextConfig = {
  target: 'serverless',
  reactStrictMode: true,
  trailingSlash: true,
  swcMinify: true,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
};

module.exports = nextConfig;

/**
 * @param {string} appEnv
 */
function loadEnv(appEnv = 'development') {
  process.env.NEXT_PUBLIC_BASE_PATH = '';
  process.env.CLIENT_NAME = process.env.CLIENT_NAME || appEnv;

  const config =
    appEnv === 'development'
      ? require(`./env/env.development`)
      : require(`./env/env.${process.env.CLIENT_NAME}`);

  const env = {
    ...config,
    NEXT_PUBLIC_APP_ENV: appEnv,
  };

  Object.entries(env).forEach(([key, value]) => {
    process.env[key] = value;
  });
}
