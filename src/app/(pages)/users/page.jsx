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
import Search from "@/components/SearchComponents/search"


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
  const [pagesCalculated, setPagesCalculated] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const dataUser = async (page = 1, showAlert = true, searchTerm = "") => {
    setIsLoading(true); // Asegúrate de mostrar el spinner mientras se cargan los datos
    const data = await fetchData({
      endpoint: `users/?page=${page}&search=${searchTerm}`,
      token: token,
      showAlert: showAlert,
    });

    if (data) {
      setDataResponse(data.data.results);
      if (!pagesCalculated) {
        const calculatedTotalPages = Math.ceil(data.data.count / data.data.results.length);
        setTotalPages(calculatedTotalPages);
        setPagesCalculated(true);
      }
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
      setResponseRole(data.data.results);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    dataUser(page, false,searchTerm); // Desactiva la alerta al cambiar de página
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
      callback: () => dataUser(currentPage, false,searchTerm),
    });
    setIsLoading(false);
  };
  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    dataUser(1, false, searchTerm); // Reiniciar a la primera página y realizar búsqueda
  };

  useEffect(() => {
    if (token) {
      dataUser(currentPage,true,searchTerm); // Llama a dataUser sólo si el token está disponible
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
          <Heading fontSize={30}>Usuarios</Heading>
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
        <CardBody h="90%" overflowX={'auto'} overflowY={'hidden'} className="scrollable">
          <TableContainer>
            <Table variant="simple" size='sm'>
              <Thead>
                <Tr>
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
        <CardFooter h="15%" justifyContent={"space-between"} alignItems={"center"}>
          <Search
          onSearch={handleSearch}
          />
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
