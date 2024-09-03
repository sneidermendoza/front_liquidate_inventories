import { Box, Button, Flex, Heading, Spacer, IconButton } from "@chakra-ui/react";
import React from "react";
import { signOut } from "next-auth/react";
import { HamburgerIcon } from "@chakra-ui/icons";

const Navbar = ({ onOpenSidebar }) => {
  return (
    <Flex
      as="nav"
      p="10px"
      w="100%"
      bg="blue.700"
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
      <Heading as="h1" fontSize="25px" textColor="Window">
        Liquidate Inventory
      </Heading>
      <Spacer />
      <Button
        colorScheme="blue"
        w="80px"
        h="40px"
        color="white"
        bg="blue.900"
        rounded={10}
        onClick={() => signOut()}
      >
        Sign out
      </Button>
    </Flex>
  );
};

export default Navbar;
