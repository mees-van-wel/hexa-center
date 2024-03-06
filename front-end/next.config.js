// const ContentSecurityPolicy = `
//   default-src 'self';
//   img-src 'self' data:;
//   script-src 'self' 'unsafe-eval';
//   style-src 'self' 'unsafe-inline' fonts.googleapis.com https://i.imgur.com;
//   connect-src *;
// `;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.hexa.center",
      },
    ],
  },
  poweredByHeader: false,
  output: "standalone",
  experimental: {
    typedRoutes: true,
    optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          // {
          //   key: "Permissions-Policy",
          //   value:
          //     "accelerometer=(), ambient-light-sensor=(), autoplay=(), battery=(), camera=(), cross-origin-isolated=(), display-capture=(), document-domain=(), encrypted-media=(), execution-while-not-rendered=(), execution-while-out-of-viewport=(), fullscreen=(), geolocation=(), gyroscope=(), keyboard-map=(), magnetometer=(), microphone=(), midi=(), navigation-override=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), sync-xhr=(), usb=(), web-share=(), xr-spatial-tracking=(), clipboard-read=(self), clipboard-write=(self), gamepad=(), speaker-selection=(), conversion-measurement=(), focus-without-user-activation=(), hid=(), idle-detection=(), interest-cohort=(), serial=(), sync-script=(), trust-token-redemption=(), window-placement=(), vertical-scroll=()"
          // },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "same-origin",
          },
          // {
          //   key: "Content-Security-Policy",
          //   value: ContentSecurityPolicy.replace(/\s{2,}/g, " ").trim(),
          // },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
