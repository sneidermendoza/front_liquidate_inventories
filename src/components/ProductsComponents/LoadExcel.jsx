"use client";
import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  Flex,
  Spinner,
  Text,
  IconButton,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { apiRequest } from "@/services/fetchService";
import Swal from "sweetalert2";
import { CloseIcon } from "@chakra-ui/icons";

const LoadExcel = ({ isOpen, onClose, reloadProducts }) => {
  const { data: session } = useSession();
  const token = session.user.token;
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleRemoveFile = () => {
    setFile(null);
    // Para resetear el input de tipo file
    document.getElementById("file-upload").value = null;
  };

  const handleCancel = () => {
    // Limpia el archivo y cierra el modal
    setFile(null);
    document.getElementById("file-upload").value = null;
    onClose();
  };

  const handleSubmit = async () => {
    if (!file) {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "Por favor, seleccione un archivo antes de enviar.",
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("excel_file", file);

    try {
      const response = await apiRequest({
        endpoint: "product/bulk_create_products_excel/",
        method: "POST",
        formData: formData,
        token: token,
      });
      console.log('este es el form data',[...formData.entries()]);
      

      if (response.status !== 200) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: response.error,
          showConfirmButton: false,
          timer: 3000,
        });
        onClose();
      } else {
        Swal.fire({
          position: "center",
          icon: "success",
          title: response.message,
          showConfirmButton: false,
          timer: 1500,
        });
        reloadProducts();
        onClose();
      }
    } catch (error) {
      console.error("Error submitting product:", error);
      onClose();
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Error al subir el archivo.",
        showConfirmButton: false,
        timer: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} size="xl">
      {isLoading && (
        <Flex
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="100%"
          bg="rgba(0, 0, 0, 0.5)"
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
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Cargar Excel Con Los Productos</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Seleccione un archivo Excel</FormLabel>
            <Flex align="center">
              <Input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
                display="none"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button
                  as="span"
                  colorScheme="green"
                  bg="#1D6F42" // Verde similar al de Excel
                  borderRadius="full"
                  px={6}
                  py={4}
                  _hover={{ bg: "#14532D" }} // Oscurece un poco el verde al hacer hover
                >
                  {file ? "Cambiar archivo" : "Seleccionar archivo"}
                </Button>
              </label>
              {file && (
                <Flex align="center" ml={3}>
                  <Text color="green.600" fontWeight="bold">
                    {file.name}
                  </Text>
                  <IconButton
                    aria-label="Eliminar archivo"
                    icon={<CloseIcon />}
                    size="sm"
                    ml={2}
                    onClick={handleRemoveFile}
                    colorScheme="red"
                    variant="outline"
                  />
                </Flex>
              )}
              {!file && (
                <Text ml={3}>
                  Sin archivos seleccionados
                </Text>
              )}
            </Flex>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Flex justify="space-between" w="100%">
            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              isLoading={isLoading}
              isDisabled={!file} // Deshabilita el botón si no hay archivo
            >
              Cargar
            </Button>
            <Button colorScheme="red" onClick={handleCancel}>
              Cancelar
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LoadExcel;
