import React, { useState, useEffect } from 'react'
import { Box, Text, Button, ScrollView, View, Input, Select, CheckIcon, Icon, Checkbox } from 'native-base';
import Navbar from '../components/Navbar';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
export default function Categories() {
    const navigation = useNavigation();
    const [nameCategory, setNameCategory] = useState(null);
    const [selectedCategoryName, setSelectedCategoryName] = useState('');
    const { products, categories } = useSelector((state) => state.product)
    const { token } = useSelector((state) => state.auth)
    const [checkedProducts, setCheckedProducts] = useState([]);
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
    const handleAdd = () => {

        const data = {
            name: nameCategory,
            product_ids: []
        }
        fetch('http://192.168.8.187:8000/api/add-category/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        })
            .then((response) => response.ok && navigation.navigate('Products'))
    }
    const handleEdit = () => {

        const data = {
            name: selectedCategoryName,
            product_ids: checkedProducts
        }
        const id_category = categories.find((item) => item.name === selectedCategoryName).id;

        fetch(`http://192.168.8.187:8000/api/edit-category/${id_category}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        })
            .then((response) => response.ok && navigation.navigate('Products'))


    };
    return (
        <View flex={1} bgColor={'#070f2b'}>
            <Navbar />
            <Box flex={1} bgColor={'#1b1a55'} margin={5} borderRadius={8}>
                <Text
                    color={'#fff'}
                    fontSize={26}
                    textAlign={'center'}
                    mt={2}>Adding Category</Text>
                <Input
                    placeholder='Name Category'
                    onChangeText={setNameCategory}
                    width={'80%'}
                    alignSelf={'center'}
                    fontSize={16}
                    bgColor={'#070f2b'}
                    borderColor={'#070f2b'}
                    mt={3} />
                <Button
                    bgColor={'#385898'}

                    width={'80%'}
                    alignSelf={'center'}
                    mt={3}
                    _text={{ fontSize: 18, fontWeight: 'bold' }}
                    onPress={handleAdd}
                >Add Category</Button>
                <Box bgColor={'silver'} width={'80%'} height={'1px'} mt={3} alignSelf={'center'}></Box>
                <Text
                    color={'#fff'}
                    fontSize={26}
                    textAlign={'center'}
                    mt={2}>Editing Category</Text>
                <Box width="80%" mt="10px" bgColor="#070f2b" alignSelf={'center'}>
                    <Select
                        selectedValue={selectedCategoryName}
                        minWidth="200"
                        accessibilityLabel="Select Category"
                        placeholder="Select Category"
                        fontSize={16}
                        _selectedItem={{
                            bg: "#9290C3",
                            color: '#fff',

                            endIcon: <CheckIcon size="5" />,
                        }}
                        mt={1}
                        onValueChange={(itemValue) => setSelectedCategoryName(itemValue)}
                        placeholderTextColor="white"
                        borderColor="#070f2b"
                        bgColor="#070f2b"
                        color={'#fff'}



                    >
                        {categories && categories.length > 0 && categories.map((option, index) => (
                            <Select.Item

                                label={option.name}
                                value={option.name}
                                key={index}
                            />
                        ))}
                    </Select>

                </Box>
                <Box height={260} width={'100%'}>
                    <ScrollView width={'75%'} alignSelf={'center'} mt={3}>
                        {products && products.length > 0 && products.map(product => (
                            <Checkbox
                                bgColor={'#070f2b'}
                                borderColor={'#070f2b'}
                                mt={2}
                                key={product.id}
                                value={product.id.toString()} // NativeBase Checkbox uses `value` to uniquely identify each Checkbox
                                isChecked={checkedProducts.includes(product.id)}
                                onChange={() => handleCheckboxChange(product.id)}
                            >
                                {product.name}
                            </Checkbox>
                        ))}
                    </ScrollView>
                </Box>

                <Button
                    width={'80%'}
                    bgColor={'#385898'}
                    alignSelf={'center'}
                    _text={{ fontSize: 18, fontWeight: 'bold' }}
                    mt={2}
                    onPress={handleEdit}
                >Edit</Button>
            </Box>
        </View>
    )
}
