import {
    Input as InputChakra,
    InputProps as InputChakraProps
  } from "@chakra-ui/react";
export type InputProps = {

} & InputChakraProps;

export default function Input(props: InputProps) { 
  return (
    <InputChakra
      {...props}
      variant="filled"
      background="gray.50"
    />
  );
}
