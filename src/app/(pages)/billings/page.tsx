"use client";

import TableWrapper, { TableColumn } from "@/components/TableWrapper";
import { fetchData } from "@/utils/fetchData";
import {
  Flex,
  Card,
  CardHeader,
  Heading,
  CardBody,
  CardFooter,
  Text
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

type Billing = {
  id: string;
  attribute_name: string;
  total_profit: number;
  inventory: number;
  atribute: number;
};

type BillingResponse = {
  count: number;
  next: string;
  previous: string;
  results: Billing[];
};

const Billing = () => {
  const columns: TableColumn<Billing>[] = [
    {
      id: "id",
      cell: (row) => {
        return <>{row.id}</>;
      },
      text: "Id",
    },
    {
      id: "total_profit",
      cell: (row) => {
        return <>$ {row.total_profit.toLocaleString("es-CO")}</>;
      },
      text: "Ganancia",
    },
  ];
  const { data: session } = useSession();
  const [dataResponse, setDataResponse] = useState<BillingResponse[]>([]);
  const token = session?.user.token;
  const dataMenu = async () => {
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

  useEffect(() => {
    dataMenu();
  }, []);

  return (
    <>
      <Flex direction="column" h="100%">
        <Card h="90vh">
          <CardHeader>
            <Heading size="lg">Facturación</Heading>
          </CardHeader>
          <CardBody h="90%" overflow="auto" className="scrollable">
            <TableWrapper columns={columns} rows={dataResponse}></TableWrapper>
          </CardBody>
          <CardFooter h="10%" justifyContent={"center"} alignItems={"center"}>
            <Text fontSize={10}> By: SMS Correo: Mariasol0304@gmail.com</Text>
          </CardFooter>
        </Card>
      </Flex>
    </>
  );
};

export default Billing;
