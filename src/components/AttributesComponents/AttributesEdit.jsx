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
  Select,
  Button,
  Grid,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { apiRequest } from "@/services/fetchService";
import Swal from "sweetalert2";

const AttributesEdit = ({
  isOpen,
  onClose,
  attribute,
  attributeReload,
  responseParameter,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    parameter: "",
  });
  const { data: session } = useSession();
  const token = session.user.token;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (attribute) {
      setFormData({
        name: attribute.name,
        parameter: attribute.parameter_id,
      });
    }
  }, [attribute]);


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
      parameter: parseInt(formData.parameter, 10),
    };

    try {
      const response = await apiRequest({
        endpoint: `attributes/${attribute.id}/`,
        method: "PUT",
        jsonBody: data,
        token: token,
      });

      if (response.status !== 200) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: response.error,
          showConfirmButton: false,
          timer: 3000,
        });
        setIsLoading(false);
      } else {
        Swal.fire({
          position: "center",
          icon: "success",
          title: response.message,
          showConfirmButton: false,
          timer: 1500,
        });
        setIsLoading(false);
        attributeReload();
        onClose();
        setFormData("","")
      }
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: error,
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
        <ModalHeader>Editar Atributo</ModalHeader>
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
                maxLength={150}
                minLength={1}
                isRequired
              />
            </FormControl>
            <FormControl gridColumn="span 1">
              <FormLabel>Parametro</FormLabel>
              <Select
                name="parameter"
                value={formData.parameter}
                onChange={handleChange}
                isRequired
              >
                <option value="">Seleccione Un Parametro</option>
                {Array.isArray(responseParameter) &&
                  responseParameter.map((parameter) => (
                    <option key={parameter.id} value={parameter.id}>
                      {parameter.name}
                    </option>
                  ))}
              </Select>
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

export default AttributesEdit;
