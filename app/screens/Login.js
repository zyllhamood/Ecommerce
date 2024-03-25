import React, { useState, useEffect, useRef } from 'react'
import { Box, Text, Button, View, ScrollView, Input } from 'native-base';
import Navbar from '../components/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/authSlice';
import { useNavigation } from '@react-navigation/native';
export default function Login() {
    const navigation = useNavigation();
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const { isLoading, wrongLogin, isLogged } = useSelector((state) => state.auth)
    const dispatch = useDispatch();
    const handleLogin = () => {
        const data = {
            username: email,
            password
        }
        dispatch(login(data))
    }


    useEffect(() => {
        if (isLogged) {
            navigation.navigate('Products');
        }
    }, [isLoading, isLogged, wrongLogin])
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
                        >Login</Text>
                        <Input
                            placeholder='Email'
                            width={'80%'}
                            fontSize={18}
                            bgColor={'#1b1a55'}
                            borderColor={'#1b1a55'}
                            marginBottom={4}
                            onChangeText={setEmail}
                            color={'#fff'}
                        />
                        <Input
                            placeholder='Password'
                            color={'#fff'}
                            width={'80%'}
                            fontSize={18}
                            bgColor={'#1b1a55'}
                            borderColor={'#1b1a55'}
                            type='password'
                            marginBottom={4}
                            onChangeText={setPassword}
                        />
                        <Button
                            bgColor={'#535c91'}
                            width={'80%'}
                            _text={{ fontSize: 20 }}
                            borderRadius={26}
                            marginTop={2}
                            onPress={handleLogin}
                        >
                            {isLoading ? 'Loading ...' : 'Login'}
                        </Button>
                        <Box
                            display={'flex'}
                            flexDirection={'row'}
                            width={'80%'}
                            justifyContent={'space-between'}
                            marginTop={4}

                        >
                            <Text
                                color={'#989FC1'}
                            >Forget Password</Text>
                            <Text
                                color={'#989FC1'}
                            >Sign Up</Text>
                        </Box>
                    </Box>
                </Box>
            </View >
        </Box>
    )
}
