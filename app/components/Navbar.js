import { Box, Input, Button, VStack, FlatList, Text, Modal, Menu, Pressable } from 'native-base';
import { TouchableOpacity, Image, View } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { get_categories, get_products } from '../store/productSlice';
import { useNavigation } from '@react-navigation/native';
import { Platform } from 'react-native';
import { get_info, logout } from '../store/authSlice';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';

export default function Navbar() {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { products, categories } = useSelector((state) => state.product);

    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);

    const { isLogged, isAdmin, userAuth, phone_number, name, token } = useSelector((state) => state.auth)
    const handleSearch = (value) => {
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

        // Since Native Base and React Native do not support click() on refs like web, you might need to adapt this part.
        // For instance, using navigation or conditional rendering based on `isOpen` state.
    };
    const handleLogout = () => {
        dispatch(logout());
        navigation.navigate('Products')
    }
    useEffect(() => {
        if (token !== null) {
            dispatch(get_info(token));
        }
    }, [token, isAdmin])
    return (
        <View>
            <Box
                display={'flex'}
                flexDir={'row'}
                height={Platform.OS === 'ios' ? '160px' : '120px'}

                width={'100%'}
                bgColor={'#535c91'}
                justifyContent={'space-between'}
                alignItems={'center'}
                padding={'20px'}
                paddingTop={Platform.OS === 'ios' ? '80px' : '40px'}
            >
                <Box
                    display='flex'
                    flexDir={'row'}
                    width={'70%'}
                >
                    {/* <Button
                        borderTopRightRadius={0}
                        borderBottomRightRadius={0}
                        bgColor={'#9290c3'}
                        _text={{ color: '#1b1a55', fontWeight: 'bold' }}
                        fontWeight={'bold'}
                        fontSize={26}


                    >Categories</Button> */}
                    <Menu bgColor={'#1b1a55'} w="190" trigger={triggerProps => {
                        return <Pressable accessibilityLabel="More options menu" {...triggerProps}>
                            <Button
                                borderTopRightRadius={0}
                                borderBottomRightRadius={0}
                                bgColor={'#9290c3'}
                                _text={{ color: '#1b1a55', fontWeight: 'bold' }}
                                fontWeight={'bold'}
                                fontSize={26}
                                {...triggerProps}
                            >Categories</Button>
                        </Pressable>;
                    }}>
                        {categories && categories.map((item) => <Menu.Item _text={{ color: '#fff' }} bgColor={'#1b1a55'} onPress={() => navigation.navigate('Products', { name: item.name })}>{item.name}</Menu.Item>)}

                        {/* {products && products.map((item) => <Menu.Item _text={{ color: '#fff' }} bgColor={'#1b1a55'}>{item.name}</Menu.Item>)} */}
                    </Menu>
                    <Box width={'100%'}>
                        <Input
                            placeholder="Search"
                            height={'42px'}
                            variant="filled"
                            value={searchTerm}
                            onChangeText={handleSearch}
                            width="75%"
                            borderColor="#1B1A55"
                            backgroundColor="#1B1A55"
                            color="#fff"
                            _focus={{
                                borderColor: "#1B1A55",
                            }}
                            borderTopLeftRadius={0}
                            borderBottomLeftRadius={0}
                        />


                        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} >
                            <Modal.Content maxWidth="400px" bgColor={'#1b1a55'}>
                                <Modal.CloseButton />
                                <Modal.Header bgColor={'#1b1a55'} _text={{ color: '#fff' }}>Results</Modal.Header>
                                <Modal.Body bgColor={'#1b1a55'} _text={{ color: '#fff' }} borderColor={'#1b1a55'}>
                                    <VStack space={4} bgColor={'#1b1a55'}>
                                        <FlatList
                                            bgColor={'#1b1a55'}
                                            data={results}
                                            renderItem={({ item }) => (
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        navigation.navigate('InfoProduct', { id: item.id })

                                                    }}
                                                    style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}
                                                >
                                                    <Image
                                                        source={{ uri: item.image_link }}
                                                        alt={item.id.toString()}
                                                        style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }}
                                                    />
                                                    <Text bold color="#fff">{item.name}</Text>
                                                </TouchableOpacity>
                                            )}
                                            keyExtractor={item => item.id}
                                        />
                                    </VStack>
                                </Modal.Body>
                            </Modal.Content>
                        </Modal>
                    </Box>


                </Box>
                <Box>
                    {isLogged ? (
                        <Menu bgColor={'#1b1a55'} w="190" trigger={triggerProps => {
                            return <Pressable accessibilityLabel="More options menu" {...triggerProps}>
                                <Button
                                    bgColor={'#535c91'}
                                    leftIcon={<FontAwesome5 name="user-circle" size={34} solid={false}
                                        color="#1b1a55" />}
                                    {...triggerProps}
                                ></Button>
                            </Pressable>;
                        }}>
                            <Text textAlign={'center'} color={'#fff'} mb={2}>{userAuth}</Text>
                            <Menu.Item _text={{ color: '#fff' }} bgColor={'#1b1a55'} onPress={() => navigation.navigate('Cart')}>My Cart</Menu.Item>
                            <Menu.Item _text={{ color: '#fff' }} bgColor={'#1b1a55'} onPress={() => navigation.navigate('EditProfile')}>Edit Profile</Menu.Item>
                            <Menu.Item _text={{ color: '#fff' }} bgColor={'#1b1a55'} onPress={() => navigation.navigate('Paid')}>Paid</Menu.Item>
                            {isAdmin && (
                                <>
                                    <Menu.Item _text={{ color: '#fff' }} bgColor={'#1b1a55'} onPress={() => navigation.navigate('Categories')}>Categories</Menu.Item>
                                    <Menu.Item _text={{ color: '#fff' }} bgColor={'#1b1a55'} onPress={() => navigation.navigate('Accounts')}>Accounts</Menu.Item>
                                    <Menu.Item _text={{ color: '#fff' }} bgColor={'#1b1a55'} onPress={() => navigation.navigate('AddProduct')}>Add Product</Menu.Item>
                                </>
                            )}
                            <Menu.Item _text={{ color: '#fff' }} bgColor={'#1b1a55'} onPress={handleLogout}>Logout</Menu.Item>


                        </Menu>
                    ) : (
                        <Button
                            bgColor={'#535c91'}
                            leftIcon={<FontAwesome5 name="sign-in-alt" size={34} color="#1b1a55" solid />}
                            onPress={() => navigation.navigate('Login')}
                        ></Button>
                    )}

                </Box>
            </Box>
        </View >
    )
}
