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
      bg="white"
      alignItems="center"
      position="relative" // Asegura que el z-index se aplique correctamente
      zIndex="docked"
      style={{
        boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)"
      }} // zIndex alto para mantener el Navbar sobre otros elementos
    >
      
      <IconButton
        aria-label="Open Sidebar"
        icon={<HamburgerIcon color={"ActiveCaption"} />}
        onClick={onOpenSidebar}
        colorScheme="blue.200"
        mr={4} // Margen derecho para separar del título
      />
      <Image
        src={"/logo.webp"}
        width={500}
        height={500}
        alt="Logo de Inventory"
        style={{
          width: 50,
          aspectRatio: "1/1",
          objectFit: "cover"
        }}
        unoptimized
      ></Image>
    
      <Spacer />
      <Button
       variant={"outline"}
        w="80px"
        h="40px"
      
        
        rounded={10}
        onClick={() => signOut()}
        style={{
          color: "blue"
        }}
      >
        <i className="fa-solid fa-right-from-bracket"></i>
      </Button>
    </Flex>
  );
};

export default Navbar;
