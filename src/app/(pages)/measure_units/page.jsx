"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import MeasureUnitsCreate from "@/components/MeasureUnitsComponents/MeasureUnitsCreate";
import MeasureUnitsEdit from "@/components/MeasureUnitsComponents/MeasureUnitsEdit";
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
import Search from "@/components/SearchComponents/search";

const MeasureUnits = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [dataResponse, setDataResponse] = useState();
  const [isModalOpenCreate, setIsModalOpenCreate] = useState(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [measureUnits, setmeasureUnits] = useState();
  const token = session.user.token;
  const [searchTerm, setSearchTerm] = useState("");

  const dataMeasureUnits = async (page, showAlert, searchTerm) => {
    const params = new URLSearchParams();
    if (page) params.append("page", page);
    if (searchTerm) params.append("search", searchTerm);

    const url = `measure_units?${params.toString()}`;
    const data = await fetchData({
      endpoint: url,
      token: token,
      showAlert: true,
    });
    if (data) {
      setDataResponse(data.data.results);
    }
  };

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    dataMeasureUnits(1, false, searchTerm); // Reiniciar a la primera página y realizar búsqueda
  };

  const handleEditClick = (measureUnits) => {
    setmeasureUnits(measureUnits);
    setIsModalOpenEdit(true);
  };

  const handleDeleteClick = async (measureUnitsId) => {
    setIsLoading(true);
    await handleDelete({
      endpoint: "measure_units/",
      token: token,
      elementId: measureUnitsId,
      callback: dataMeasureUnits,
    });
    setIsLoading(false);
  };

  useEffect(() => {
    dataMeasureUnits();
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
          <Heading fontSize={20}>Unidades De Medidas</Heading>
          <Search onSearch={handleSearch} whit="100%" />
          <Button
            colorScheme="blue"
            bg="blue.900"
            fontSize={13}
            h={10}
            w={170}
            onClick={() => setIsModalOpenCreate(true)}
          >
            Crear Unidade De Medida
          </Button>
        </CardHeader>
        <CardBody h="90%" overflow="auto" className="scrollable">
          <TableContainer>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th fontSize={12}>Id</Th>
                  <Th fontSize={12}>Nombre</Th>
                  <Th fontSize={12}>Opciones</Th>
                </Tr>
              </Thead>
              <Tbody>
                {dataResponse ? (
                  dataResponse.map((measure, index) => (
                    <Tr key={index}>
                      <Td fontSize={12}>{measure.id}</Td>
                      <Td fontSize={12}>{measure.name}</Td>
                      <Td fontSize={12}>
                        <EditIcon
                          marginLeft={5}
                          onClick={() => handleEditClick(measure)}
                        />
                        <DeleteIcon
                          marginLeft={1}
                          onClick={() => handleDeleteClick(measure.id)}
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
      <MeasureUnitsCreate
        isOpen={isModalOpenCreate}
        onClose={() => setIsModalOpenCreate(false)}
        reloadMeasureUnits={dataMeasureUnits}
      />
      <MeasureUnitsEdit
        isOpen={isModalOpenEdit}
        onClose={() => setIsModalOpenEdit(false)}
        reloadMeasureUnits={dataMeasureUnits}
        measureUnits={measureUnits}
      />
    </Flex>
  );
};

export default MeasureUnits;
