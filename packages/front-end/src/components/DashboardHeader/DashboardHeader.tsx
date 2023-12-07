"use client";

import { Group, Paper, Stack, Title } from "@mantine/core";
import type { ReactNode } from "react";
import styles from "./DashboardHeader.module.scss";
import CustomAvatar from "../CustomAvatar";
import { useTranslation } from "@/hooks/useTranslation";
import Link from "next/link";
import { IconArrowRight, IconChevronRight } from "@tabler/icons-react";

type titleObject = {
  content: string;
  href: string;
};

type DashboardHeaderProps = {
  children?: ReactNode;
  title: titleObject[];
  icon?: ReactNode;
};

export const DashboardHeader = ({ children, title, icon }: DashboardHeaderProps) => {
  const t = useTranslation();
    
  return  (
          <Group className={styles.dashboardHeader}>
            {children && <Paper p="md" display={"flex"} style={{alignItems: "center"}}>
              {children}
            </Paper>}
            <Paper p="md" style={{flex: "1 1 0%"}}>
              <Group justify="space-between" wrap="nowrap">
                <span>&nbsp;</span>
                <Group justify="center" gap={"xs"} className={styles.dashboardHeaderTitleRoot}>
                    {icon && icon}
                    {title.map(({ content, href }, index) => {
                  const isLast = title.length - 1 === index;
                  const Component = href ? Link : Title;

                  return (
                    <>
                        <div className={styles.dashboardHeaderTitle}>
                            <Component href={href} order={2}>{content}</Component>
                        </div>
                        {!isLast && <IconChevronRight /> }
                    </>
                  );
                  })}
                </Group>
                <CustomAvatar />
              </Group>
            </Paper>
          </Group>
)};
