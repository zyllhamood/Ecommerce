import React from 'react'
import { useState, useEffect, useRef } from 'react';
import { Box, Flex, Button, Input, Menu, MenuButton, MenuList, MenuItem, Text, Checkbox, Stack } from '@chakra-ui/react';
import Navbar from '../components/Navbar'
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
export default function Categories() {
    const access_token = Cookies.get('access_token');
    const { categories, products } = useSelector((state) => state.product);
    const [selectedCategoryName, setSelectedCategoryName] = useState('');
    const [checkedProducts, setCheckedProducts] = useState([]);
    const nameRef = useRef('');
    useEffect(() => {
        if (categories && categories.length > 0) {
            if (selectedCategoryName) {
                const selectedCategory = categories.find(cat => cat.name === selectedCategoryName);
                if (selectedCategory) {
                    // Assuming 'selectedCategory.products' is an array of product IDs in the category
                    // Adjust if your data structure is different
                    const productIdsInCategory = selectedCategory.products;
                    setCheckedProducts(productIdsInCategory);
                }
            } else {
                // Clear checked products if no category is selected
                setCheckedProducts([]);
            }
        }

    }, [selectedCategoryName, categories]);

    const handleCheckboxChange = (productId) => {
        setCheckedProducts(prev => {
            if (prev.includes(productId)) {
                return prev.filter(id => id !== productId); // Uncheck
            } else {
                return [...prev, productId]; // Check
            }
        });
    };
    const handleSuccess = (msg) => {
        Swal.fire({
            icon: 'success',
            title: 'success',
            text: msg,
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.reload();
            }
        });
    }
    const handleEdit = () => {
        // Logic to edit category with new product selections goes here
        //console.log(selectedCategoryName)
        const data = {
            name: selectedCategoryName,
            product_ids: checkedProducts
        }
        const id_category = categories.find((item) => item.name === selectedCategoryName).id;

        fetch(`http://127.0.0.1:8000/api/edit-category/${id_category}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            },
            body: JSON.stringify(data)
        })
            .then((response) => response.ok && handleSuccess("Save Changed"))


    };

    const handleAdd = () => {
        const name = nameRef.current.value;
        const data = {
            name,
            product_ids: []
        }
        fetch('http://127.0.0.1:8000/api/add-category/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            },
            body: JSON.stringify(data)
        })
            .then((response) => response.ok && handleSuccess("Add category"))
    }
    return (
        <>
            <Navbar />
            <Flex
                width={'100%'}
                height={'660px'}
                justifyContent={'center'}
            >
                <Flex
                    width={{ base: '80%', md: '30%' }}
                    bgColor={'#1b1a55'}
                    m='8'
                    borderRadius={8}
                    flexDir='column'
                    alignItems={'center'}
                >
                    <Flex flexDir={'column'} width={'100%'} alignItems={'center'}>
                        <Text mt='4' fontSize={28}>Adding Category</Text>
                        <Input
                            placeholder='Name Categorie'
                            width={'90%'}
                            mt='2'
                            borderColor='#070f2b'
                            bgColor='#070f2b'
                            ref={nameRef}
                        />


                        <Button
                            //bgColor='#070f2b'
                            mt='2'
                            colorScheme={'facebook'}
                            width={'90%'}
                            onClick={handleAdd}
                        >Add</Button>
                        <Box height={'1px'} width={'90%'} bgColor='silver' mt='4'></Box>
                    </Flex>
                    <Flex flexDir={'column'} width={'100%'} alignItems={'center'}>
                        <Text mt='4' fontSize={28}>Editing Category</Text>
                        <Menu>
                            <MenuButton as={Button} color='white' bgColor='#070f2b' mt='10px' width='90%'>
                                {selectedCategoryName || 'Select Category'}
                            </MenuButton>
                            <MenuList borderColor='#070f2b' bgColor='#070f2b' >
                                {categories && categories.length > 0 && categories.map((option, index) => (
                                    <MenuItem
                                        key={index}
                                        onClick={() => setSelectedCategoryName(option.name)}
                                        bgColor='#070f2b'
                                        border='1px'
                                        borderColor='#070f2b'
                                        _hover={{
                                            backgroundColor: '#9290C3'
                                        }}

                                    >
                                        {option.name}
                                    </MenuItem>
                                ))}
                            </MenuList>
                        </Menu>

                        <Flex flexDir={'column'} overflowY={'scroll'} mt='4' width={'90%'} sx={{
                            '::-webkit-scrollbar': {
                                width: '16px',
                                borderRadius: '8px',
                                backgroundColor: `rgba(0, 0, 0, 0.05)`,
                            },
                            '::-webkit-scrollbar-thumb': {
                                backgroundColor: `rgba(0, 0, 0, 0.2)`,
                                borderRadius: '8px',
                            },
                        }} >
                            {products && products.length > 0 && products.map(product => (
                                <Checkbox
                                    key={product.id}
                                    isChecked={checkedProducts.includes(product.id)}
                                    onChange={() => handleCheckboxChange(product.id)}
                                >
                                    {product.name}
                                </Checkbox>
                            ))}
                        </Flex>

                        <Button mt={5} colorScheme="facebook" width={'90%'} onClick={handleEdit}>Edit</Button>
                    </Flex>
                </Flex>


            </Flex>
        </>
    )
}
