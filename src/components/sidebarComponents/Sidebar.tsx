"use client";
import { Box, List, ListIcon, ListItem } from "@chakra-ui/react";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Menu } from "@/types/next-auth";
import { ArrowRightIcon } from "@chakra-ui/icons";
import styles from "./sidebar.module.css";
import { usePathname, useRouter } from "next/navigation";

export type SideBarProps = {
  onClickItem?: () => void;
};

const Sidebar = (props: SideBarProps) => {
  const { onClickItem } = props;
  const { data: session, status } = useSession();
  const router = useRouter()
  const pathname = usePathname()
  const menus = session?.user.user.menus as Menu[];

  const [selectedOption, setSelectedOption] = useState<Menu | null>(null);

  const handleMenuClick = (option: Menu) => {
    setSelectedOption(option);
    router.push(option.link)
    onClickItem?.();
  };

  return (
    <Box
      // bg="gray.500"
      // color="Window"
      // border="1px solid"
      // height="100%"
      // width="100%"
      // borderTopRightRadius="10px"
      // borderBottomRightRadius="10px"
      padding={0}
    >
      <List padding={0}>
        {menus &&
          menus.map((menu) => {
            const icon = menu.icon ?? "fa-solid fa-rocket";
            return (
              <ListItem key={menu.id} marginTop={3} color="blue.800">
                <button onClick={(e) => handleMenuClick(menu)}  className={styles.link_item}>
                  <i className={icon}></i>
                  {menu.option}
                </button>
              </ListItem>
            );
          })}
      </List>
    </Box>
  );
};

export default Sidebar;
