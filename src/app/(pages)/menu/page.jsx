"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import MenuCreate from "@/components/MenuComponents/MenuCreate";
import MenuEdit from "@/components/MenuComponents/MenuEdit";
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

const Menu = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [dataResponse, setDataResponse] = useState();
  const [role, setRole] = useState();
  const [option, setOption] = useState();
  const [isModalOpenCreate, setIsModalOpenCreate] = useState(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [menu, setMenu] = useState();
  const token = session.user.token;

  const dataMenu = async () => {
    setIsLoading(true);
    const data = await fetchData({
      endpoint: "menu/",
      token: token,
      showAlert: true,
    });
    if (data) {
      setDataResponse(data.data.results);
    }
    setIsLoading(false);
  };

  const dataRole = async () => {
    const data = await fetchData({
      endpoint: "roles/",
      token: token,
      showAlert: false,
    });
    console.log("este es el role", data);
    if (data) {
      setRole(data);
    }
  };
  const dataOption = async () => {
    const data = await fetchData({
      endpoint: "options/",
      token: token,
      showAlert: false,
    });
    if (data) {
      setOption(data);
    }
  };

  const handleEditClick = (menu) => {
    setMenu(menu);
    setIsModalOpenEdit(true);
  };

  const handleDeleteClick = async (menuId) => {
    setIsLoading(true);
    await handleDelete({
      endpoint: "menu/",
      token: token,
      elementId: menuId,
      callback: dataMenu,
    });
    setIsLoading(false);
  };

  useEffect(() => {
    dataMenu();
    dataRole();
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
          <Heading fontSize={20}>Menus</Heading>
          <Button
            colorScheme="blue"
            bg="blue.900"
            fontSize={13}
            h={10}
            w={170}
            onClick={() => setIsModalOpenCreate(true)}
          >
            Crear Nuevo Menu
          </Button>
        </CardHeader>
        <CardBody h="90%" overflow="auto" className="scrollable">
          <TableContainer>
            <Table variant="simple" size='sm'>
              <Thead>
                <Tr>
                  <Th fontSize={12}>Rol</Th>
                  <Th fontSize={12}>Opcion De Menu</Th>
                  <Th fontSize={12}>Opciones</Th>
                </Tr>
              </Thead>
              <Tbody>
                {dataResponse ? (
                  dataResponse.map((menu, index) => (
                    <Tr key={index}>
                      <Td fontSize={12}>{menu.role_name}</Td>
                      <Td fontSize={12}>{menu.option_name}</Td>
                      <Td fontSize={12}>
                        <EditIcon
                          marginLeft={5}
                          onClick={() => handleEditClick(menu)}
                        />
                        <DeleteIcon
                          marginLeft={1}
                          onClick={() => handleDeleteClick(menu.id)}
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
      <MenuCreate
        isOpen={isModalOpenCreate}
        onClose={() => setIsModalOpenCreate(false)}
        role={role}
        option={option}
        reloadProducts={dataMenu}
      />
      <MenuEdit
        isOpen={isModalOpenEdit}
        onClose={() => setIsModalOpenEdit(false)}
        role={role}
        option={option}
        reloadProducts={dataMenu}
        menu={menu}
      />
    </Flex>
  );
};

export default Menu;
