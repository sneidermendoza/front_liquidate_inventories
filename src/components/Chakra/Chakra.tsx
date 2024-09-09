"use client"
import React from "react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    useSystemColorMode: false,
    initialColorMode: "light",
  },
  colors: {
    blue: {
      800: "#004aad"
    }
  },
  // Aquí puedes configurar un prefijo de clase personalizado
  // Esto agregará un prefijo a todas las clases CSS generadas por Chakra UI
  // Ayuda a evitar conflictos de nombres de clases con otras bibliotecas de estilos
  cssVarPrefix: "my-app",
});

const Chakra = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
  <ChakraProvider theme={theme}> 
    {children} 
    </ChakraProvider>
  )
}

export default Chakra;