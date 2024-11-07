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
        className="login-content shadow-md"
      >
        <div className=" w-1/2 rounded-l-3xl flex justify-center items-center bg-blue-100 text-white">
          <Heading className="" textAlign="center">
            <Flex justifyContent={"center"}>
              <Image
                src={"/logo_inventory.svg"}
                width={500}
                height={500}
                alt="Logo de Inventory"
                className="size-28 animate-pulse"
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
              gap: "8px",
              alignItems: "center",
            }}
          >
            <h2 className="text-center max-w-[20ch] text-pretty text-black mb-4 text-xl">
              Liquidate Inventory
            </h2>
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
              onClick={() => handleSubmit()}
              disabled={isFormDisabled}
              pointerEvents={isFormDisabled ? "none" : "auto"}
              className="!bg-blue-600 w-full !text-white  disabled:opacity-60 hover:!bg-blue-600/80 transition-colors duration-200" // Deshabilitar botón si el formulario está cargando
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
