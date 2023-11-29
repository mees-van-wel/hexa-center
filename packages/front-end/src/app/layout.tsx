// export const runtime = "edge";

import "@mantine/core/styles.css";

import { MantineProvider, ColorSchemeScript, Group, Paper, Stack, Title, Button, Popover, Avatar, Menu } from "@mantine/core";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import styles from "./page.module.scss";
import RecoilProvider from "@/providers/RecoilProvider";
import CustomAvatar from "@/components/CustomAvatar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Mantine app",
  description: "I have followed setup instructions carefully",
};

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
      <body className={inter.className} style={{backgroundColor: "black"}}>
        <RecoilProvider>
          <MantineProvider defaultColorScheme="auto">
            {children}
          </MantineProvider>
        </RecoilProvider>
      </body>
      {}
    </html>
  );
}
