"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import ProductsCreate from '@/components/ProductsComponents/ProductsCreate';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  Td,
  Spacer,
  Box,
  Button,
} from "@chakra-ui/react";

const Products = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [dataResponse, setDataResponse] = useState();
  const [MeasureUnits, setMeasureUnits] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = session.user.token;
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const dataProduct = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(apiUrl + "product/", {
        method: "GET",
        headers: headers,
      });
      const data = await response.json();
      if (data.status != 200) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: data.detail,
          showConfirmButton: false,
          timer: 3000,
        });
        setIsLoading(false);
      } else {
        setDataResponse(data.data);
        setIsLoading(false);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Productos obtenidos con exito",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      setIsLoading(false);
      Swal.fire({
        position: "center",
        icon: "error",
        title: data.detail,
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  const dataMeasureUnits = async () => {
    try {
      const response = await fetch(apiUrl + "measure_units/", {
        method: "GET",
        headers: headers,
      });
      const data = await response.json();
      if (data.status != 200) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: data.detail,
          showConfirmButton: false,
          timer: 3000,
        });
      } else {
        setMeasureUnits(data.data);
      }
    } catch (error) {
      setIsLoading(false);
      Swal.fire({
        position: "center",
        icon: "error",
        title: data.detail,
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  useEffect(() => {
    dataProduct();
    dataMeasureUnits();
  }, []);


  return (
    <Flex direction="column" h="100%">
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
      <Card h="90vh">
        <CardHeader
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Heading fontSize={20}>Productos</Heading>
          <Button
            colorScheme="blue"
            bg="blue.900"
            fontSize={13}
            h={10}
            w={170}
            onClick={() => setIsModalOpen(true)}
          >
            Crear Nuevos productos
          </Button>
        </CardHeader>
        <CardBody h="90%" overflow="auto" className="scrollable">
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th fontSize={12}>Codigo</Th>
                  <Th fontSize={12}>Nombre</Th>
                  <Th fontSize={12}>Descripcion</Th>
                  <Th fontSize={12}>Unidad De Medida</Th>
                  <Th fontSize={12}>Precio</Th>
                </Tr>
              </Thead>
              <Tbody>
                {dataResponse ? (
                  dataResponse.map((product, index) => (
                    <Tr key={index}>
                      <Td fontSize={12}>{product.code}</Td>
                      <Td fontSize={12}>{product.name}</Td>
                      <Td fontSize={12}>{product.description}</Td>
                      <Td fontSize={12}>{product.measure_units_name}</Td>
                      <Td fontSize={12}>{product.price}</Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={5} textAlign="center">
                      No hay datos disponibles
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </CardBody>
        <CardFooter h="10%" justifyContent={"center"} alignItems={"center"}>
          <Text fontSize={10}> By: SMS Correo: Mariasol0304@gmail.com</Text>
        </CardFooter>
      </Card>
      <ProductsCreate
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        measureUnits={MeasureUnits}
      />
    </Flex>
  );
};

export default Products;
