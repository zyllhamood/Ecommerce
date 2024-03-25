import React from 'react'
import { Box, Flex, Stack, Text } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
export default function Review({ name, stars, comment }) {
    return (
        <Flex
            bgColor='#535C91'
            flexDir={'column'}
            alignItems={'center'}
            height={'180px'}
            pt='1'
            borderRadius={8}
            width={'240px'}
            mb='7'
        >
            <Text fontSize={20}>{name}</Text>
            <Box>
                {Array.from({ length: stars }, (_, i) => (
                    <StarIcon m={'2px'} key={i} color={i < stars ? "yellow.500" : "gray.300"} />
                ))}
            </Box>
            <Text mt='3'>{comment}</Text>
        </Flex>
    )
}
