"use client"
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import RoleCreate from "@/components/RoleComponents/RoleCreate";
import RoleEdit from "@/components/RoleComponents/RoleEdit";
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
const Role = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [dataResponse, setDataResponse] = useState();
  const [isModalOpenCreate, setIsModalOpenCreate] = useState(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [role, setRole] = useState();
  const token = session.user.token;


  const dataRole = async () => {
    const data = await fetchData({
      endpoint: "roles/",
      token: token,
      showAlert: true,
    });
    if (data) {
      setDataResponse(data.data.results);
    }
    setIsLoading(false);
  };


  const handleEditClick = (role) => {
    setRole(role);
    setIsModalOpenEdit(true);
  };

  const handleDeleteClick = async (roleId) => {
    setIsLoading(true);
    await handleDelete({
      endpoint: "roles/",
      token: token,
      elementId: roleId,
      callback: dataRole,
    });
    setIsLoading(false);
  };

  useEffect(() => {
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
      <Card className="flex-1">
        <CardHeader
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Heading fontSize={20}>Roles</Heading>
          <Button
            colorScheme="blue"
            bg="blue.900"
            fontSize={13}
            h={10}
            w={170}
            onClick={() => setIsModalOpenCreate(true)}
          >
            Crear Rol
          </Button>
        </CardHeader>
        <CardBody h="90%" overflow="auto" className="scrollable">
          <TableContainer>
            <Table variant="simple" size='sm'>
              <Thead>
                <Tr>
                  <Th fontSize={12}>Id</Th>
                  <Th fontSize={12}>Nombre</Th>
                  <Th fontSize={12}>Opciones</Th>
                </Tr>
              </Thead>
              <Tbody>
                {dataResponse ? (
                  dataResponse.map((rol, index) => (
                    <Tr key={index}>
                      <Td fontSize={12}>{rol.id}</Td>
                      <Td fontSize={12}>{rol.role}</Td>
                      <Td fontSize={12}>
                        <EditIcon
                          marginLeft={5}
                          onClick={() => handleEditClick(rol)}
                        />
                        <DeleteIcon
                          marginLeft={1}
                          onClick={() => handleDeleteClick(rol.id)}
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
      <RoleCreate
        isOpen={isModalOpenCreate}
        onClose={() => setIsModalOpenCreate(false)}
        roleReload={dataRole}
      />
      <RoleEdit
        isOpen={isModalOpenEdit}
        onClose={() => setIsModalOpenEdit(false)}
        roleReload={dataRole}
        role={role}
      />
    </Flex>
  );
}

export default Role