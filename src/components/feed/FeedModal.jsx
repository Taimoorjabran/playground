import {
    Avatar,
    Button,
    Flex,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    Text,
    Input,
    useDisclosure,
} from '@chakra-ui/react'

import { observer } from 'mobx-react-lite'
import React, { useEffect, useRef, useState } from 'react'
import { MdGroupAdd } from 'react-icons/md'
import { useStores } from '../../store/rootStore'
import ModalHeaderComponent from '../common/ModalHeaderComponent'

const FeedModal = observer(() => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { uiStore, memberStore, selfUser } = useStores()
    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('')

    const [file, setFile] = useState(null)
    const inputFile = useRef(null)
    const [fileName, setFileName] = useState('')
    const [fileURL, setFileUrl] = useState('')

    const createFeed = async () => {
        // addFeed(data)
    }

    return (
        <>
            <input
                type="file"
                id="file"
                ref={inputFile}
                style={{ display: 'none' }}
                onChange={(event) => {
                    if (event.target.files.length > 0) {
                        setFileName(event.target.files[0].name)
                        setFileUrl(URL.createObjectURL(event.target.files[0]))
                        setFile(event.target.files[0])
                    }
                }}
            />
            <Modal
                isOpen={uiStore.modal && uiStore.modal === 'feed'}
                onClose={() => {
                    onClose()
                    uiStore.modal = ''
                }}
                size="2xl"
            >
                <ModalContent bg="secondary.100" color="grey.100" overflow="hidden">
                    <ModalHeaderComponent
                        title="Create Post"
                        icon={MdGroupAdd}
                        onClose={() => {
                            uiStore.modal = ''
                            onClose()
                        }}
                    />
                    <ModalBody bg="secondary.200">
                        <Input
                            mt={4}
                            bg="secondary.100"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Write the title of your post..."
                            _placeholder={{ color: 'grey.300', opacity: 0.5 }}
                            color="grey.100"
                            focusBorderColor="primary.100"
                        />
                        <Input
                            mt={4}
                            bg="secondary.100"
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                            placeholder="Describe your post..."
                            _placeholder={{ color: 'grey.300', opacity: 0.5 }}
                            color="grey.100"
                            focusBorderColor="primary.100"
                        />
                        <Flex direction="column" mt={4}>
                            <Text color="grey.300" my={2}>
                                {fileName}
                            </Text>
                            <Flex>
                                <Button
                                    color="grey.100"
                                    bg="secondary.300"
                                    _hover={{ color: 'primary.100', bg: 'transparent' }}
                                    onClick={() => {
                                        inputFile.current.click()
                                    }}
                                >
                                    Upload an Image
                                </Button>
                            </Flex>
                        </Flex>
                    </ModalBody>

                    <ModalFooter p={3} bg="secondary.200">
                        <Button
                            color="grey.100"
                            bg="secondary.300"
                            _hover={{ color: 'primary.100', bg: 'transparent' }}
                            mr={3}
                            onClick={() => {
                                onClose()
                                const data = new FormData()
                                data.append('file', file)
                                data.append(
                                    'data',
                                    JSON.stringify({
                                        title,
                                        description: desc,
                                        allowComments: true,
                                        _id: selfUser._id,
                                        schoolId: selfUser.schoolId,
                                    }),
                                )
                                uiStore.addFeed(data)
                                uiStore.modal = ''
                            }}
                        >
                            Create
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
})

export default FeedModal
