"use client"
import React, { useEffect, useState } from "react";
import { usePathname,useRouter  } from 'next/navigation';
import { useSession } from "next-auth/react";
import { Card, CardBody, CardFooter, CardHeader, Flex, Heading, Spinner, Table, TableContainer, Tbody, Text, Th, Thead, Tr, Td, Button, Input } from "@chakra-ui/react";
import { fetchData } from "@/utils/fetchData";
import Pagination from "@/components/PaginateComponents/Paginate";
import Search from "@/components/SearchComponents/search"
import Swal from "sweetalert2";
import { apiRequest } from "@/services/fetchService";



const EnterDataIntoInventory = () => {
    const pathname = usePathname();
    const id = pathname.split('/').pop(); // Extraer el id de la ruta
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [dataResponse, setDataResponse] = useState();
    const token = session.user.token;
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagesCalculated, setPagesCalculated] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [productQuantities, setProductQuantities] = useState({});
    const router = useRouter();

    const dataProduct = async (page = 1, showAlert = true, searchTerm = "") => {
        setIsLoading(true);
        const data = await fetchData({
            endpoint: `product/?page=${page}&search=${searchTerm}`,
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

    const handlePageChange = (page) => {
        setCurrentPage(page);
        dataProduct(page, false, searchTerm); // Desactiva la alerta al cambiar de página
    };
    const handleSearch = (searchTerm) => {
        setSearchTerm(searchTerm);
        dataProduct(1, false, searchTerm); // Reiniciar a la primera página y realizar búsqueda
    };

    const handleQuantityChange = (productCode, value) => {
        setProductQuantities(prevQuantities => ({
            ...prevQuantities,
            [productCode]: value,
        }));
    };

    const handleGenerateInventory = async () => {
        setIsLoading(true);

        const inventoryId = id; // ID del inventario que estás manejando
        const payload = [];

        dataResponse.forEach((product) => {
            const amount = productQuantities[product.code];
            if (amount > 0) {
                payload.push({
                    inventory: inventoryId,
                    product: product.id, // Asumiendo que `product.id` es el ID del producto
                    amount: parseInt(amount),
                });
            }
        });

        try {
            const response = await apiRequest({
              endpoint: "detail_inventory/",
              method: "POST",
              jsonBody: payload,
              token: token,
            });
            if (response.status != 201) {
              Swal.fire({
                position: "center",
                icon: "error",
                title: response.error,
                showConfirmButton: false,
                timer: 3000,
              });
              setIsLoading(false);
            } else {
              Swal.fire({
                position: "center",
                icon: "success",
                title: response.message,
                showConfirmButton: false,
                timer: 1500,
              });
              setIsLoading(false);
              router.push("/inventory");
            }
          } catch (error) {
            console.error("Error submitting inventory:", error);
          }
    };

    useEffect(() => {
        if (token) {
            dataProduct(currentPage, true, searchTerm);
        }
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
                    <Heading fontSize={20} w={'30%'}>Inventario No. {id} </Heading>
                    <Search onSearch={handleSearch} whit="100%" />

                </CardHeader>
                <CardBody h="90%" overflow="auto" className="scrollable">
                    <TableContainer>
                        <Table variant="simple" size='sm'>
                            <Thead>
                                <Tr>
                                    <Th fontSize={12}>Codigo</Th>
                                    <Th fontSize={12}>Nombre</Th>
                                    <Th fontSize={12}>Unidad De Medida</Th>
                                    <Th fontSize={12}>Precio</Th>
                                    <Th fontSize={12}>cantidad</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {dataResponse ? (
                                    dataResponse.map((product, index) => (
                                        <Tr key={index}>
                                            <Td fontSize={11}>{product.code}</Td>
                                            <Td fontSize={11}>{product.name}</Td>
                                            <Td fontSize={11}>{product.measure_units_name}</Td>
                                            <Td fontSize={11}>{product.price}</Td>
                                            <Td fontSize={11}>
                                                <Input
                                                    type="number"
                                                    textAlign={'center'}
                                                    fontSize={12}
                                                    w={20}
                                                    h={6}
                                                    borderColor={'#889cff'}
                                                    value={productQuantities[product.code] || ""}
                                                    onChange={(e) => handleQuantityChange(product.code, e.target.value)} />
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
                <CardFooter h="10%" justifyContent={"space-between"} alignItems={"center"} >
                    <Button
                        colorScheme="blue"
                        bg="blue.900"
                        fontSize={13}
                        h={10}
                        w={185}
                        m={'0px 10px 0px 0px'}
                        onClick={handleGenerateInventory}
                    >
                        Generar Inventario
                    </Button>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </CardFooter>
            </Card>
        </Flex>
    );
};

export default EnterDataIntoInventory;
