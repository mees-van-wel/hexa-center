// export const runtime = "edge";

import "modern-normalize/modern-normalize.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./globals.scss";

import { cookies, headers } from "next/headers";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { TranslationInitializer } from "@/initializers/TranslationInitializer";
import Providers from "./providers";
import { AuthContextProvider } from "@/contexts/AuthContext";
import { redirect } from "next/navigation";
import { RouterOutput, setTRPCRefreshToken, trpc } from "@/utils/trpc";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";

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

  let user: RouterOutput["auth"]["currentUser"] | null = null;

  try {
    if (refreshToken) setTRPCRefreshToken(refreshToken);
    user = await trpc.auth.currentUser.query();
  } catch (error) {}

  // TODO Set redirect type to replace
  if (!user && pathname !== "/login") redirect("/login");
  if (user && pathname === "/login") redirect("/");

  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body
        className={eurostile.className}
        data-theme={dark ? "dark" : "light"}
        style={{ height: "100%" }}
      >
        <Providers>
          <AuthContextProvider currentUser={user}>
            <TranslationInitializer>
              <MantineProvider
                defaultColorScheme={dark ? "dark" : "light"}
                theme={{
                  fontFamily: eurostile.style.fontFamily,
                  cursorType: "pointer",
                }}
              >
                <Notifications position="top-right" />
                <ModalsProvider>{children}</ModalsProvider>
              </MantineProvider>
            </TranslationInitializer>
          </AuthContextProvider>
        </Providers>
      </body>
    </html>
  );
}
