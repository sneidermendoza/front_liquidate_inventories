"use client"
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import AttributesCreate from "@/components/AttributesComponents/AttributesCreate";
import AttributesEdit from "@/components/AttributesComponents/AttributesEdit";
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
  Button,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { fetchData } from "@/utils/fetchData";
import { handleDelete } from "@/utils/handleDelete";
const Attributes = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [dataResponse, setDataResponse] = useState();
  const [responseParameter, setResponseParameters] = useState();
  const [isModalOpenCreate, setIsModalOpenCreate] = useState(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [attribute, setAttribute] = useState();
  const token = session.user.token;


  const dataAttributes = async () => {
    const data = await fetchData({
      endpoint: "attributes/",
      token: token,
      showAlert: true,
    });
    if (data) {
      setDataResponse(data.data.results);
    }
    setIsLoading(false);
  };
  const dataParameter = async () => {
    const data = await fetchData({
      endpoint: "parameter/",
      token: token,
      showAlert: false,
    });
    if (data) {
      setResponseParameters(data.data.results);
    }
  };


  const handleEditClick = (attribute) => {
    setAttribute(attribute);
    setIsModalOpenEdit(true);
  };

  const handleDeleteClick = async (attributeId) => {
    setIsLoading(true);
    await handleDelete({
      endpoint: "attributes/",
      token: token,
      elementId: attributeId,
      callback: dataAttributes,
    });
    setIsLoading(false);
  };

  useEffect(() => {
      dataAttributes();
      dataParameter();
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
          <Heading fontSize={20}>Atributos</Heading>
          <Button
            colorScheme="blue"
            bg="blue.900"
            fontSize={13}
            h={10}
            w={170}
            onClick={() => setIsModalOpenCreate(true)}
          >
            Crear Atributo
          </Button>
        </CardHeader>
        <CardBody h="90%" overflow="auto" className="scrollable">
          <TableContainer>
            <Table variant="simple" size='sm'>
              <Thead>
                <Tr>
                  <Th fontSize={12}>Id</Th>
                  <Th fontSize={12}>Nombre</Th>
                  <Th fontSize={12}>parametro</Th>
                  <Th fontSize={12}>Opciones</Th>
                </Tr>
              </Thead>
              <Tbody>
                {dataResponse ? (
                  dataResponse.map((attribute, index) => (
                    <Tr key={index}>
                      <Td fontSize={12}>{attribute.id}</Td>
                      <Td fontSize={12}>{attribute.name}</Td>
                      <Td fontSize={12}>{attribute.parameter_name}</Td>
                      <Td fontSize={12}>
                        <EditIcon
                          marginLeft={5}
                          onClick={() => handleEditClick(attribute)}
                        />
                        <DeleteIcon
                          marginLeft={1}
                          onClick={() => handleDeleteClick(attribute.id)}
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
      <AttributesCreate
        isOpen={isModalOpenCreate}
        onClose={() => setIsModalOpenCreate(false)}
        attributeReload={dataAttributes}
        responseParameter={responseParameter}

      />
      <AttributesEdit
        isOpen={isModalOpenEdit}
        onClose={() => setIsModalOpenEdit(false)}
        attributeReload={dataAttributes}
        attribute={attribute}
        responseParameter={responseParameter}
      />
    </Flex>
  );
}

export default Attributes