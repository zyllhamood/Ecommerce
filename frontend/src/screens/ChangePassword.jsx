import React, { useRef } from 'react'
import { Flex, Text, Input, Button } from '@chakra-ui/react';
import Navbar from '../components/Navbar';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
export default function ChangePassword() {
    const oldPasswordRef = useRef('');
    const newPasswordRef = useRef('');
    const rePasswordRef = useRef('');
    const navigate = useNavigate();
    const alertSweet = (msg) => {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: msg,
        })
    }

    const handleButton = () => {
        const oldPassword = oldPasswordRef.current.value;
        const newPassword = newPasswordRef.current.value;
        const rePassword = rePasswordRef.current.value;
        if (newPassword !== rePassword) return alertSweet("Passwords Not Match!");
        const data = {
            old_password: oldPassword,
            new_password: newPassword
        }
        const access_token = Cookies.get('access_token');

        fetch('http://127.0.0.1:8000/api/change-password/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`

            },
            body: JSON.stringify(data)
        });
        navigate('/');
    }
    return (
        <>
            <Navbar />
            <Flex
                width={'100%'}
                mt='70px'
                justifyContent={'center'}
            >
                <Flex
                    flexDir="column"
                    height={'360px'}
                    bgColor='#0d1238'
                    p='7'
                    width={400}
                    borderRadius={8}
                >
                    <Text fontSize={36} fontFamily={'InknutAntiquaRegular'}>Change Password</Text>
                    <Input
                        placeholder='Old Password'
                        bgColor={'#1B1A55'}
                        borderColor={'#1B1A55'}
                        mt='6'
                        ref={oldPasswordRef}
                        type='password'
                    />

                    <Input
                        placeholder='New Password'
                        bgColor={'#1B1A55'}
                        borderColor={'#1B1A55'}
                        mt='4'
                        ref={newPasswordRef}
                        type='password'
                    />
                    <Input
                        placeholder='Re-Password'
                        bgColor={'#1B1A55'}
                        borderColor={'#1B1A55'}
                        mt='4'
                        ref={rePasswordRef}
                        type='password'
                    />
                    <Button
                        bgColor='#535C91'
                        borderRadius={26}
                        mt='6'
                        fontFamily={'InknutAntiquaRegular'}
                        color={'#fff'}
                        fontSize={20}
                        onClick={handleButton}
                    >Submit</Button>

                </Flex>
            </Flex>
        </>
    )
}
