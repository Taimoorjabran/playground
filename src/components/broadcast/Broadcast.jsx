import {
    Button,
    Code,
    Flex,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    Switch,
    Text,
    useDisclosure,
} from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { VscBroadcast } from 'react-icons/vsc'
import { useStores } from '../../store/rootStore'
import ModalHeaderComponent from '../common/ModalHeaderComponent'

const Broadcast = observer(() => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { uiStore } = useStores()

    return (
        <Modal
            isOpen={uiStore.modal && uiStore.modal.includes('broadcast')}
            onClose={() => {
                onClose()
                uiStore.modal = ''
            }}
            size="4xl"
        >
            <ModalContent bg="secondary.100" color="grey.100" overflow="hidden">
                <ModalHeaderComponent
                    title="Broadcast Message"
                    icon={VscBroadcast}
                    onClose={() => {
                        uiStore.modal = ''
                        onClose()
                    }}
                />
                <ModalBody bg="secondary.200">
                    <Code mt={2}>Use windows + c to add 🙂</Code>
                    <Input
                        mt={4}
                        bg="secondary.100"
                        placeholder="Enter the title"
                        _placeholder={{ color: 'grey.300' }}
                        color="grey.100"
                        focusBorderColor="primary.100"
                    />
                    <Input
                        mt={4}
                        bg="secondary.100"
                        placeholder="Enter your message"
                        _placeholder={{ color: 'grey.300' }}
                        color="grey.100"
                        focusBorderColor="primary.100"
                    />
                    <Text mt={4}>Attach Media</Text>
                    <Flex>
                        <Input
                            flex={1}
                            mt={4}
                            bg="secondary.100"
                            placeholder="Link Title"
                            _placeholder={{ color: 'grey.300' }}
                            color="grey.100"
                            mr={4}
                            focusBorderColor="primary.100"
                        />
                        <Input
                            flex={2}
                            mt={4}
                            bg="secondary.100"
                            placeholder="http://www.google.com"
                            _placeholder={{ color: 'grey.300' }}
                            color="grey.100"
                            focusBorderColor="primary.100"
                        />
                    </Flex>
                    <Button
                        color="grey.100"
                        bg="primary.100"
                        _hover={{ color: 'primary.100', bg: 'transparent' }}
                        mr={3}
                        mt={4}
                        mb={4}
                    >
                        Upload Media
                    </Button>
                    <Flex my={4}>
                        <Switch mr={4}>Send to everyone</Switch>
                        <Switch mr={4}>Faculty</Switch>
                        <Switch mr={4}>Students</Switch>
                        <Switch mr={4}>Admins</Switch>
                        <Switch mr={4}>Guardians</Switch>
                    </Flex>
                </ModalBody>

                <ModalFooter p={3} bg="secondary.200">
                    <Button
                        color="grey.100"
                        bg="secondary.300"
                        _hover={{ color: 'primary.100', bg: 'transparent' }}
                        mr={3}
                        mb={3}
                        onClick={() => {
                            onClose()
                            uiStore.modal = ''
                        }}
                    >
                        Broadcast
                    </Button>
                    <Button
                        color="grey.100"
                        bg="secondary.300"
                        _hover={{ color: 'primary.100', bg: 'transparent' }}
                        mr={3}
                        mb={3}
                        onClick={() => {
                            onClose()
                            uiStore.modal = ''
                        }}
                    >
                        Schedule for later
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
})

export default Broadcast
