// export const runtime = "edge";

import "modern-normalize/modern-normalize.css";
import "@mantine/core/styles.css";
import "./globals.scss";

import { cookies, headers } from "next/headers";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { TranslationInitializer } from "@/initializers/TranslationInitializer";
import Providers from "./providers";
import { AuthContextProvider } from "@/contexts/AuthContext";
import { redirect } from "next/navigation";

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
  const refreshToken = cookies().get("refreshToken")?.value;
  const pathname = headers().get("x-pathname");
  if (!pathname) throw new Error("Missing pathname");

  const res = refreshToken
    ? await fetch(`${process.env.NEXT_PUBLIC_API_URL}/current-user`, {
        headers: refreshToken
          ? { Authorization: `Bearer ${refreshToken}` }
          : undefined,
      })
    : undefined;

  if ((!refreshToken || !res?.ok) && pathname !== "/login") redirect("/login");
  if (refreshToken && res?.ok && pathname === "/login") redirect("/");

  const data = await res?.json();

  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body
        className={eurostile.className}
        data-theme={dark ? "dark" : "light"}
      >
        <Providers>
          <AuthContextProvider currentUser={res?.ok && data ? data : null}>
            <TranslationInitializer>
              <MantineProvider
                defaultColorScheme={dark ? "dark" : "light"}
                theme={{
                  fontFamily: eurostile.style.fontFamily,
                  cursorType: "pointer",
                }}
              >
                {children}
              </MantineProvider>
            </TranslationInitializer>
          </AuthContextProvider>
        </Providers>
      </body>
    </html>
  );
}
