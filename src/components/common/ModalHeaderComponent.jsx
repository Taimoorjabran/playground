import { Circle, CloseButton, Flex, Icon, ModalHeader, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { MdGroupAdd } from 'react-icons/md'

const ModalHeaderComponent = observer(({ icon, title, onClose }) => {
    return (
        <ModalHeader bg="primary.100" p={4}>
            <Flex direction="horizontal" align="center">
                <Circle p={2} mr={2} bg="primary.200">
                    <Icon as={icon} color="white" />
                </Circle>
                <Text color="white" flex={1}>
                    {title}
                </Text>
                <CloseButton bg="primary.200" color="white" onClick={onClose} />
            </Flex>
        </ModalHeader>
    )
})

export default ModalHeaderComponent
