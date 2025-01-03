"use client";
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
import { MdReceipt } from "react-icons/md";
import { RiFileExcel2Line } from "react-icons/ri";
import { fetchData } from "@/utils/fetchData";
import { INVENTORY_STATUS_FINALIZED } from "@/enum/GeneralEnum";
import { apiRequest } from "@/services/fetchService";
import Search from "@/components/SearchComponents/search";
import Pagination from "@/components/PaginateComponents/Paginate";
import { format } from "path";
import { formatValueCurrency } from "@/utils";
const Inventory = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [dataResponse, setDataResponse] = useState();
  const [responseAttributes, setResponseAttributes] = useState();
  const [responseBusiness, setResponseBusiness] = useState();
  const [isModalOpenCreate, setIsModalOpenCreate] = useState(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [inventory, setInventory] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const token = session.user.token;
  const apiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const dataInventorys = async (
    page = 1,
    showAlert = true,
    searchTerm = ""
  ) => {
    const params = new URLSearchParams();
    if (page) params.append("page", page.toString());
    if (searchTerm) params.append("search", searchTerm);
    const url = `inventory?${params.toString()}`;
    const data = await fetchData({
      endpoint: url,
      token,
      showAlert,
    });
    if (data) {
      const { count, results } = data.data;
      setDataResponse(results);
      const calculatedTotalPages = Math.ceil(count / results.length);
      setTotalPages(calculatedTotalPages);
    }

    setIsLoading(false);
  };

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    dataInventorys(1, false, searchTerm); // Reiniciar a la primera página y realizar búsqueda
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    dataInventorys(page, false, searchTerm); // Desactiva la alerta al cambiar de página
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

  const handleExcelClick = async (inventoryId) => {
    try {
      // Hacemos la petición a la API para obtener el archivo Excel
      const response = await fetch(
        `${apiBaseUrl}detail_inventory?inventory_id=${inventoryId}&excel=true`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al descargar el archivo");
      }

      // Convertimos la respuesta en un blob
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Creamos un enlace temporal y lo clickeamos para descargar el archivo
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `inventory_${inventoryId}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Limpiamos el objeto URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar el archivo Excel:", error);
    }
  };

  useEffect(() => {
    dataInventorys();
    dataAttributes();
    dataBusiness();
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
        <CardBody  overflow="auto" className="scrollable">
          <TableContainer>
            <Table variant="simple" size="sm">
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
                      <Td fontSize={12}>{formatValueCurrency(inventory.total_cost)}</Td>
                      <Td fontSize={12} display={"flex"} alignItems={"center"}>
                        <Icon
                          w={4}
                          h={4}
                          as={RiFileExcel2Line}
                          marginLeft={5}
                          cursor="pointer"
                          onClick={() => handleExcelClick(inventory.id)}
                        />
                        {inventory.inventory_status ===
                        INVENTORY_STATUS_FINALIZED ? (
                          <Icon
                            w={4}
                            h={4}
                            as={MdReceipt}
                            marginLeft={5}
                            color="gray.300" // Estilo visual para deshabilitar
                            cursor="not-allowed" // Cursor de no permitido
                          />
                        ) : (
                          <Link
                            href={`/enter_data_into_inventory/${inventory.id}`}
                            target="_blank"
                          >
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
          <Search onSearch={handleSearch} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </CardFooter>
      </Card>
      <InventoryCreate
        isOpen={isModalOpenCreate}
        onClose={() => setIsModalOpenCreate(false)}
        inventaryReload={dataInventorys}
        responseBusiness={responseBusiness}
      />
    </Flex>
  );
};
export default Inventory;
