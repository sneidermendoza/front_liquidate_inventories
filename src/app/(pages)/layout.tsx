"use client";
import { useDisclosure } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Navbar from "@/components/navbarComponents/Navbar";
import Sidebar from "@/components/sidebarComponents/Sidebar";
import { Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, DrawerFooter, Button } from "@chakra-ui/react";
import { Grid, GridItem } from "@chakra-ui/react";

const AuthLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const session = useSession();
  const router = useRouter();
  const { isOpen,  onOpen, isControlled, onClose } = useDisclosure(); // Hook para el Drawer

  const handleClickItem = () => {
    onClose()
  }

  useEffect(() => {
    // Verificar el estado de la sesión y redirigir si es necesario
    if (session.status === "unauthenticated") {
      router?.push("/");
    }
  }, [session.status, router]);

  return session.status === "authenticated" ? (
    <>
      <Navbar onOpenSidebar={onOpen} />
      
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        
        size="xs"
        preserveScrollBarGap
      >
        <DrawerOverlay />
        <DrawerContent
          sx={{
            zIndex: "docked", // Mantén el contenido del Drawer en la misma capa que el Drawer
          }}
        >
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody padding={0}>
            <Sidebar onClickItem={handleClickItem} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <Grid
        templateRows="auto 1fr" // Navbar y luego el resto del espacio para los otros componentes
        templateColumns="1fr" // Solo una columna para el contenido principal
        height="100vh"
      >
        <GridItem
          rowSpan={2}
          colSpan={1}
          overflowY="clip"
          overflowX="auto"
          maxHeight="100vh"
          maxWidth="100vw"
        >
          {children}
        </GridItem>
      </Grid>
    </>
  ) : null;
};

export default AuthLayout;
