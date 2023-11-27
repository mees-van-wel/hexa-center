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
            <Group align="stretch" className={styles.layoutContainer}>
              <Paper>
                <Stack>
                  <Group>
                    {/* <img src={Icon} width={48} height={48} /> */}
                    <Stack gap={"xs"}>
                      <Title order={2}>
                        Hexa Center
                      </Title>
                      <Title order={6}>
                        company name
                      </Title>
                    </Stack>
                  </Group>
                  <nav style={{overflow: "auto"}}>
                    <Stack>
                      <Button leftSection={"lol"} fullWidth justify="left">
                        Home
                      </Button>
                      <Stack>
                        <Title order={4}>
                          Essentials
                        </Title>
                        <Stack>
                          <Button leftSection={"lol"} fullWidth justify="left">
                            Properties
                          </Button>
                          <Button leftSection={"lol"} fullWidth justify="left">
                            Roles
                          </Button>
                          <Button leftSection={"lol"} fullWidth justify="left">
                            Users
                          </Button>
                        </Stack>
                      </Stack>
                    </Stack>
                  </nav>
                </Stack>
              </Paper>
              <Stack style={{flex: "1 1 0%", justifyContent: "flex-start"}}>
                <Group>
                  <Paper>
                    <Button>
                      Create
                    </Button>
                  </Paper>
                  <Paper style={{flex: "1 1 0%"}}>
                    <Group justify="end">
                      <Group>
                      {/* {title.map(({ content, href }, index) => {
                      const isLast = title.length - 1 === index;
                      const Component = href ? Link : "div"; */}

                      {/* return ( */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Title order={4}>Home</Title>
                          {/* {!isLast && <Title size={4}>&#x203A;</Title>} */}
                        </div>
                      {/* );
                      })} */}
                      </Group>
                      <Popover>
                        <CustomAvatar />
                      </Popover>
                    </Group>
                  </Paper>
                </Group>
                <main style={{flex: "1 1 0%", margin: "1rem"}}>
                  {children}
                </main>
              </Stack>
            </Group>
          </MantineProvider>
        </RecoilProvider>
      </body>
      {}
    </html>
  );
}
