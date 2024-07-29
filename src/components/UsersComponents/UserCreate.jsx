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

const UserCreate = ({ isOpen, onClose, responseRole, userReload }) => {
    const [formData, setFormData] = useState({
        name: "",
        last_name: "",
        email: "",
        role: "",
        password: "",
        password_2: "",
    });
    const [errors, setErrors] = useState({});
    const [passwordMatchMessage, setPasswordMatchMessage] = useState("");
    const { data: session } = useSession();
    const token = session.user.token;
    const [isLoading, setIsLoading] = useState(false);
    const [show, setShow] = useState(false)
    const handleClickShowPassword = () => setShow(!show)


    useEffect(() => {
        if (formData.password && formData.password_2) {
            if (formData.password === formData.password_2) {
                setPasswordMatchMessage("Las contraseñas coinciden");
                setErrors((prevErrors) => ({ ...prevErrors, password_2: false }));
            } else {
                setPasswordMatchMessage("Las contraseñas no coinciden");
                setErrors((prevErrors) => ({ ...prevErrors, password_2: true }));
            }
        } else {
            setPasswordMatchMessage("");
            setErrors((prevErrors) => ({ ...prevErrors, password_2: true }));
        }
    }, [formData.password, formData.password_2]);

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
            password: formData.password,
        };
        try {
            const response = await apiRequest({
                endpoint: "users/",
                method: "POST",
                jsonBody: data,
                token: token,
            });
            if (response.status !== 201) {
                setErrors({ form: response.error });
                setIsLoading(false);
            } else {
                setFormData({
                    name: "",
                    last_name: "",
                    email: "",
                    role: "",
                    password: "",
                    password_2: "",
                });
                userReload();
                onClose();
            }
        } catch (error) {
            setErrors({ form: "Error al crear el usuario" });
            console.error("Error submitting product:", error);
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
                <ModalHeader>Agregar Nuevo Usuario</ModalHeader>
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
                        <InputGroup
                            gridColumn="span 1"
                            isInvalid={!!errors.password}
                            display="flex"
                            flexDirection="column" >
                            <FormLabel>Contraseña</FormLabel>
                            <Input
                                type={show ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                maxLength={150}
                                minLength={1}
                                isRequired
                            />
                            <InputRightElement width='4.5rem'>
                                <Button 
                                h='1.75rem' size='sm' 
                                onClick={handleClickShowPassword}
                                margin={'87% 0px 0px 0px'}>
                                {show ? 'Hide' : 'Show'}
                                </Button>
                            </InputRightElement>
                        </InputGroup >
                        <InputGroup
                            gridColumn="span 1"
                            display="flex"
                            flexDirection="column"
                            isInvalid={!!errors.password_2}>
                            <FormLabel>Repetir Contraseña</FormLabel>
                            <Input
                                type="password"
                                name="password_2"
                                value={formData.password_2}
                                onChange={handleChange}
                                maxLength={150}
                                minLength={1}
                                isRequired
                            />
                            {passwordMatchMessage && (
                                <Text color={errors.password_2 ? "red.500" : "green.500"} fontSize="sm">
                                    {passwordMatchMessage}
                                </Text>
                            )}
                        </InputGroup>
                    </Grid>
                    {errors.form && <Text color="red.500" fontSize="sm" mt={2}>{errors.form}</Text>}
                </ModalBody>
                <ModalFooter>
                    <Flex justify="space-between" w="100%">
                        <Button colorScheme="blue" onClick={handleSubmit}>
                            Crear
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

export default UserCreate;
