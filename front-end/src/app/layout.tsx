// export const runtime = "edge";

import "modern-normalize/modern-normalize.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/charts/styles.css";
import "@mantine/tiptap/styles.css";
import "./globals.scss";

import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import axios from "axios";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { headers } from "next/headers";
import { redirect, RedirectType } from "next/navigation";

import { AuthContextProvider, Iotd } from "@/contexts/AuthContext";
import { TranslationInitializer } from "@/initializers/TranslationInitializer";
import { tRPCError } from "@/types/tRPCError";
import { isProduction } from "@/utils/environment";
import { type RouterOutput } from "@/utils/trpc";
import { getTrpcClientOnServer } from "@/utils/trpcForServer";

import Providers from "./providers";

const eurostile = localFont({
  src: "../assets/fonts/eurostile.woff2",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hexa Center",
};

// TODO variable light dark theme
const dark = !isProduction;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = headers().get("x-pathname");
  if (!pathname) throw new Error("Missing pathname");

  let user: RouterOutput["auth"]["currentUser"] | null = null;

  try {
    const trpc = await getTrpcClientOnServer();

    user = await trpc.auth.currentUser.query();
  } catch (e) {
    const error = e as tRPCError;
    console.log(error);
    const code = error.meta?.response?.status as number | undefined;
    if (code === 418)
      redirect("https://www.hexa.center/", RedirectType.replace);
  }

  if (!user && pathname !== "/login") redirect("/login", RedirectType.replace);
  if (user && pathname === "/login") redirect("/", RedirectType.replace);

  const today = new Date();
  let iotd: Iotd | null = null;
  const isSpecial =
    (today.getMonth() + 1 === 9 && today.getDate() === 5) ||
    (today.getMonth() + 1 === 10 && today.getDate() === 27);

  if (!isSpecial) {
    try {
      const { data } = await axios.get(
        "https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1",
      );

      const image = data?.images?.[0];
      if (image)
        iotd = {
          copyright: image.copyright,
          copyrightlink: image.copyrightlink,
          url: `https://www.bing.com${image.url}`,
        };
    } catch (e) {
      console.warn("Unable to fetch image of the day", e);
    }
  }

  return (
    <html lang="nl">
      <head>
        <ColorSchemeScript />
      </head>
      <body
        className={eurostile.className}
        data-theme={dark ? "dark" : "light"}
      >
        <Providers>
          <AuthContextProvider currentUser={user} iotd={iotd}>
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
