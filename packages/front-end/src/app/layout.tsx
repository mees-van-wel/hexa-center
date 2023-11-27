// export const runtime = "edge";

import "modern-normalize/modern-normalize.css";
import "@mantine/core/styles.css";
import "./globals.scss";

import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import type { Metadata } from "next";
import localFont from "next/font/local";
import RecoilProvider from "@/providers/RecoilProvider";

const eurostile = localFont({
  src: "../assets/fonts/eurostile.woff2",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hexa Center",
};

// TODO variable light dark theme
const dark = true;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body
        className={eurostile.className}
        data-theme={dark ? "dark" : "light"}
      >
        <RecoilProvider>
          <MantineProvider
            defaultColorScheme={dark ? "dark" : "light"}
            theme={{
              fontFamily: eurostile.style.fontFamily,
              colors: {},
            }}
          >
            {children}
          </MantineProvider>
        </RecoilProvider>
      </body>
      {}
    </html>
  );
}
