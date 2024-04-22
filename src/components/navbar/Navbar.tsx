import { Box, Button, Flex, Heading, Spacer } from '@chakra-ui/react'
import React from 'react'
import { signOut } from "next-auth/react";


const Navbar = () => {
  return (
    <Flex as="nav" p="10px" w="100%" bg="blue.700" alignItems="center">
      <Heading as="h1" fontSize="25px" textColor="Window">
        Liquidate Inventory
      </Heading>
      <Spacer />
      <Button
        w="80px"
        h="40px"
        color="white"
        bg="blue.900"
        rounded={10}
        onClick={() => signOut()}
      >
        Sing out
      </Button>
    </Flex>
  );
}

export default Navbar