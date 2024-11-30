"use client";
import { Box, List, ListIcon, ListItem } from "@chakra-ui/react";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Menu } from "@/types/next-auth";
import { ArrowRightIcon } from "@chakra-ui/icons";
import styles from "./sidebar.module.css";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

export type SideBarProps = {
  onClickItem?: () => void;
  isOpen?: boolean;
};

const Sidebar = (props: SideBarProps) => {
  const { onClickItem } = props;
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const menus = session?.user.user.menus as Menu[];

  console.log("Menus", menus);

  const [selectedOption, setSelectedOption] = useState<Menu | null>(null);

  const handleMenuClick = (option: Menu) => {
    setSelectedOption(option);
    router.push(option.link);
    onClickItem?.();
  };

  return (
    <Box
      padding={0}
      className={`${styles.sidebar} ${props.isOpen ? styles.minimize : ""}`}
    >
      <div className="w-full flex border-b border-blue-100 p-2 justify-center items-center">
        <Image
          src={"/logo_inventory.svg"}
          width={500}
          height={500}
          alt="Logo de Inventory"
          style={{
            width: 34,
            aspectRatio: "1/1",
            objectFit: "cover",
          }}
          unoptimized
        ></Image>
        {!props.isOpen && (
          <span className="ml-2 text-lg text-blue-600 text-nowrap">
            Liquidate Inventory
          </span>
        )}
      </div>

      <List className={` w-full bg-blue-600 border-r border-blue-100 flex-1 py-4 ${!props.isOpen ? "px-4 ": ""}`}>
        {menus &&
          menus.map((menu) => {
            const icon = menu.icon ?? "fa-solid fa-rocket";
            return (
              <ListItem key={menu.id}>
                <button
                  className="px-4 py-2 capitalize rounded-md w-full text-[white] hover:bg-blue-100 hover:text-blue-600 flex gap-2 items-center"
                  onClick={(e) => handleMenuClick(menu)}
                >
                  <i className={icon}></i>
                  {!props.isOpen && (
                    <span className=" text-nowrap max-w-24 text-ellipsis overflow-hidden inline-block">
                      {menu.option}
                    </span>
                  )}
                </button>
              </ListItem>
            );
          })}
      </List>
    </Box>
  );
};

export default Sidebar;
