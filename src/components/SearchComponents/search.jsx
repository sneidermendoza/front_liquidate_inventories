"use client"
import React, { useState } from 'react';
import { Input, InputGroup, InputLeftAddon } from '@chakra-ui/react';
import {SearchIcon } from "@chakra-ui/icons";


const Search = ({ onSearch,whit='50%', className }) => {
  const [searchValue, setSearchValue] = useState('');
  const [debounceTimer, setDebounceTimer] = useState(null);

  // Crear una función de debounce
  const debounce = (func, delay) => {
    return function(...args) {
      if (debounceTimer) clearTimeout(debounceTimer);
      setDebounceTimer(setTimeout(() => {
        func(...args);
      }, delay));
    };
  };

  // Crear una función de búsqueda debounced
  const debouncedSearch = debounce((value) => {
    onSearch(value);
  }, 500);

  // Manejar el cambio en el valor de búsqueda
  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
    debouncedSearch(event.target.value);
  };

  return (
    <InputGroup size='sm' className={className}>
      <InputLeftAddon size='sm'><SearchIcon/></InputLeftAddon>
      <Input
        value={searchValue}
        onChange={handleSearchChange}
        width={whit}
        
        borderRadius={'5%'} />
    </InputGroup>
  );
};

export default Search;
