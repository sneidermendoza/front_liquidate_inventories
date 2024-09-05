"use client";
import { useState } from "react";
import { Button, Flex, Heading, Stack, Spinner } from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Input from "@/components/Input";
import FormControlInput from "../components/FormControlInput/index";

const useLogin = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("mariasol0304@gmail.com");
  const [password, setPassword] = useState("Cc1045698090");
  const [emailError, setEmailError] = useState("");

  const [isFormDisabled, setIsFormDisabled] = useState(false);

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
  }; // Est

  const validateEmail = () => {
    const isValid = /\S+@\S+\.\S+/.test(email);
    setEmailError(isValid ? "" : "Correo no válido");
  };

  return {
    handleSubmit,
    isLoading,
    emailError,
    isFormDisabled,
    email,
    setEmail,
    password,
    setPassword,
    validateEmail,
  };
};

const HomePage = () => {
  const {
    handleSubmit,
    isLoading,
    emailError,
    isFormDisabled,
    email,
    setEmail,
    password,
    setPassword,
    validateEmail,
  } = useLogin();

  return (
    <Flex
      height="100vh"
      alignItems="center"
      justifyContent="center"
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
          <Flex>
            <Heading color="blue.800">Liquidate Inventory</Heading>
          </Flex>
        </Heading>
        <FormControlInput
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={validateEmail}
          pointerEvents={isFormDisabled ? "none" : "auto"}
          error={emailError}
        ></FormControlInput>
        <FormControlInput
          placeholder="******"
          type="password"
          mb={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          pointerEvents={isFormDisabled ? "none" : "auto"}
        ></FormControlInput>

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

export default HomePage;
