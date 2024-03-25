import React, { useState, useEffect, useRef } from 'react'
import {
    Flex, Button, Input, Text, Menu, MenuItem, MenuButton, MenuList, IconButton, VStack, Image, Box, Popover,
    PopoverTrigger,
    PopoverContent,
} from '@chakra-ui/react';
import { Icon } from '@iconify/react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function Navbar() {
    const buttonRef = useRef(null);
    const { isLogged, userAuth, name, phone_number, isAdmin } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const handleLogout = () => {
        Cookies.remove('access_token');
        navigate('/');
        window.location.reload();
    }
    const { categories, products } = useSelector((state) => state.product);
    const handleSearch = (event) => {
        console.log(`is open : ${isOpen}`)
        const value = event.target.value;
        setSearchTerm(value);

        if (!value.trim()) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        const filteredResults = products.filter(product =>
            product.name.toLowerCase().includes(value.toLowerCase())
        );

        setResults(filteredResults);
        setIsOpen(true);
        if (buttonRef.current) {
            if (isOpen === false) {
                buttonRef.current.click();
            }
            else {
                setIsOpen(true);
            }
        }
    };
    return (
        <Flex
            justifyContent={'space-between'}
            alignItems={'center'}
            height={'65px'}
            width={'100%'}
            bgColor='#535C91'
            padding={'20px'}

        >
            <Text
                fontFamily={'ItalianaRegular'}
                fontSize={26}
                onClick={() => navigate('/products')}
                sx={{
                    color: '#fff',
                    textShadow: `
          -1px -1px 0 #1B1A55,  
           1px -1px 0 #1B1A55,
          -1px  1px 0 #1B1A55,
           1px  1px 0 #1B1A55;`,
                    '@media (max-width: 768px)': {
                        display: 'none', // Hides the component on screens smaller than 768px
                    },

                }}>Desk Shop</Text>

            <Flex
                justifyContent={'center'}

            >
                <Menu>
                    <MenuButton
                        as={Button}
                        borderRadius={0}
                        borderTopLeftRadius={8}
                        borderBottomLeftRadius={8}
                        bgColor='#9290C3'
                        color='#1B1A55'
                        width={{ base: '106px', md: '160px' }}
                        height='36px' // Adjusted to px for consistency
                    >
                        Categories
                    </MenuButton>
                    <MenuList
                        bgColor={'#1B1A55'}
                        borderColor={'#1B1A55'}
                        minWidth={'200px'}
                        maxWidth={'1000px'}
                    >
                        {categories !== null && categories.map((item) => (
                            <MenuItem
                                bgColor={'#1B1A55'}
                                _hover={{
                                    backgroundColor: '#535C91'
                                }}
                                onClick={() => navigate(`/products/${item.name}`)}
                            >{item.name}</MenuItem>
                        ))}


                    </MenuList>
                </Menu>
                {/* <Button
                    borderRadius={0}
                    borderTopLeftRadius={8}
                    borderBottomLeftRadius={8}
                    bgColor={'#9290C3'}
                    color={'#fff'}
                    width={160}
                    height={9}
                >Categories</Button> */}

                <Menu>
                    <Input
                        borderRadius={0}

                        placeholder='Search'
                        width={{ base: 160, md: 460 }}
                        height='36px'
                        borderColor='#1B1A55'
                        bgColor='#1B1A55'
                        color='#fff'
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <MenuButton
                        isActive={isOpen}
                        as={Button}
                        borderRadius={0}
                        borderTopRightRadius={8}
                        borderBottomRightRadius={8}
                        bgColor='#9290C3'
                        color='#fff'
                        width={'50'}
                        height='36px'
                        ref={buttonRef}

                    >
                        <Text><Icon icon="material-symbols:search" width="28" height="28" color='#1B1A55' /></Text>
                    </MenuButton>
                    <MenuList
                        bgColor={'#1B1A55'}
                        borderColor={'#1B1A55'}
                        minWidth={'200px'}
                        maxWidth={'1000px'}
                        ml={{ base: '10', md: '-460' }}
                    >
                        <VStack align="stretch">
                            {results.map((product) => (
                                <Flex
                                    key={product.id}
                                    alignItems="center"
                                    p={2}
                                    bgColor="#1B1A55"
                                    borderRadius="md"
                                    width={{ base: '200px', md: '400px' }}
                                    _hover={{
                                        backgroundColor: '#9290C3',
                                    }}
                                    as='button'
                                    flexDir={'row'}
                                    onClick={() => {
                                        navigate(`/product/${product.id}`)
                                        window.location.reload();
                                    }}
                                >


                                    <Image src={product.image_link} boxSize="50px" borderRadius="full" mr={4} alt={product.name} />
                                    <Text fontWeight="bold">{product.name}</Text>
                                </Flex>
                            ))}

                        </VStack>


                    </MenuList>
                </Menu>


            </Flex>

            <Flex
                alignItems={'center'}
                justifyContent={'center'}
                height={20}
            >
                <Text
                    as='button'
                    p='1'
                    borderRadius={8}
                    mr='1'
                    _hover={{
                        backgroundColor: 'silver'
                    }}>
                    <Icon icon="mdi:cart"
                        width="32"
                        height="32"
                        color='#1B1A55'

                        onClick={() => navigate('/cart')}
                    />
                </Text>
                {isLogged ? (
                    <Menu>
                        <MenuButton as={IconButton} icon={<Icon icon="ic:sharp-account-circle" width="32" height="32" color='#1B1A55' />} bgColor={'#535C91'} />
                        <MenuList
                            bgColor={'#1B1A55'}
                            borderColor={'#1B1A55'}
                            minWidth={'200px'}
                            maxWidth={'1000px'}
                        >
                            <Flex width={'100%'} alignItems={'center'} flexDir={'column'}>
                                <Text>{name}</Text>
                                <Text>{userAuth}</Text>
                                <Text>{phone_number}</Text>
                                <Text bgColor={'silver'} width={'90%'} height={'1px'} opacity={'0.3'} mt='2'></Text>
                            </Flex>
                            {isLogged ? (
                                <>
                                    <MenuItem
                                        mt='2'
                                        bgColor={'#1B1A55'}
                                        _hover={{
                                            backgroundColor: '#535C91'
                                        }}
                                        onClick={() => navigate('/edit-profile')}
                                    >Edit Profile</MenuItem>
                                    <MenuItem
                                        mt='2'
                                        bgColor={'#1B1A55'}
                                        _hover={{
                                            backgroundColor: '#535C91'
                                        }}
                                        onClick={() => navigate('/paid')}
                                    >Paid</MenuItem>
                                    <MenuItem
                                        bgColor={'#1B1A55'}
                                        _hover={{
                                            backgroundColor: '#535C91'
                                        }}
                                        onClick={handleLogout}
                                    >Logout</MenuItem>
                                </>
                            ) : ''}
                            {isAdmin ? (
                                <>
                                    <MenuItem
                                        bgColor={'#1B1A55'}
                                        _hover={{
                                            backgroundColor: '#535C91'
                                        }}
                                        onClick={() => navigate('/categories')}
                                    >Categories</MenuItem>
                                    <MenuItem
                                        bgColor={'#1B1A55'}
                                        _hover={{
                                            backgroundColor: '#535C91'
                                        }}
                                        onClick={() => navigate('/accounts')}
                                    >Accounts</MenuItem>
                                    <MenuItem
                                        bgColor={'#1B1A55'}
                                        _hover={{
                                            backgroundColor: '#535C91'
                                        }}
                                        onClick={() => navigate('/add-product')}
                                    >Add Product</MenuItem>
                                </>

                            ) : ''}
                        </MenuList>
                    </Menu>
                ) : (
                    <Text as={'button'} _hover={{ backgroundColor: 'silver' }} p='1' borderRadius={8}><Icon icon="solar:login-bold" width="32" height="32" color='#1B1A55' onClick={() => navigate('/login')} /></Text>
                )}



            </Flex>
        </Flex>
    )
}

