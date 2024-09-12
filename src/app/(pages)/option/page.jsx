"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import OptionCreate from "@/components/OptionComponents/OptionCreate";
import OptionEdit from "@/components/OptionComponents/OptionEdit";
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

const Option = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [dataResponse, setDataResponse] = useState();
  const [isModalOpenCreate, setIsModalOpenCreate] = useState(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [optionSeletct, setOptionSeletct] = useState();
  const token = session.user.token;

  const dataOption = async () => {
    setIsLoading(true);
    const data = await fetchData({
      endpoint: "options/",
      token: token,
      showAlert: true,
    });
    if (data) {
      setDataResponse(data.data.results);
    }
    setIsLoading(false);
  };

  const handleEditClick = (option) => {
    setOptionSeletct(option);
    setIsModalOpenEdit(true);
  };

  const handleDeleteClick = async (optionid) => {
    setIsLoading(true);
    await handleDelete({
      endpoint: "options/",
      token: token,
      elementId: optionid,
      callback: dataOption,
    });
    setIsLoading(false);
  };

  useEffect(() => {
    dataOption();
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
          <Heading fontSize={20}>Opciones De Menu</Heading>
          <Button
            colorScheme="blue"
            bg="blue.900"
            fontSize={13}
            h={10}
            w={170}
            onClick={() => setIsModalOpenCreate(true)}
          >
            Crear Nuevas Opciones
          </Button>
        </CardHeader>
        <CardBody h="90%" overflow="auto" className="scrollable">
          <TableContainer>
            <Table variant="simple" size='sm'>
              <Thead>
                <Tr>
                  <Th fontSize={12}>Nombre</Th>
                  <Th fontSize={12}>Descripcion</Th>
                  <Th fontSize={12}>Link</Th>
                  <Th fontSize={12}>Icon</Th>
                  <Th fontSize={12}>Opciones</Th>
                </Tr>
              </Thead>
              <Tbody>
                {dataResponse ? (
                  dataResponse.map((option, index) => (
                    <Tr key={index}>
                      <Td fontSize={12}>{option.name}</Td>
                      <Td fontSize={12}>{option.description}</Td>
                      <Td fontSize={12}>{option.link}</Td>
                      <Td fontSize={12}>{option.icon}</Td>
                      <Td fontSize={12}>
                        <EditIcon
                          marginLeft={5}
                          onClick={() => handleEditClick(option)}
                        />
                        <DeleteIcon
                          marginLeft={1}
                          onClick={() => handleDeleteClick(option.id)}
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
      <OptionCreate
        isOpen={isModalOpenCreate}
        onClose={() => setIsModalOpenCreate(false)}
        reloadProducts={dataOption}
      />
      <OptionEdit
        isOpen={isModalOpenEdit}
        onClose={() => setIsModalOpenEdit(false)}
        reloadProducts={dataOption}
        option={optionSeletct}
      />
    </Flex>
  );
};

export default Option;
