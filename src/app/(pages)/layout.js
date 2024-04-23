"use client"
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Navbar from "@/components/navbarComponents/Navbar";
import Sidebar from "@/components/sidebarComponents/Sidebar";
import { Grid, GridItem } from "@chakra-ui/react";

const AuthLayout = ({ children }) => {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    // Verificar el estado de la sesión y redirigir si es necesario
    if (session.status === "unauthenticated") {
      router?.push("/");
    }
  }, [session.status, router]);

  // Renderizar los hijos solo si la sesión está autenticada
  return session.status === "authenticated" ? (
    <>
      <Grid
        templateRows="auto 1fr" // Navbar y luego el resto del espacio para los otros componentes
        templateColumns="220px 1fr" // El Sidebar y luego el espacio para los otros componentes
        height="100vh"
      >
        <GridItem rowSpan={1} colSpan={2}>
          {/* El Navbar ocupa toda la primera fila */}
          <Navbar />
        </GridItem>
        <GridItem rowSpan={2} colSpan={1} height="100%" overflowY="auto">
          {/* El Sidebar ocupa toda la primera columna */}
          <Sidebar />
        </GridItem>
        <GridItem
          rowSpan={1}
          colSpan={1}
          overflowY="auto"
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
