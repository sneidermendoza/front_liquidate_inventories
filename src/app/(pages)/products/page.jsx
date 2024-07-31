"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ProductsCreate from "@/components/ProductsComponents/ProductsCreate";
import ProductsEdit from "@/components/ProductsComponents/ProductsEdit";
import { Card, CardBody, CardFooter, CardHeader, Flex, Heading, Spinner, Table, TableContainer, Tbody, Text, Th, Thead, Tr, Td, Button } from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { fetchData } from "@/utils/fetchData";
import { handleDelete } from "@/utils/handleDelete";

const Products = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [dataResponse, setDataResponse] = useState();
  const [MeasureUnits, setMeasureUnits] = useState();
  const [isModalOpenCreate, setIsModalOpenCreate] = useState(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [product, setProduct] = useState();
  const token = session.user.token;

  const dataProduct = async () => {
    setIsLoading(true);
    const data = await fetchData({
      endpoint: "product/",
      token: token,
      showAlert: true,
    });
    if (data) {
      setDataResponse(data);
    }
    setIsLoading(false);
  };

  const dataMeasureUnits = async () => {
    const data = await fetchData({
      endpoint: "measure_units/",
      token: token,
      showAlert: false,
    });
    if (data) {
      setMeasureUnits(data);
    }
  };

  const handleEditClick = (product) => {
    setProduct(product);
    setIsModalOpenEdit(true);
  };

  const handleDeleteClick = async (productId) => {
    setIsLoading(true);
    await handleDelete({
      endpoint: "product/",
      token: token,
      elementId: productId,
      callback: dataProduct,
    });
    setIsLoading(false);
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
            onClick={() => setIsModalOpenCreate(true)}
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
                  <Th fontSize={12}>Opciones</Th>
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
                      <Td fontSize={12}>
                        <EditIcon
                          marginLeft={5}
                          onClick={() => handleEditClick(product)}
                        />
                        <DeleteIcon
                          marginLeft={1}
                          onClick={() => handleDeleteClick(product.id)}
                        />
                      </Td>
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
        isOpen={isModalOpenCreate}
        onClose={() => setIsModalOpenCreate(false)}
        measureUnits={MeasureUnits}
        reloadProducts={dataProduct}
      />
      <ProductsEdit
        isOpen={isModalOpenEdit}
        onClose={() => setIsModalOpenEdit(false)}
        measureUnits={MeasureUnits}
        reloadProducts={dataProduct}
        product={product}
      />
    </Flex>
  );
};

export default Products;
