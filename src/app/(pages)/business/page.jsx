"use client"
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import BusinessCreate from "@/components/BusinessComponents/BusinessCreate";
import BusinessEdit from "@/components/BusinessComponents/BusinessEdit";
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
const Business = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [dataResponse, setDataResponse] = useState();
  const [responseUserCustomer, setResponseUserCustomer] = useState();
  const [isModalOpenCreate, setIsModalOpenCreate] = useState(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [business, setBusiness] = useState();
  const token = session.user.token;


  const dataBusiness = async () => {
    const data = await fetchData({
      endpoint: "business/",
      token: token,
      showAlert: true,
    });
    if (data) {
      setDataResponse(data);
    }
    setIsLoading(false);
  };
  const dataUserCustomer = async () => {
    const data = await fetchData({
      endpoint: "users/get_user_business/",
      token: token,
      showAlert: false,
    });
    if (data) {
      setResponseUserCustomer(data);
    }
  };


  const handleEditClick = (business) => {
    setBusiness(business);
    setIsModalOpenEdit(true);
  };

  const handleDeleteClick = async (businessId) => {
    setIsLoading(true);
    await handleDelete({
      endpoint: "business/",
      token: token,
      elementId: businessId,
      callback: dataBusiness,
    });
    setIsLoading(false);
  };

  useEffect(() => {
      dataBusiness();
      dataUserCustomer();
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
          <Heading fontSize={20}>Negocios</Heading>
          <Button
            colorScheme="blue"
            bg="blue.900"
            fontSize={13}
            h={10}
            w={170}
            onClick={() => setIsModalOpenCreate(true)}
          >
            Crear Negocio
          </Button>
        </CardHeader>
        <CardBody h="90%" overflow="auto" className="scrollable">
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th fontSize={12}>Id</Th>
                  <Th fontSize={12}>Cliente</Th>
                  <Th fontSize={12}>Nombre  Del Negocio</Th>
                  <Th fontSize={12}>Opciones</Th>
                </Tr>
              </Thead>
              <Tbody>
                {dataResponse ? (
                  dataResponse.map((business, index) => (
                    <Tr key={index}>
                      <Td fontSize={12}>{business.id}</Td>
                      <Td fontSize={12}>{business.user_name}</Td>
                      <Td fontSize={12}>{business.name_business}</Td>
                      <Td fontSize={12}>
                        <EditIcon
                          marginLeft={5}
                          onClick={() => handleEditClick(business)}
                        />
                        <DeleteIcon
                          marginLeft={1}
                          onClick={() => handleDeleteClick(business.id)}
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
      <BusinessCreate
        isOpen={isModalOpenCreate}
        onClose={() => setIsModalOpenCreate(false)}
        businesReload={dataBusiness}
        responseUserCustomer={responseUserCustomer}

      />
      <BusinessEdit
        isOpen={isModalOpenEdit}
        onClose={() => setIsModalOpenEdit(false)}
        businesReload={dataBusiness}
        business={business}
        responseUserCustomer={responseUserCustomer}
      />
    </Flex>
  );
}

export default Business