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
  Select,
  Button,
  Grid,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { apiRequest } from "@/services/fetchService";
import Swal from "sweetalert2";

const MenuCreate = ({ isOpen, onClose, role, option, reloadProducts }) => {
  const [formData, setFormData] = useState({
    option: "",
    role: "",
  });
  const { data: session } = useSession();
  const token = session.user.token;
  const [isLoading, setIsLoading] = useState(false);

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
      option: formData.option,
      role: formData.role,
    };

    try {
      const response = await apiRequest({
        endpoint: "menu/",
        method: "POST",
        jsonBody: data,
        token: token,
      });
      if (response.status != 201) {
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
        reloadProducts();
        onClose();
      }
    } catch (error) {
      console.error("Error submitting product:", error);
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
        <ModalHeader>Crear Nuevo Menu</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            <FormControl gridColumn="span 1">
              <FormLabel>Role</FormLabel>
              <Select
                name="role"
                value={formData.role}
                onChange={handleChange}
                isRequired
              >
                <option value="">Seleccione Un Rol</option>
                {Array.isArray(role) &&
                  role.map((unit, index) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.role}
                    </option>
                  ))}
              </Select>
            </FormControl>
            <FormControl gridColumn="span 1">
              <FormLabel>Option</FormLabel>
              <Select
                name="option"
                value={formData.option}
                onChange={handleChange}
                isRequired
              >
                <option value="">Seleccione Una Opcion</option>
                {Array.isArray(option) &&
                  option.map((unit, index) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.name}
                    </option>
                  ))}
              </Select>
            </FormControl>
          </Grid>
        </ModalBody>
        <ModalFooter>
          <Flex justify="space-between" w="100%">
            <Button colorScheme="blue" onClick={handleSubmit}>
              Crear
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

export default MenuCreate;
