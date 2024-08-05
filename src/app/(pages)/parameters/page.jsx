"use client"
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ParameterCreate from "@/components/ParameterComponents/ParameterCreate";
import ParameterEdit from "@/components/ParameterComponents/ParameterEdit";
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
const Parameter = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [dataResponse, setDataResponse] = useState();
  const [isModalOpenCreate, setIsModalOpenCreate] = useState(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [parameter, setparameter] = useState();
  const token = session.user.token;


  const dataParameter = async () => {
    const data = await fetchData({
      endpoint: "parameter/",
      token: token,
      showAlert: true,
    });
    if (data) {
      setDataResponse(data.data.results);
    }
    setIsLoading(false);
  };

  const handleEditClick = (parameter) => {
    setparameter(parameter);
    setIsModalOpenEdit(true);
  };

  const handleDeleteClick = async (parameterID) => {
    setIsLoading(true);
    log
    await handleDelete({
      endpoint: "parameter/",
      token: token,
      elementId: parameterID,
      callback: dataParameter,
    });
    setIsLoading(false);
  };

  useEffect(() => {
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
          <Heading fontSize={20}>Parametros</Heading>
          <Button
            colorScheme="blue"
            bg="blue.900"
            fontSize={13}
            h={10}
            w={170}
            onClick={() => setIsModalOpenCreate(true)}
          >
            Crear Parametro
          </Button>
        </CardHeader>
        <CardBody h="90%" overflow="auto" className="scrollable">
          <TableContainer>
            <Table variant="simple" size='sm'>
              <Thead>
                <Tr>
                  <Th fontSize={12}>Id</Th>
                  <Th fontSize={12}>Nombre</Th>
                  <Th fontSize={12}>Descripcion</Th>
                  <Th fontSize={12}>Opciones</Th>
                </Tr>
              </Thead>
              <Tbody>
                {dataResponse ? (
                  dataResponse.map((parameter, index) => (
                    <Tr key={index}>
                      <Td fontSize={12}>{parameter.id}</Td>
                      <Td fontSize={12}>{parameter.name}</Td>
                      <Td fontSize={12}>{parameter.description}</Td>
                      <Td fontSize={12}>
                        <EditIcon
                          marginLeft={5}
                          onClick={() => handleEditClick(parameter)}
                        />
                        <DeleteIcon
                          marginLeft={1}
                          onClick={() => handleDeleteClick(parameter.id)}
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
      <ParameterCreate
        isOpen={isModalOpenCreate}
        onClose={() => setIsModalOpenCreate(false)}
        parameterReload={dataParameter}
      />
      <ParameterEdit
        isOpen={isModalOpenEdit}
        onClose={() => setIsModalOpenEdit(false)}
        parameterReload={dataParameter}
        parameter={parameter}
      />
    </Flex>
  );
}


export default Parameter