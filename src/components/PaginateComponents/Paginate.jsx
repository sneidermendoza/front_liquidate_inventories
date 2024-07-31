// components/Pagination.js
import { Box, Button } from "@chakra-ui/react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const canGoBack = currentPage > 1;
  const canGoForward = currentPage < totalPages;

  return (
    <Box display="flex" justifyContent="center" mt="4">
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canGoBack}
        colorScheme="teal"
        mx="2"
      >
        Previous
      </Button>
      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canGoForward}
        colorScheme="teal"
        mx="2"
      >
        Next
      </Button>
    </Box>
  );
};

export default Pagination;
