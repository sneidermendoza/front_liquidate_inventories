"use client"
import { useState } from "react";
import {
  Button,
  Flex,
  Heading,
  Input,
  Stack,
  Spinner,
} from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const Home_page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('mariasol0304@gmail.com');
  const [password, setPassword] = useState("Cc1045698090");
  const [emailError, setEmailError] = useState("");
  const [isFormDisabled, setIsFormDisabled] = useState(false); // Estado para deshabilitar el formulario
  const router = useRouter();


  const handleSubmit = async () => {
    setIsLoading(true);
    setIsFormDisabled(true); // Deshabilitar el formulario mientras se carga

    const responseNextAuth = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsFormDisabled(false); // Habilitar el formulario después de recibir la respuesta

    setIsLoading(false);

    if (responseNextAuth?.error) {
       Swal.fire({
         position: "center",
         icon: "error",
         title: responseNextAuth.error.split(","),
         showConfirmButton: false,
         timer: 3000,
       });
      return;
    }

    router.push("/dashboard");
  };

  const validateEmail = () => {
    const isValid = /\S+@\S+\.\S+/.test(email);
    setEmailError(isValid ? "" : "Correo no válido");
  };

  return (
    <Flex
      height="100vh"
      alignItems="center"
      justifyContent="space-evenly"
      background="gray.100"
      flexDirection={{ base: "column", md: "row" }}
      position="relative"
    >
      {isLoading && (
        <Flex
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="100%"
          bg="rgba(0, 0, 0, 0.5)" // Fondo semi-transparente
          zIndex="9999"
          justifyContent="center"
          alignItems="center"
        >
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </Flex>
      )}
      <Flex>
        <Heading color="blue.800">Liquidate Inventory</Heading>
      </Flex>
      <Stack
        direction="column"
        background="white"
        p={10}
        rounded={25}
        spacing={6}
        minWidth={{ base: "50%", md: "50%" }}
        minHeight="200px"
      >
        <Heading color="blue.800" mb={6} textAlign="center">
          Log in
        </Heading>
        <Input
          placeholder="sms@sms.com"
          variant="filled"
          mb={0}
          type="email"
          background="gray.50"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={validateEmail}
          pointerEvents={isFormDisabled ? "none" : "auto"} // Deshabilitar input si el formulario está cargando
        />
        {emailError && (
          <p style={{ color: "red", fontSize: "13px", textAlign: "center" }}>
            {emailError}
          </p>
        )}
        <Input
          placeholder="******"
          variant="filled"
          mb={6}
          type="password"
          background="gray.50"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          pointerEvents={isFormDisabled ? "none" : "auto"} // Deshabilitar input si el formulario está cargando
        />
        <Button
          colorScheme="blue"
          onClick={() => handleSubmit()}
          pointerEvents={isFormDisabled ? "none" : "auto"} // Deshabilitar botón si el formulario está cargando
        >
          Iniciar Sesión
        </Button>
      </Stack>
    </Flex>
  );
};

export default Home_page;
