// export const runtime = "edge";

import type { Metadata } from "next";
import localFont from "next/font/local";
import { headers } from "next/headers";
import { redirect, RedirectType } from "next/navigation";

import { AuthContextProvider } from "@/contexts/AuthContext";
import { TranslationInitializer } from "@/initializers/TranslationInitializer";
import { getTrpcClientOnServer } from "@/utils/trpcForServer";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { TRPCClientError } from "@trpc/client";

import Providers from "./providers";
import { AppRouter, RouterOutput } from "./trpc";

import "modern-normalize/modern-normalize.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/charts/styles.css";
import "./globals.scss";

const eurostile = localFont({
  src: "../assets/fonts/eurostile.woff2",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hexa Center",
};

// TODO variable light dark theme
const dark = false;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = headers().get("x-pathname");
  if (!pathname) throw new Error("Missing pathname");

  let user: RouterOutput["auth"]["currentUser"] | null = null;

  try {
    const trpc = getTrpcClientOnServer();
    user = await trpc.auth.currentUser.query();
  } catch (e) {
    const error = e as TRPCClientError<AppRouter>;
    const code = error.meta?.response?.status as number | undefined;
    if (code === 418)
      redirect("https://www.hexa.center/", RedirectType.replace);
  }

  if (!user && pathname !== "/login") redirect("/login", RedirectType.replace);
  if (user && pathname === "/login") redirect("/", RedirectType.replace);

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
