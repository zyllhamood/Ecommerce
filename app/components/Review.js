import React from 'react';
import { Box, VStack, Text, Icon } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

export default function Review({ name, stars, comment }) {
    return (
        <VStack
            bg='#535C91'
            flexDirection='column'
            alignItems='center'
            maxHeight='180px'
            pb='10px'
            pt='1'
            borderRadius='8'
            width='240px'
            mb='7'
            space={2} // NativeBase uses the `space` prop for consistent spacing between children.
        >
            <Text fontSize='lg' fontWeight={'bold'}>{name}</Text>
            <Box flexDirection="row" alignItems="center">
                {Array.from({ length: stars }, (_, i) => (
                    <Icon
                        as={<MaterialIcons name={i < stars ? "star" : "star-border"} />}
                        size='5' // You can adjust the size to match your design.
                        m='1' // Margin all around
                        key={i}
                        color={i < stars ? "yellow.500" : "gray.300"}
                    />
                ))}
            </Box>
            <Text pl={3} pr={3} textAlign={'center'}>{comment}</Text>
        </VStack>
    );
}
