"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import UserCreate from "@/components/UsersComponents/UserCreate";
import UserEdit from "@/components/UsersComponents/UserEdit";
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
import Pagination from "@/components/PaginateComponents/Paginate";

const User = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [dataResponse, setDataResponse] = useState([]);
  const [responseRole, setResponseRole] = useState([]);
  const [isModalOpenCreate, setIsModalOpenCreate] = useState(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const token = session?.user?.token;

  const dataUser = async (page = 1, showAlert = true) => {
    setIsLoading(true); // Asegúrate de mostrar el spinner mientras se cargan los datos
    const data = await fetchData({
      endpoint: `users/?page=${page}`,
      token: token,
      showAlert: showAlert,
    });

    if (data) {
      setDataResponse(data.data.results);
      setTotalPages(Math.ceil(data.data.count / data.data.results.length));
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
    dataUser(page, false); // Desactiva la alerta al cambiar de página
  };

  const handleEditClick = (user) => {
    setUser(user);
    setIsModalOpenEdit(true);
  };

  const handleDeleteClick = async (userID) => {
    setIsLoading(true);
    await handleDelete({
      endpoint: "users/",
      token: token,
      elementId: userID,
      callback: () => dataUser(currentPage, false),
    });
    setIsLoading(false);
  };

  useEffect(() => {
    if (token) {
      dataUser(currentPage); // Llama a dataUser sólo si el token está disponible
      dataRole();
    }
  }, []); // Asegúrate de que el efecto solo dependa del token y la página actual

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
                {dataResponse && dataResponse.length > 0 ? (
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
        <CardFooter h="20%" justifyContent={"right"} alignItems={"center"}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </CardFooter>
      </Card>
      <UserCreate
        isOpen={isModalOpenCreate}
        onClose={() => setIsModalOpenCreate(false)}
        userReload={() => dataUser(currentPage, true)}
        responseRole={responseRole}
      />
      <UserEdit
        isOpen={isModalOpenEdit}
        onClose={() => setIsModalOpenEdit(false)}
        userReload={() => dataUser(currentPage, true)}
        user={user}
        responseRole={responseRole}
      />
    </Flex>
  );
};

export default User;
