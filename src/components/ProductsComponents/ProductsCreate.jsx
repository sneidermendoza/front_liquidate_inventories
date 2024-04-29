"use client"
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
  Textarea,
  Select,
  Button,
  Grid,
  Flex,
} from "@chakra-ui/react";

const ProductsCreate = ({ isOpen, onClose, measureUnits }) => {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    price: "",
    measureUnit: "",
  });

  const url = "https://api-liquidate-inventories.onrender.com/api/product/"
  const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE0NDk2OTU4LCJpYXQiOjE3MTQ0MTA1NTgsImp0aSI6IjM3ZWNkZjIxZjc4ZTQ3NjhhZjgzNzZhOTY1ZjY1ZWE5IiwidXNlcl9pZCI6MX0.59j0nRfHtyNNrW182Ar10QHnXYxk07jGxF4F4dLjAP4"
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(e.target.value)
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    const opciones = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' ,
        'Authorization' : token
      },
      body: JSON.stringify(formData) 
    };
    

    fetch(url, opciones)
      .then(response => {
        
        if (response.ok) {
          return response.json(); 
        }
        throw new Error('Error en la solicitud');
      })
      .then(data => {
        console.log('Respuesta:', formData);
      })
      .catch(error => {
        console.error('Error:', formData); 
      });
  };

  const prueba = () => { 
    console.log(formData)
  }

 

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Agregar Nuevo Producto</ModalHeader>
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
              />
            </FormControl>
            <FormControl gridColumn="span 2">
              <FormLabel>Descripción</FormLabel>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl gridColumn="span 1">
              <FormLabel>Precio</FormLabel>
              <Input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl gridColumn="span 1">
              <FormLabel>Unidad de Medida</FormLabel>
              <Select
                name="measureUnit"
                value={formData.measureUnit}
                onChange={handleChange}
              >
                {Array.isArray(measureUnits) &&
                  measureUnits.map((unit, index) => (
                    <option key={index} value={unit.id}>
                      {unit.name}
                    </option>
                  ))}
              </Select>
            </FormControl>
          </Grid>
        </ModalBody>
        <ModalFooter>
          <Button onClick={prueba}>hola</Button>
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

export default ProductsCreate;

