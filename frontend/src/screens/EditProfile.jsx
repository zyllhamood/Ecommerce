import Reac, { useState, useEffect } from 'react'
import { Flex, Text, Input, Button } from '@chakra-ui/react';
import Navbar from '../components/Navbar';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
export default function EditProfile() {
    const navigate = useNavigate();
    const access_token = Cookies.get('access_token');
    const { userAuth, name, phone_number } = useSelector((state) => state.auth);
    const [newName, setNewName] = useState(name);
    const [newEmail, setNewEmail] = useState(userAuth);
    const [newPhone, setNewPhone] = useState(phone_number);
    const handleNavigate = () => {
        window.history.pushState({}, '', `/`);
        window.location.reload();
    };
    const alertSweet = (msg) => {
        Swal.fire({
            icon: 'success',
            title: 'success',
            text: msg,
        })
    }

    const handleButton = () => {
        const data = {
            first_name: newName,
            username: newEmail,
            email: newEmail,
            phone_number: newPhone
        }
        try {
            const req = fetch('http://127.0.0.1:8000/api/edit-profile/', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`

                },
                body: JSON.stringify(data)
            });
            console.log(req.json());

        } catch (error) {

        }

        alertSweet("Profile updated successfully");
        handleNavigate();

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
                    height={'400px'}
                    bgColor='#0d1238'
                    p='7'
                    width={400}
                    borderRadius={8}
                >
                    <Text fontSize={36} fontFamily={'InknutAntiquaRegular'}>Edit Profile</Text>
                    <Input
                        placeholder='Name'
                        bgColor={'#1B1A55'}
                        borderColor={'#1B1A55'}
                        mt='6'
                        defaultValue={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />

                    <Input
                        placeholder='Email'
                        bgColor={'#1B1A55'}
                        borderColor={'#1B1A55'}
                        mt='4'
                        defaultValue={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                    />
                    <Input
                        placeholder='Phone'
                        bgColor={'#1B1A55'}
                        borderColor={'#1B1A55'}
                        mt='4'
                        defaultValue={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
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
                    <Flex mt='4' pl='2' pr='2'>

                        <Text
                            fontFamily={'Inconsolata'}
                            color={'#989FC1'}
                            as="button"
                            _hover={{
                                color: 'silver',
                            }}
                            onClick={() => navigate('/change-password')}
                        >Change Password</Text>
                    </Flex>
                </Flex>
            </Flex>
        </>
    )
}
