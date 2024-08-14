"use client"
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import InventoryCreate from "@/components/InventoryComponents/InventoryCreate";
import Link from "next/link";


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
  Icon,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { MdReceipt } from 'react-icons/md'
import { fetchData } from "@/utils/fetchData";
import { INVENTORY_STATUS_FINALIZED } from "@/enum/GeneralEnum"
const Inventory = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [dataResponse, setDataResponse] = useState();
  const [responseAttributes, setResponseAttributes] = useState();
  const [responseBusiness, setResponseBusiness] = useState();
  const [isModalOpenCreate, setIsModalOpenCreate] = useState(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [inventory, setInventory] = useState();
  const token = session.user.token;


  const dataInventorys = async () => {
    const data = await fetchData({
      endpoint: "inventory/",
      token: token,
      showAlert: true,
    });
    if (data) {
      setDataResponse(data.data.results);
    }

    setIsLoading(false);
  };

  const dataAttributes = async () => {
    const data = await fetchData({
      endpoint: "attributes/",
      token: token,
      showAlert: false,
    });
    if (data) {
      setResponseAttributes(data.data.results);
    }
  };

  const dataBusiness = async () => {
    const data = await fetchData({
      endpoint: "business/",
      token: token,
      showAlert: false,
    });
    if (data) {
      setResponseBusiness(data.data.results);
    }
  };

  const handleEditClick = (inventory) => {
    setInventory(inventory);
    setIsModalOpenEdit(true);
  };


  useEffect(() => {
    dataInventorys();
    dataAttributes();
    dataBusiness();
    console.log('respuesta', dataResponse[0].inventory_status);

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
          <Heading fontSize={20}>Inventarios</Heading>
          <Button
            colorScheme="blue"
            bg="blue.900"
            fontSize={13}
            h={10}
            w={170}
            onClick={() => setIsModalOpenCreate(true)}
          >
            Crear Inventario
          </Button>
        </CardHeader>
        <CardBody h="90%" overflow="auto" className="scrollable">
          <TableContainer>
            <Table variant="simple" size='sm'>
              <Thead>
                <Tr>
                  <Th fontSize={12}>Id</Th>
                  <Th fontSize={12}>Nombre Del Negocio</Th>
                  <Th fontSize={12}>Estado</Th>
                  <Th fontSize={12}>Costos</Th>
                  <Th fontSize={12}>Opciones</Th>
                </Tr>
              </Thead>
              <Tbody>
                {dataResponse ? (
                  dataResponse.map((inventory, index) => (
                    <Tr key={index}>
                      <Td fontSize={12}>{inventory.id}</Td>
                      <Td fontSize={12}>{inventory.business_name}</Td>
                      <Td fontSize={12}>{inventory.inventory_status_name}</Td>
                      <Td fontSize={12}>{inventory.total_cost}</Td>
                      <Td fontSize={12} display={'flex'} alignItems={'center'}>
                        {inventory.inventory_status === INVENTORY_STATUS_FINALIZED ? (
                          <EditIcon
                            marginLeft={5}
                            color="gray.300" // Estilo visual para deshabilitar
                            cursor="not-allowed" // Cursor de no permitido
                          />
                        ) : (
                          <EditIcon
                            marginLeft={5}
                            cursor="pointer"
                            onClick={() => handleEditClick(inventory)}
                          />
                        )}
                        {inventory.inventory_status === INVENTORY_STATUS_FINALIZED ? (
                          <Icon
                            w={4}
                            h={4}
                            as={MdReceipt}
                            marginLeft={5}
                            color="gray.300" // Estilo visual para deshabilitar
                            cursor="not-allowed" // Cursor de no permitido
                          />
                        ) : (
                          <Link href={`/enter_data_into_inventory/${inventory.id}`}>
                            <Icon
                              w={4}
                              h={4}
                              as={MdReceipt}
                              marginLeft={5}
                              cursor="pointer"
                            />
                          </Link>
                        )}
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
      <InventoryCreate
        isOpen={isModalOpenCreate}
        onClose={() => setIsModalOpenCreate(false)}
        inventaryReload={dataInventorys}
        responseBusiness={responseBusiness}
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
export default Inventory