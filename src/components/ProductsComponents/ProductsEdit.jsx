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

import { z } from "zod";

const productSchema = z.object({
  code: z.number().nullable(),
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional().nullable(),
  price: z.number().min(1, "El precio es requerido"),
  measure_units: z.number().min(1, "La unidad de medida es requerida"),
});

const ProductsEdit = ({
  isOpen,
  onClose,
  product,
  measureUnits,
  reloadProducts,
}) => {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    price: "",
    measureUnit: "",
  });
  const { data: session } = useSession();
  const token = session.user.token;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        code: product.code,
        name: product.name,
        description: product.description,
        price: product.price,
        measureUnit: product.measure_units,
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    const data = {
      code: formData.code ? parseInt(formData.code, 10) : null,
      name: formData.name,
      description: formData.description || null,
      price: formData.price ? Number(formData.price) : 0,
      measure_units: formData.measureUnit
        ? parseInt(formData.measureUnit, 10)
        : 0,
    };
    const validation = productSchema.safeParse(data);
    if (!validation.success) {
      console.log("Issues", { issues: validation.error.issues[0] });
      return Swal.fire({
        title: "Error",
        text: validation.error.issues[0].message,
        icon: "error",
        confirmButtonText: "Aceptar",
        zIndex: 999999999,
      });
    }
    try {
      setIsLoading(true);
      const response = await apiRequest({
        endpoint: `product/${product.id}/`,
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
        reloadProducts();
        onClose();
      }
    } catch (error) {
      console.error("Error updating product:", error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: error,
        showConfirmButton: false,
        timer: 3000,
      });
      setIsLoading(false);
    } finally {
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
              <FormLabel>Código</FormLabel>
              <Input
                type="number"
                name="code"
                value={formData.code}
                onChange={handleChange}
              />
            </FormControl>
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
              <FormLabel>Precio</FormLabel>
              <Input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                isRequired
              />
            </FormControl>
            <FormControl gridColumn="span 1">
              <FormLabel>Unidad de Medida</FormLabel>
              <Select
                name="measureUnit"
                value={formData.measureUnit}
                onChange={handleChange}
                isRequired
              >
                <option value="">Seleccione una unidad</option>
                {Array.isArray(measureUnits) &&
                  measureUnits.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.name}
                    </option>
                  ))}
              </Select>
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

export default ProductsEdit;
