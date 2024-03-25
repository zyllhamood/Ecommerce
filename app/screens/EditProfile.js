import React, { useState, useEffect } from 'react'
import { Box, Text, View, Button, Input, Pressable } from 'native-base';
import Navbar from '../components/Navbar';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { get_info } from '../store/authSlice';

export default function EditProfile() {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const { name, userAuth, phone_number, isLoading, token } = useSelector((state) => state.auth);
    const [namex, setNamex] = useState(name);
    const [emailx, setEmailx] = useState(userAuth);
    const [phonex, setPhonex] = useState(phone_number);
    useEffect(() => {
        if (token !== null) {
            dispatch(get_info(token))
        }
    }, [token])
    const handleButton = () => {
        const data = {
            first_name: namex,
            username: emailx,
            email: emailx,
            phone_number: phone_number
        }
        try {
            fetch('http://192.168.8.187:8000/api/edit-profile/', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`

                },
                body: JSON.stringify(data)
            })
            alert('Success Editing Profile');
            navigation.navigate("Products");

        } catch (error) {

        }

        // alertSweet("Profile updated successfully");
        // handleNavigate();
    }
    return (
        <Box flex={1} bgColor={'#070f2b'}>
            <Navbar />
            <View flex={1} margin={8}>
                <Box
                    display={'flex'}
                    height={'80%'}
                    width={'100%'}
                    justifyContent={'center'}

                >
                    <Box
                        display={'flex'}
                        bgColor={'#0d1238'}
                        width={'100%'}
                        height={'400px'}
                        borderRadius={8}
                        alignItems={'center'}
                        marginTop={20}
                    >
                        <Text
                            margin={8}
                            color={'#fff'}
                            fontSize={28}
                            alignSelf={'start'}
                        >Edit Profile</Text>
                        <Input
                            placeholder='Name'
                            width={'80%'}
                            fontSize={18}
                            bgColor={'#1b1a55'}
                            borderColor={'#1b1a55'}
                            marginBottom={4}
                            onChangeText={setNamex}
                            defaultValue={name}
                            color={'#fff'}
                        />
                        <Input
                            placeholder='Email'
                            width={'80%'}
                            fontSize={18}
                            bgColor={'#1b1a55'}
                            borderColor={'#1b1a55'}
                            marginBottom={4}
                            onChangeText={setEmailx}
                            defaultValue={userAuth}
                            color={'#fff'}
                        />
                        <Input
                            placeholder='Phone Number'
                            color={'#fff'}
                            width={'80%'}
                            fontSize={18}
                            bgColor={'#1b1a55'}
                            borderColor={'#1b1a55'}
                            marginBottom={4}
                            onChangeText={setPhonex}
                            defaultValue={phone_number}
                        />
                        <Button
                            bgColor={'#535c91'}
                            width={'80%'}
                            _text={{ fontSize: 20 }}
                            borderRadius={26}
                            marginTop={2}
                            onPress={handleButton}
                        >
                            {isLoading ? 'Loading ...' : 'Submit'}
                        </Button>
                        <Box
                            display={'flex'}
                            flexDirection={'row'}
                            width={'80%'}
                            justifyContent={'space-between'}
                            marginTop={4}

                        >
                            <Pressable>
                                <Text
                                    color={'#989FC1'}

                                >Change Password</Text>
                            </Pressable>


                        </Box>
                    </Box>
                </Box>
            </View >
        </Box>
    )
}
