import {
  Box,
  Button,
  Flex,
  Heading,
  Spacer,
  IconButton,
} from "@chakra-ui/react";
import React from "react";
import { signOut } from "next-auth/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import Image from "next/image"

export type NavbarProps = {
  onOpenSidebar: () => void
}

const Navbar = ({ onOpenSidebar }: NavbarProps) => {
  return (
    <Flex
      as="nav"
      p="10px"
      w="100%"
      alignItems="center"
      position="relative" // Asegura que el z-index se aplique correctamente
      zIndex="docked"
      className=" border-b border-blue-100 drop-shadow-sm justify-between" // zIndex alto para mantener el Navbar sobre otros elementos
    >
      
      <IconButton
        aria-label="Open Sidebar"
        icon={<HamburgerIcon color={"ActiveCaption"} />}
        onClick={onOpenSidebar}
        colorScheme="blue.200"
        mr={4}
      
         // Margen derecho para separar del título
      />
      
      <Button
       variant={"outline"}
        w="60px"
        h="30px"
      
        
        rounded={10}
        onClick={() => signOut()}
        className="!border !border-blue-600 !text-blue-600"
      >
        <i className="fa-solid fa-right-from-bracket"></i>
      </Button>
    </Flex>
  );
};

export default Navbar;
