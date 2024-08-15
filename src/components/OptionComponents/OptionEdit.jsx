"use client";
import React, { useEffect, useState } from "react";
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
  Textarea,
  Select,
  Button,
  Grid,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { apiRequest } from "@/services/fetchService";
import Swal from "sweetalert2";

const OptionEdit = ({
  isOpen,
  onClose,
  option,
  reloadProducts,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    link: "",
    icon: "",
  });
  const { data: session } = useSession();
  const token = session.user.token;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (option) {
      setFormData({
        name: option.name,
        description: option.description,
        link: option.link,
        icon: option.icon,
      });
    }
  }, [option]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    const data = {
      name: formData.name,
      description: formData.description || null,
      link: formData.link,
      icon: formData.icon || null,
    };

    try {
      const response = await apiRequest({
        endpoint: `options/${option.id}/`,
        method: "PUT",
        jsonBody: data,
        token: token,
      });

      if (response.status !== 200) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: response.detail || "Error al actualizar el producto",
          showConfirmButton: false,
          timer: 3000,
        });
        setIsLoading(false);
      } else {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Producto actualizado con éxito",
          showConfirmButton: false,
          timer: 1500,
        });
        setIsLoading(false);
        reloadProducts();
        onClose();
      }
    } catch (error) {
      console.error("Error updating product:", error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Error al actualizar el producto",
        showConfirmButton: false,
        timer: 3000,
      });
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
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
        <ModalHeader>Editar Producto</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            <FormControl gridColumn="span 1">
              <FormLabel>Nombre</FormLabel>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl gridColumn="span 1">
              <FormLabel>Link</FormLabel>
              <Input
                type="text"
                name="link"
                value={formData.link}
                onChange={handleChange}
                maxLength={30}
                minLength={1}
                isRequired
              />
            </FormControl>
            <FormControl gridColumn="span 1">
              <FormLabel>Icon</FormLabel>
              <Input
                type="text"
                name="icon"
                maxLength={30}
                minLength={1}
                value={formData.icon}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl gridColumn="span 2">
              <FormLabel>Descripción</FormLabel>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                maxLength={250}
                minLength={1}
              />
            </FormControl>
          </Grid>
        </ModalBody>
        <ModalFooter>
          <Flex justify="space-between" w="100%">
            <Button colorScheme="blue" onClick={handleSubmit}>
              Guardar
            </Button>
            <Button colorScheme="red" onClick={onClose}>
              Cancelar
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default OptionEdit;
