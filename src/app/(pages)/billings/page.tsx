"use client";

import Pagination from "@/components/PaginateComponents/Paginate";
import Search from "@/components/SearchComponents/search";
import Switch from "@/components/Switch";
import TableWrapper, { TableColumn } from "@/components/TableWrapper";
import { apiRequest } from "@/services/fetchService";
import { fetchData } from "@/utils/fetchData";
import {
  Flex,
  Card,
  CardHeader,
  Heading,
  CardBody,
  CardFooter,
  Text,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

type Billing = {
  id: string;
  attribute_name: string;
  total_profit: number;
  inventory: number;
  attribute: number;
  created_date: string;
  business_name: string;
};

type BillingResponse = {
  count: number;
  next: string;
  previous: string;
  results: Billing[];
};

const Billing = () => {
  const handleUpdateState = async (state: boolean, row: Billing) => {
    console.log("state", state, state ? 1 : 2);

    setDataResponse((data) => {
      const newData = [...data];
      const index = newData.findIndex((billing) => billing.id === row.id);
      if (index !== -1) {
        newData[index] = {
          ...row,
          attribute: state ? 1 : 2,
        };
      }
      return newData;
    });
    const response = await apiRequest({
      endpoint: `billing/${row.id}`,
      method: "PUT",
      token: token,
      jsonBody: {
        ...row,
        attribute: state ? 1 : 2,
      },
    });
    if (!response.error) {
    } else {
      setDataResponse((data) => {
        const newData = [...data];
        const index = newData.findIndex((billing) => billing.id === row.id);
        if (index !== -1) {
          newData[index] = {
            ...row,
            attribute: state ? 1 : 2,
          };
        }
        return newData;
      });
    }
  };
  const columns: TableColumn<Billing>[] = [
    {
      id: "id",
      cell: (row) => {
        return <>{row.id}</>;
      },
      text: "Id",
    },
    {
      id: "business_name",
      cell: (row) => {
        return <>{row.business_name}</>;
      },
      text: "Cliente",
    },
    {
      id: "total_profit",
      cell: (row) => {
        return (
          <>
            <strong>$ {row.total_profit.toLocaleString("es-CO")}</strong>
          </>
        );
      },
      text: "Ganancia",
    },
    {
      id: "created_date",
      cell: (row) => {
        return <>{row.created_date}</>;
      },
      text: "Fecha",
    },
    {
      id: "attribute_name",
      cell: (row) => {
        return <>{row.attribute_name}</>;
      },
      text: "Estado",
    },
    {
      id: "attribute",
      cell: (row) => {
        return (
          <>
            {" "}
            <Switch
              disabled={row.attribute === 1}
              checked={row.attribute === 1}
              onChange={(e) => {
                console.log("Change", e.target.checked);
                handleUpdateState(e.target.checked, row);
              }}
              name={row.id.toString()}
            ></Switch>
          </>
        );
      },
      text: "Cambiar estado",
    },
  ];
  const { data: session } = useSession();
  const [dataResponse, setDataResponse] = useState<Billing[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const token = session?.user.token;
  const dataMenu = async (
    page: number = 1,
    showAlert: boolean = true,
    searchTerm: string = ""
  ) => {
    const data = await fetchData({
      endpoint: "billing/",
      token: token ?? "",
      showAlert: true,
    });
    if (data) {
      console.log(data.data.results);
      setDataResponse(data.data.results);
    }
  };

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    dataMenu(1, false, searchTerm); // Reiniciar a la primera página y realizar búsqueda
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    dataMenu(page, false, searchTerm); // Desactiva la alerta al cambiar de página
  };

  useEffect(() => {
    dataMenu();
  }, []);

  return (
    <>
      <Flex direction="column" h="100%">
        <Card h="90vh">
          <CardHeader>
            <Heading fontSize={30} w={"30%"}>
              Facturación
            </Heading>
            <Search onSearch={handleSearch} whit="100%" />
          </CardHeader>
          <CardBody h="90%" overflow="auto" className="scrollable">
            <TableWrapper columns={columns} rows={dataResponse}></TableWrapper>
          </CardBody>
          <CardFooter h="10%" justifyContent={"center"} alignItems={"center"}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </CardFooter>
        </Card>
      </Flex>
    </>
  );
};

export default Billing;
