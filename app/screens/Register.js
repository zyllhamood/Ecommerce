import React from 'react'
import { Box, Text, Button, View, ScrollView, Input } from 'native-base';
import Navbar from '../components/Navbar';
export default function Register() {
    return (
        <>
            <Navbar />
            <View flex={7} margin={8}>
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
                        height={'500px'}
                        borderRadius={8}
                        alignItems={'center'}
                    >
                        <Text
                            margin={8}
                            color={'#fff'}
                            fontSize={28}
                            alignSelf={'start'}
                        >Sign Up</Text>
                        <Input
                            placeholder='Name'
                            width={'80%'}
                            fontSize={18}
                            bgColor={'#1b1a55'}
                            borderColor={'#1b1a55'}
                            marginBottom={4}
                        />
                        <Input
                            placeholder='Email'
                            width={'80%'}
                            fontSize={18}
                            bgColor={'#1b1a55'}
                            borderColor={'#1b1a55'}
                            marginBottom={4}
                        />
                        <Input
                            placeholder='Phone'
                            width={'80%'}
                            fontSize={18}
                            bgColor={'#1b1a55'}
                            borderColor={'#1b1a55'}
                            marginBottom={4}
                        />
                        <Input
                            placeholder='Password'
                            width={'80%'}
                            fontSize={18}
                            bgColor={'#1b1a55'}
                            borderColor={'#1b1a55'}
                            type='password'
                            marginBottom={4}
                        />
                        <Input
                            placeholder='Re-Password'
                            width={'80%'}
                            fontSize={18}
                            bgColor={'#1b1a55'}
                            borderColor={'#1b1a55'}
                            type='password'
                            marginBottom={4}
                        />
                        <Button
                            bgColor={'#535c91'}
                            width={'80%'}
                            _text={{ fontSize: 20 }}
                            borderRadius={26}
                            marginTop={2}
                        >
                            Sign Up
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
                            >You have an account ? Login</Text>

                        </Box>
                    </Box>
                </Box>
            </View >
        </>
    )
}
