"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
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
  Input,
} from "@chakra-ui/react";
import { fetchData } from "@/utils/fetchData";
import Pagination from "@/components/PaginateComponents/Paginate";
import Search from "@/components/SearchComponents/search";
import Swal from "sweetalert2";
import { apiRequest } from "@/services/fetchService";
import {
  INVENTORY_STATUS_FINALIZED,
  INVENTORY_STATUS_IN_PROCESS,
} from "@/enum/GeneralEnum";

const EnterDataIntoInventory = () => {
  const pathname = usePathname();
  const id = pathname.split("/").pop(); // Extraer el id de la ruta
  const { data: session } = useSession();
  const [dataDetail, setDataDetail] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [dataResponse, setDataResponse] = useState();
  const token = session.user.token;
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  //const [totalCalculated, setTotalCalculated] = useState(0);
  const [pagesCalculated, setPagesCalculated] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [productQuantities, setProductQuantities] = useState({});
  const router = useRouter();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const getDataInventory = async () => {
    try {
      const response = await apiRequest({
        endpoint: `inventory/${id}`,
        method: "GET",
        token,
      });
      console.log("Response getDataInventory", response);
      setDataDetail(response.data);
      //setTotalCalculated(response.data.total_cost);
    } catch (error) {}
  }

  const dataProduct = async (page = 1, showAlert = true, searchTerm = "") => {
    setIsLoading(true);
    try {
      const data = await fetchData({
        endpoint: `product/?page=${page}&search=${searchTerm}`,
        token: token,
        showAlert: showAlert,
      });
      if (data) {
        setDataResponse(data.data.results);
        const calculatedTotalPages = Math.ceil(
          data.data.count / data.data.results.length
        );
        setTotalPages(calculatedTotalPages);
        setPagesCalculated(true);
        data.data.results.forEach((product) => {
          if (productQuantities[product.id]) {
            const copyProductQuantities = structuredClone(productQuantities);
            copyProductQuantities[product.id] = {
              ...copyProductQuantities[product.id],
              price: product.price,
            };
            setProductQuantities(copyProductQuantities);
          }
        });
      }
    } catch (error) {}

    setIsLoading(false);
  };

  const getTotal = () => {
    const quantities = Object.entries(productQuantities).filter(
      ([key, productQuantity]) => productQuantity.quantity > 0
    );
    const results = Object.entries(productQuantities).map(
      ([key, productQuantity]) => {
        return productQuantity.price * (productQuantity.quantity || 0);
      }
    );

    console.log("Results", results);

    return {
      totalAccumulated: results.reduce((a, b) => a + b, 0),
      totalProducts: quantities.length,
    };
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    dataProduct(page, false, searchTerm); // Desactiva la alerta al cambiar de página
  };

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    dataProduct(1, false, searchTerm); // Reiniciar a la primera página y realizar búsqueda
  };

  const handleQuantityChange = (productId, { price, quantity }) => {
    setProductQuantities((prevQuantities) => {
      const updatedProductQuantities = {
        ...prevQuantities,
        [productId]: {
          price,
          quantity,
        }, // Usar el productId como la clave
      };

      // Verificar si algún input tiene un valor positivo
      const hasPositiveQuantity = Object.values(updatedProductQuantities).some(
        (productQuantity) => parseInt(productQuantity.quantity) > 0
      );
      // const updatedTotal = Object.values(updatedProductQuantities).filter(
      //   (productQuantity) => parseInt(productQuantity.quantity) > 0)
      //   .reduce((a, b) => a + b.price * b.quantity, 0);
      // setTotalCalculated(updatedTotal);
      setIsButtonDisabled(!hasPositiveQuantity);

      return updatedProductQuantities;
    });
  };

  const handleGenerateInventory = async (statusInvetory, redirect) => {
    setIsLoading(true);

    const inventoryId = id; // ID del inventario que estás manejando

    // Recorremos todas las cantidades en lugar de solo los productos visibles
    const payload = Object.entries(productQuantities)
      .filter(([productId, product]) => product.quantity > 0)
      .map(([productId, amount]) => {
        return {
          status_inventory: statusInvetory,
          inventory: inventoryId,
          product: productId,
          amount: parseInt(amount.quantity),
        };
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
        if (redirect) router.push("/inventory");
        //router.push("/inventory");
      }
    } catch (error) {
      console.error("Error submitting inventory:", error);
    }
  };

  const confirmated = (statusInvetory, redirect=false) => {
    Swal.fire({
      title: "¿Estás seguro de esta acción?",
      showDenyButton: true,
      icon: "warning",
      confirmButtonText: "Sí",
    }).then((result) => {
      if (result.isConfirmed) {
        handleGenerateInventory(statusInvetory, redirect);
      }
    });
  };

  useEffect(() => {
    if (token) {
      dataProduct(currentPage, true, searchTerm);
      getDataInventory()
    }
  }, []);

  return (
    <Flex direction="column">
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
      <Card>
        <CardHeader
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Heading fontSize={20} w={"20%"} className="flex flex-col gap-1">
            <span>Inventario No. {id}</span>
            <span className="text-xs">{dataDetail?.business_name}</span>
          </Heading>
          <Search onSearch={handleSearch} whit="100%" className="!w-[30%]" />
          <div className="flex items-center flex-1 justify-end">
            <div
              style={{
                fontWeight: "600",
                fontSize: "1.2rem",
                display: "flex",
                gap: "8px",
                marginLeft: 10,
              }}
              className="items-center"
            >
              <span className="whitespace-nowrap">Productos inventariados:</span>
              {getTotal().totalProducts.toLocaleString("es-CO", {
                style: "decimal"
              })}
            </div>
            <div
              style={{
                fontWeight: "600",
                fontSize: "1.2rem",
                display: "flex",
                gap: "8px",
                marginLeft: 10,
              }}
            >
              <span>Total:</span>
              {getTotal().totalAccumulated.toLocaleString("es-CO", {
                style: "currency",
                currency: "COP",
              })}
            </div>
          </div>
        </CardHeader>
        <CardBody overflow="auto" className="scrollable max-h-full">
          <TableContainer>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th fontSize={12}>Código</Th>
                  <Th fontSize={12}>Nombre</Th>
                  <Th fontSize={12}>Unidad De Medida</Th>
                  <Th fontSize={12}>Precio</Th>
                  <Th fontSize={12}>Cantidad</Th>
                  <Th fontSize={12}>Total</Th>
                </Tr>
              </Thead>
              <Tbody>
                {dataResponse ? (
                  dataResponse.map((product, index) => {
                    const productQuantity = productQuantities[product.id] || {
                      quantity: 0,
                      price: product.price,
                    }; // Usar el ID del producto para los inputs
                    const total = product.price * productQuantity.quantity;

                    return (
                      <Tr key={index}>
                        <Td fontSize={11}>{product.code}</Td>
                        {/* Mostrar el código del producto */}
                        <Td fontSize={11}>{product.name}</Td>
                        <Td fontSize={11}>{product.measure_units_name}</Td>
                        <Td fontSize={11}>
                          {product.price.toLocaleString("es-CO", {
                            style: "currency",
                            currency: "COP",
                          })}
                        </Td>
                        <Td fontSize={11}>
                          <Input
                            type="number"
                            textAlign={"center"}
                            fontSize={12}
                            w={20}
                            h={6}
                            borderColor={"#889cff"}
                            value={
                              productQuantity.quantity === 0
                                ? ""
                                : productQuantity.quantity
                            }
                            onChange={(e) =>
                              handleQuantityChange(product.id, {
                                price: product.price,
                                quantity: e.target.value,
                              })
                            }
                          />
                        </Td>
                        <Td fontSize={11}>
                          {total.toLocaleString("es-CO", {
                            style: "currency",
                            currency: "COP",
                          })}
                        </Td>
                      </Tr>
                    );
                  })
                ) : (
                  <Tr>
                    <Td colSpan={6} textAlign="center">
                      No hay datos disponibles
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </CardBody>
        <CardFooter
          justifyContent={"space-between"}
          alignItems={"center"}
          className="!pt-0"
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Button
              colorScheme="blue"
              bg="blue.900"
              fontSize={13}
              h={10}
              w={185}
              m={"0px 10px 0px 0px"}
              onClick={() => confirmated(INVENTORY_STATUS_FINALIZED, true)}
              isDisabled={isButtonDisabled}
            >
              Finalizar Inventario
            </Button>
            <Button
              variant={"outline"}
              fontSize={13}
              h={10}
              w={185}
              m={"0px 10px 0px 0px"}
              onClick={() => confirmated(INVENTORY_STATUS_IN_PROCESS, false)}
              isDisabled={isButtonDisabled}
            >
              Guardar Progreso
            </Button>
          </div>
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
