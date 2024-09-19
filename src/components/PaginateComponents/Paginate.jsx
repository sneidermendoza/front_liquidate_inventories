"use client";
// components/Pagination.js
import { Box, Button, Text } from "@chakra-ui/react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const canGoBack = currentPage > 1;
  const canGoForward = currentPage < totalPages;
  const pageNumbers = [];
  // Generar números de página dinámicamente
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    pageNumbers.push(1); // Primera página
    if (currentPage > 3) {
      pageNumbers.push("..."); // Puntos suspensivos antes de la página actual
    }

    // Páginas cercanas a la actual
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pageNumbers.push(i);
    }

    if (currentPage < totalPages - 2) {
      pageNumbers.push("..."); // Puntos suspensivos después de la página actual
    }
    pageNumbers.push(totalPages); // Última página
  }

  return totalPages> 0 &&  (
    <Box display="flex" justifyContent="center" alignItems="center" mt="4"             margin={'0px'}
>
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        isDisabled={!canGoBack}
        colorScheme="teal"
        mx="1"
        size="sm"
      >
        « Prev
      </Button>
      {pageNumbers.map((number, index) =>
        number === "..." ? (
          <Text key={index} mx="2" size="sm">
            ...
          </Text>
        ) : (
          <Button
            key={index}
            onClick={() => onPageChange(number)}
            isDisabled={number === currentPage}
            colorScheme={number === currentPage ? "blue" : "gray"}
            mx="1"
            size="sm"
            variant={number === currentPage ? "solid" : "outline"}
          >
            {number}
          </Button>
        )
      )}
      <Button
        onClick={() => onPageChange(currentPage + 1)}
        isDisabled={!canGoForward}
        colorScheme="teal"
        mx="1"
        size="sm"
      >
        Next »
      </Button>
    </Box>
  );
};

export default Pagination;
