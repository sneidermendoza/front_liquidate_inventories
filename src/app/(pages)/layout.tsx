"use client";
import { useDisclosure } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Navbar from "@/components/navbarComponents/Navbar";
import Sidebar from "@/components/sidebarComponents/Sidebar";
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  DrawerFooter,
  Button,
} from "@chakra-ui/react";
import { Grid, GridItem } from "@chakra-ui/react";

const AuthLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const session = useSession();
  const router = useRouter();
  const { isOpen, onOpen, isControlled, onClose } = useDisclosure(); // Hook para el Drawer

  const handleClickItem = () => {
    onClose();
  };

  useEffect(() => {
    // Verificar el estado de la sesión y redirigir si es necesario
    if (session.status === "unauthenticated") {
      router?.push("/");
    }
  }, [session.status, router]);

  return session.status === "authenticated" ? (
    <>
      <div className="flex w-full  h-full">
        <Sidebar  onClickItem={handleClickItem} />
        <div className="flex flex-col w-full">
          <Navbar onOpenSidebar={onOpen} />

          <div className="flex-1 p-4 overflow-y-clip overflow-x-auto max-h-screen">
            {children}
          </div>
        </div>
      </div>
    </>
  ) : null;
};

export default AuthLayout;
