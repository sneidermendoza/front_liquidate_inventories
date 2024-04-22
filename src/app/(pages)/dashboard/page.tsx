"use client";
import { Box, Card, CardBody, CardFooter, CardHeader, Flex, Heading, Table, TableCaption, TableContainer, Tbody, Td, Text, Tfoot, Th, Thead, Tr } from "@chakra-ui/react";
import { useSession } from "next-auth/react";

const Dashboard = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <Flex direction="column" h="100%">
      <Card h="90vh">
        <CardHeader>
          <Heading size="lg">Dashboard</Heading>
        </CardHeader>
        <CardBody h="90%" overflow="auto" className="scrollable">
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr
                  style={{
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#fff",
                  }}
                >
                  <Th>To convert</Th>
                  <Th>into</Th>
                  <Th isNumeric>multiply by</Th>
                  <Th isNumeric>multiply by</Th>
                  <Th isNumeric>multiply by</Th>
                  <Th isNumeric>multiply by</Th>
                  <Th isNumeric>multiply by</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>inches</Td>
                  <Td>millimetres (mm)</Td>
                  <Td isNumeric>25.4</Td>
                  <Td isNumeric>25.4</Td>
                  <Td isNumeric>25.4</Td>
                  <Td isNumeric>25.4</Td>
                  <Td isNumeric>25.4</Td>
                </Tr>
                <Tr>
                  <Td>inches</Td>
                  <Td>millimetres (mm)</Td>
                  <Td isNumeric>25.4</Td>
                  <Td isNumeric>25.4</Td>
                  <Td isNumeric>25.4</Td>
                  <Td isNumeric>25.4</Td>
                  <Td isNumeric>25.4</Td>
                </Tr>
                <Tr>
                  <Td>inches</Td>
                  <Td>millimetres (mm)</Td>
                  <Td isNumeric>25.4</Td>
                  <Td isNumeric>25.4</Td>
                  <Td isNumeric>25.4</Td>
                  <Td isNumeric>25.4</Td>
                  <Td isNumeric>25.4</Td>
                </Tr>
                <Tr>
                  <Td>inches</Td>
                  <Td>millimetres (mm)</Td>
                  <Td isNumeric>25.4</Td>
                  <Td isNumeric>25.4</Td>
                  <Td isNumeric>25.4</Td>
                  <Td isNumeric>25.4</Td>
                  <Td isNumeric>25.4</Td>
                </Tr>
                <Tr>
                  <Td>inches</Td>
                  <Td>millimetres (mm)</Td>
                  <Td isNumeric>25.4</Td>
                  <Td isNumeric>25.4</Td>
                  <Td isNumeric>25.4</Td>
                  <Td isNumeric>25.4</Td>
                  <Td isNumeric>25.4</Td>
                </Tr>
                <Tr>
                  <Td>inches</Td>
                  <Td>millimetres (mm)</Td>
                  <Td isNumeric>25.4</Td>
                  <Td isNumeric>25.4</Td>
                  <Td isNumeric>25.4</Td>
                  <Td isNumeric>25.4</Td>
                  <Td isNumeric>25.4</Td>
                </Tr>
                <Tr>
                  <Td>inches</Td>
                  <Td>millimetres (mm)</Td>
                  <Td isNumeric>25.4</Td>
                  <Td isNumeric>25.4</Td>
                  <Td isNumeric>25.4</Td>
                  <Td isNumeric>25.4</Td>
                  <Td isNumeric>25.4</Td>
                </Tr>
                <Tr>
                  <Td>inches</Td>
                  <Td>millimetres (mm)</Td>
                  <Td isNumeric>25.4</Td>
                  <Td isNumeric>25.4</Td>
                  <Td isNumeric>25.4</Td>
                  <Td isNumeric>25.4</Td>
                  <Td isNumeric>25.4</Td>
                </Tr>
                <Tr>
                  <Td>inches</Td>
                  <Td>millimetres (mm)</Td>
                  <Td isNumeric>25.4</Td>
                  <Td isNumeric>25.4</Td>
                  <Td isNumeric>25.4</Td>
                  <Td isNumeric>25.4</Td>
                  <Td isNumeric>25.4</Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </CardBody>
        <CardFooter h="10%" justifyContent={"center"} alignItems={"center"}>
          <Text fontSize={10}> By: SMS Correo: Mariasol0304@gmail.com</Text>
        </CardFooter>
      </Card>
    </Flex>
  );
};
export default Dashboard;
