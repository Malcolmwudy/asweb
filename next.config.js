/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  // 渠道重定向规则 - 与 Netlify 配置保持一致
  async redirects() {
    return [
      // 渠道 A (asa) - 重定向到首页并添加 ?axiselectweba 参数
      {
        source: '/asa/:path*',
        destination: '/?axiselectweba',
        permanent: true,
      },
      {
        source: '/asa',
        destination: '/?axiselectweba',
        permanent: true,
      },
      // 渠道 B (asb) - 重定向到首页并添加 ?axiselectwebb 参数
      {
        source: '/asb/:path*',
        destination: '/?axiselectwebb',
        permanent: true,
      },
      {
        source: '/asb',
        destination: '/?axiselectwebb',
        permanent: true,
      },
      // 渠道 C (asc) - 重定向到首页并添加 ?axiselectwebc 参数
      {
        source: '/asc/:path*',
        destination: '/?axiselectwebc',
        permanent: true,
      },
      {
        source: '/asc',
        destination: '/?axiselectwebc',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig

