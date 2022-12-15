const withInterceptStdout = require('next-intercept-stdout')

const nextConfig = withInterceptStdout(
  {
    reactStrictMode: false,
    swcMinify: true,
  },
  (text) => (text.includes('Duplicate atom key') ? '' : text),
)

module.exports = nextConfig
