"use client";
import {
  Box,
  ListItem,
  UnorderedList,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Menu } from "@/types/next-auth";


const Sidebar = () => {
  const { data: session, status } = useSession();
  const menus = session?.user.user.menus as Menu[];
  
  const [selectedOption, setSelectedOption] = useState(null);

  const handleMenuClick = (option: any) => {
    setSelectedOption(option);
  };

  return (
    <Box
      bg="gray.500"
      color="Window"
      border="1px solid"
      height="100%"
      width="100%"
      borderTopRightRadius="10px"
      borderBottomRightRadius="10px"
    >
      <UnorderedList>
        {menus &&
          menus.map((menu) => (
            <ListItem
              key={menu.id}
              marginTop={3}
              marginInlineStart={4}
              color="Window"
            >
              <Link href={menu.link}>{menu.option}</Link>
            </ListItem>
          ))}
      </UnorderedList>
    </Box>
  );
};

export default Sidebar;
