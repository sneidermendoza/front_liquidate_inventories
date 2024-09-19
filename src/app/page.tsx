"use client";
import { useState } from "react";
import { Button, Flex, Heading, Stack, Spinner } from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Input from "@/components/Input";
import FormControlInput from "../components/FormControlInput/index";
import Image from "next/image";
import { globalConfig } from "@/constants";

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
      <div
        style={{
          position: "absolute",
          zIndex: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <Image
          src={"/products.webp"}
          width={400}
          height={400}
          style={{
            width: "100%",
            height: "100%",
          }}
          alt="Image background"
          unoptimized
        ></Image>
        
      </div>
      <div 
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          zIndex: 1,
          background: "linear-gradient(180deg, rgba(0,74,173,0.5) 90%, rgba(255,255,255,0) 100%)"
        }}
      >

      </div>

      <Stack
        direction="row"
        background="white"
        style={{
          borderRadius: "25px",
        }}
        width={"100%"}
        maxWidth={"800px"}
        height="500px"
        zIndex={2}
        className="login-content"
      >
        <div
         
          className="first-div"
        >
          <Heading color="blue.800"  textAlign="center">
            <Flex justifyContent={"center"}>
              <Image
                src={"/logo.webp"}
                width={500}
                height={500}
                
                alt="Logo de Inventory"
                className="logo"
                unoptimized
              ></Image>
            </Flex>
          </Heading>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "70%",
              display: "flex",
              flexDirection: "column",
              gap: "8px"
            }}
          >
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
              color={"white"}
              backgroundColor={"blue.800"}
              onClick={() => handleSubmit()}
              pointerEvents={isFormDisabled ? "none" : "auto"}
              className="button-init" // Deshabilitar botón si el formulario está cargando
            >
              Iniciar Sesión
            </Button>
          </div>
        </div>
      </Stack>
    </Flex>
  );
};

export default HomePage;
