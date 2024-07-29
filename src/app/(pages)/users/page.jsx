"use client"
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import UserCreate from "@/components/UsersComponents/UserCreate";
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

const User = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [dataResponse, setDataResponse] = useState();
  const [responseRole, setResponseRole] = useState();
  const [isModalOpenCreate, setIsModalOpenCreate] = useState(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [user, setUser] = useState();
  const token = session.user.token;


  const dataUser = async () => {
    const data = await fetchData({
      endpoint: "users/",
      token: token,
      showAlert: true,
    });
    if (data) {
      setDataResponse(data);
    }
    setIsLoading(false);
  };
  const dataRole = async () => {
    const data = await fetchData({
      endpoint: "roles/",
      token: token,
      showAlert: false,
    });
    if (data) {
      setResponseRole(data);
    }
  };


  const handleEditClick = (attribute) => {
    setUser(attribute);
    setIsModalOpenEdit(true);
  };

  const handleDeleteClick = async (userID) => {
    setIsLoading(true);
    await handleDelete({
      endpoint: "users/",
      token: token,
      elementId: userID,
      callback: dataUser,
    });
    setIsLoading(false);
  };

  useEffect(() => {
    dataUser();
    dataRole();
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
            Crear Usuario
          </Button>
        </CardHeader>
        <CardBody h="90%" overflow="auto" className="scrollable">
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th fontSize={12}>Id</Th>
                  <Th fontSize={12}>Nombre</Th>
                  <Th fontSize={12}>Correo</Th>
                  <Th fontSize={12}>Rol</Th>
                  <Th fontSize={12}>Opciones</Th>
                </Tr>
              </Thead>
              <Tbody>
                {dataResponse ? (
                  dataResponse.map((user, index) => (
                    <Tr key={index}>
                      <Td fontSize={12}>{user.id}</Td>
                      <Td fontSize={12}>{`${user.name} ${user.last_name}`}</Td>
                      <Td fontSize={12}>{user.email}</Td>
                      <Td fontSize={12}>{user.role_name}</Td>
                      <Td fontSize={12}>
                        <EditIcon
                          marginLeft={5}
                          onClick={() => handleEditClick(user)}
                        />
                        <DeleteIcon
                          marginLeft={1}
                          onClick={() => handleDeleteClick(user.id)}
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
      <UserCreate
        isOpen={isModalOpenCreate}
        onClose={() => setIsModalOpenCreate(false)}
        userReload={dataUser}
        responseRole={responseRole}

      />
      {/* <AttributesEdit
        isOpen={isModalOpenEdit}
        onClose={() => setIsModalOpenEdit(false)}
        attributeReload={dataAttributes}
        attribute={attribute}
        responseParameter={responseParameter}
      /> */}
    </Flex>
  );
}

export default User