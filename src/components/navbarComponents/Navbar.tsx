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
      bg="blue.800"
      alignItems="center"
      position="relative" // Asegura que el z-index se aplique correctamente
      zIndex="docked" // zIndex alto para mantener el Navbar sobre otros elementos
    >
      
      <IconButton
        aria-label="Open Sidebar"
        icon={<HamburgerIcon />}
        onClick={onOpenSidebar}
        colorScheme="blue.100"
        mr={4} // Margen derecho para separar del título
      />
      <Image
        src={"/logo-alt.webp"}
        width={500}
        height={500}
        alt="Logo de Inventory"
        style={{
          width: 100,
          height: 50,
          objectFit: "cover"
        }}
        unoptimized
      ></Image>
    
      <Spacer />
      <Button
        colorScheme="blue"
        w="80px"
        h="40px"
        color="blue.800"
        bg="white"
        rounded={10}
        onClick={() => signOut()}
      >
        <i className="fa-solid fa-right-from-bracket"></i>
      </Button>
    </Flex>
  );
};

export default Navbar;
