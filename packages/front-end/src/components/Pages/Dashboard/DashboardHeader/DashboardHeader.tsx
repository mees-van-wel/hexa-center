"use client";

import { Group, Paper, Stack, Title } from "@mantine/core";
import type { ReactNode } from "react";
import styles from "./DashboardHeader.module.scss";
import CustomAvatar from "../CustomAvatar/CustomAvatar";
import { useTranslation } from "@/hooks/useTranslation";
import Link from "next/link";
import { IconChevronRight } from "@tabler/icons-react";

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
    <Group align="stretch">
      {children && 
        <Paper p="md" className={styles.headerChildren}>
          {children}
        </Paper>
      }
      <Paper className={styles.dashboardcontainer} p="md">
        <Group justify="space-between" wrap="nowrap">
          <span>&nbsp;</span>
          <Group justify="center" gap={"xs"}>
              {icon && icon}
              {title.map(({ content, href }, index) => {
            const isLast = title.length - 1 === index;
            const Component = href ? Link : Title;

            return (
              <div key={content + index}>
                <div className={styles.dashboardHeaderTitle}>
                    <Component href={href} order={2}>{content}</Component>
                </div>
                {!isLast && <IconChevronRight /> }
              </div>
            );
            })}
          </Group>
          <CustomAvatar />
        </Group>
      </Paper>
    </Group>
  )
};
