"use client";
import React, { useState, useEffect } from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Input,
    Select,
    Button,
    Grid,
    Flex,
    Spinner,
    Text,
    InputRightElement,
    InputGroup,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { apiRequest } from "@/services/fetchService";
import Swal from "sweetalert2";


const UserEdit = ({ isOpen, onClose,userReload,
    user,
    responseRole, }) => {
    const [formData, setFormData] = useState({
        name: "",
        last_name: "",
        email: "",
        role: "",
    });
    const [errors, setErrors] = useState({});
    const { data: session } = useSession();
    const token = session.user.token;
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user) {
          setFormData({
            name: user.name,
            last_name: user.last_name,
            email: user.email,
            role: user.role_id,
          });
        }
      }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        if (name === "email") {
            if (!validateEmail(value)) {
                setErrors({ ...errors, email: "El correo electrónico no es válido" });
            } else {
                setErrors({ ...errors, email: false });
            }
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        const data = {
            name: formData.name,
            last_name: formData.last_name,
            email: formData.email,
            role: parseInt(formData.role, 10),
        };
        try {
            const response = await apiRequest({
              endpoint: `users/${user.id}/`,
              method: "PUT",
              jsonBody: data,
              token: token,
            });
      
            if (response.status !== 200) {
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
              userReload();
              onClose();
              setFormData({
                name: "",
                last_name: "",
                email: "",
                role: "",
            });
            }
          } catch (error) {
            Swal.fire({
              position: "center",
              icon: "error",
              title: error,
              showConfirmButton: false,
              timer: 3000,
            });
            setIsLoading(false);
          }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
            {isLoading && (
                <Flex
                    position="absolute"
                    top="0"
                    left="0"
                    width="100%"
                    height="100%"
                    bg="rgba(0, 0, 0, 0.5)"
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
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Editar Usuario</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                        <FormControl gridColumn="span 1" isInvalid={!!errors.name}>
                            <FormLabel>Nombre</FormLabel>
                            <Input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                maxLength={150}
                                minLength={1}
                                isRequired
                            />
                        </FormControl>
                        <FormControl gridColumn="span 1" isInvalid={!!errors.last_name}>
                            <FormLabel>Apellido</FormLabel>
                            <Input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                maxLength={150}
                                minLength={1}
                                isRequired
                            />
                            {errors.last_name && <Text color="red.500" fontSize="sm">{errors.last_name}</Text>}
                        </FormControl>
                        <FormControl gridColumn="span 1" isInvalid={!!errors.email}>
                            <FormLabel>Email</FormLabel>
                            <Input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                maxLength={150}
                                minLength={1}
                                isRequired
                            />
                            {errors.email && <Text color="red.500" fontSize="sm">{errors.email}</Text>}
                        </FormControl>
                        <FormControl gridColumn="span 1" isInvalid={!!errors.role}>
                            <FormLabel>Rol</FormLabel>
                            <Select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                isRequired
                            >
                                <option value="">Seleccione Un Rol</option>
                                {Array.isArray(responseRole) &&
                                    responseRole.map((unit) => (
                                        <option key={unit.id} value={unit.id}>
                                            {unit.role}
                                        </option>
                                    ))}
                            </Select>
                            {errors.role && <Text color="red.500" fontSize="sm">{errors.role}</Text>}
                        </FormControl>
                    </Grid>
                    {errors.form && <Text color="red.500" fontSize="sm" mt={2}>{errors.form}</Text>}
                </ModalBody>
                <ModalFooter>
                    <Flex justify="space-between" w="100%">
                        <Button colorScheme="blue" onClick={handleSubmit}>
                            Guardar
                        </Button>
                        <Button colorScheme="red" onClick={onClose}>
                            Cancelar
                        </Button>
                    </Flex>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default UserEdit;
