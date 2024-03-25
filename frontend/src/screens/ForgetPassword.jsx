import React, { useState, useEffect } from 'react'
import { Box, Flex, Text, Button, Input } from '@chakra-ui/react';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import Navbar from '../components/Navbar';
export default function ForgetPassword() {
    const access_token = Cookies.get('access_token');
    const handleButton = () => {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'You have to add the email sender !',
        })
    }
    return (
        <>
            <Navbar />
            <Flex
                width={'100%'}
                height={'600px'}
                alignItems="center"
                justifyContent={'center'}
            >
                <Flex
                    width={'30%'}
                    height={'130px'}
                    bgColor='#0d1238'
                    borderRadius={8}
                    flexDir={'column'}
                    alignItems={'center'}
                >
                    <Input
                        placeholder='Email'
                        width={'80%'}
                        mt='4'
                        bgColor={'#1B1A55'}
                        borderColor={'#1B1A55'}
                    />
                    <Button
                        mt='4'
                        borderRadius={26}
                        bgColor={'#535C91'}
                        color='#fff'
                        fontFamily={'InknutAntiquaRegular'}
                        onClick={handleButton}
                    >Send Reset Password</Button>
                </Flex>
            </Flex>

        </>
    )
}
