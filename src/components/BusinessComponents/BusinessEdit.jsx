"use client";
import React, { useEffect, useState } from "react";
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
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { apiRequest } from "@/services/fetchService";
import Swal from "sweetalert2";

const BusinessEdit = ({
    isOpen,
    onClose,
    business,
    businesReload,
    responseUserCustomer,
}) => {
    const [formData, setFormData] = useState({
        name_business: "",
        user: "",
    });
    const { data: session } = useSession();
    const token = session.user.token;
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (business) {
            setFormData({
                name_business: business.name_business,
                user: business.user_id,
            });
        }
    }, [business]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async () => {
        setIsLoading(true);

        const data = {
            name_business: formData.name_business,
            user: parseInt(formData.user, 10),
        };

        try {
            const response = await apiRequest({
                endpoint: `business/${business.id}/`,
                method: "PUT",
                jsonBody: data,
                token: token,
            });

            if (response.status !== 200) {
                let errorMessage = "Ocurrió un error.";
                if (response.error) {
                    const errorFields = Object.keys(response.error);
                    errorMessage = errorFields.map(field => {
                        return `${field}: ${response.error[field].join(", ")}`;
                    }).join("\n");
                }
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: errorMessage,
                    showConfirmButton: false,
                    timer: 3000,
                });
                setIsLoading(false);
                onClose();

            } else {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: response.message,
                    showConfirmButton: false,
                    timer: 1500,
                });
                setIsLoading(false);
                businesReload();
                onClose();
                setFormData("", "")
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
                <ModalHeader>Editar Atributo</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                        <FormControl gridColumn="span 1">
                            <FormLabel>Nombre Del Negocio</FormLabel>
                            <Input
                                type="text"
                                name="name_business"
                                value={formData.name_business}
                                onChange={handleChange}
                                maxLength={150}
                                minLength={1}
                                isRequired
                            />
                        </FormControl>
                        <FormControl gridColumn="span 1">
                            <FormLabel>Cliente</FormLabel>
                            <Select
                                name="user"
                                value={formData.user}
                                onChange={handleChange}
                                isRequired
                            >
                                <option value="">Seleccione Un Cliente</option>
                                {Array.isArray(responseUserCustomer) &&
                                    responseUserCustomer.map((unit, index) => (
                                        <option key={unit.id} value={unit.id}>
                                            {unit.name}
                                        </option>
                                    ))}
                            </Select>
                        </FormControl>
                    </Grid>
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

export default BusinessEdit;
