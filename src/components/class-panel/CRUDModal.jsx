import {
    Button,
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
import React, { useEffect, useState } from 'react'
import { AiFillBulb } from 'react-icons/ai'
import { FaGraduationCap } from 'react-icons/fa'
import { ImBook } from 'react-icons/im'
import { MdGroup } from 'react-icons/md'
import { useStores } from '../../store/rootStore'
import ModalHeaderComponent from '../common/ModalHeaderComponent'

const CRUDModal = observer(({ history }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { uiStore, memberStore, classStore, groupStore } = useStores()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [daily, setDaily] = useState('')
    const [linkTitle, setLinkTitle] = useState('')
    const [link, setLink] = useState('')
    const [pvt, setPvt] = useState(false)
    function getIcon() {
        if (uiStore.modal.includes('class')) return FaGraduationCap
        else if (uiStore.modal.includes('group')) return MdGroup
        else if (uiStore.modal.includes('guidance')) return AiFillBulb
        else if (uiStore.modal.includes('assignment')) return ImBook
    }

    useEffect(() => {
        if (uiStore.modal.includes('edit_class')) {
            setTitle(classStore.selectedClass.title)
            setDaily(classStore.selectedClass.dailyMessage)
        } else if (uiStore.modal.includes('edit_g')) {
            setTitle(groupStore.selectedGroup.title)
            setDescription(groupStore.selectedGroup.description)
            setPvt(groupStore.selectedGroup.isPrivate)
        } else if (uiStore.modal.includes('edit_assignment')) {
            setTitle(classStore.selectedClass.selectedAssignment.title)
            setDescription(classStore.selectedClass.selectedAssignment.description)
            setLink(classStore.selectedClass.selectedAssignment.link)
            setLinkTitle(classStore.selectedClass.selectedAssignment.linkTitle)
        } else {
            setTitle('')
            setDescription('')
        }
    }, [uiStore.modal])

    function getTitle() {
        let result = ''
        if (uiStore.modal.includes('edit')) {
            result = 'Modify '
        } else {
            result = 'Create '
        }

        if (uiStore.modal.includes('class')) result += 'Class'
        else if (uiStore.modal.includes('group')) result += 'Room'
        else if (uiStore.modal.includes('guidance')) result += 'Guidance Room'
        else if (uiStore.modal.includes('assignment')) result += 'Assignment'
        return result
    }
    return (
        <Modal
            isOpen={uiStore.modal && (uiStore.modal.includes('create') || uiStore.modal.includes('edit'))}
            onClose={() => {
                onClose()
                uiStore.modal = ''
            }}
            size="2xl"
        >
            <ModalContent bg="secondary.100" color="grey.100" overflow="hidden">
                <ModalHeaderComponent
                    title={getTitle()}
                    icon={getIcon()}
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
                        placeholder="Enter the title"
                        _placeholder={{ color: 'grey.300' }}
                        color="grey.100"
                        focusBorderColor="primary.100"
                    />
                    {uiStore.modal.includes('edit_class') && (
                        <Input
                            mt={4}
                            value={daily}
                            bg="secondary.100"
                            onChange={(e) => setDaily(e.target.value)}
                            placeholder="Daily message here..."
                            _placeholder={{ color: 'grey.300' }}
                            focusBorderColor="primary.100"
                        />
                    )}
                    {!uiStore.modal.includes('class') && (
                        <Input
                            mt={4}
                            value={description}
                            bg="secondary.100"
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter the description"
                            _placeholder={{ color: 'grey.300' }}
                            focusBorderColor="primary.100"
                        />
                    )}
                    {uiStore.modal.includes('group') && (
                        <Flex mt={6}>
                            <Text mr={3}>Is Private?</Text>
                            <Switch checked={pvt} onChange={(e) => setPvt(e.target.checked)} />
                        </Flex>
                    )}
                    {uiStore.modal.includes('assignment') && (
                        <Flex>
                            <Input
                                mt={4}
                                value={linkTitle}
                                bg="secondary.100"
                                onChange={(e) => setLinkTitle(e.target.value)}
                                placeholder="Assignment link title..."
                                _placeholder={{ color: 'grey.300' }}
                                focusBorderColor="primary.100"
                                mr={2}
                            />
                            <Input
                                ml={2}
                                mt={4}
                                value={link}
                                bg="secondary.100"
                                onChange={(e) => setLink(e.target.value)}
                                placeholder="http://drive.google.com...."
                                _placeholder={{ color: 'grey.300' }}
                                focusBorderColor="primary.100"
                            />
                        </Flex>
                    )}
                </ModalBody>

                <ModalFooter p={3} bg="secondary.200">
                    {uiStore.modal.includes('edit') && !uiStore.modal.includes('class') && (
                        <Button
                            color="white"
                            bg="red.100"
                            _hover={{ color: 'red.100', bg: 'transparent' }}
                            mr={3}
                            onClick={() => {
                                onClose()
                                uiStore.crud({ remove: true })
                                uiStore.modal = ''
                                if (!uiStore.modal.includes('assignment')) history.push('chat')
                            }}
                        >
                            Remove
                        </Button>
                    )}
                    <Button
                        color="grey.100"
                        bg="secondary.300"
                        _hover={{ color: 'primary.100', bg: 'transparent' }}
                        mr={3}
                        onClick={() => {
                            onClose()
                            uiStore.crud({ title, description, isPrivate: pvt, link, linkTitle, daily })
                            uiStore.modal = ''
                        }}
                    >
                        {uiStore.modal.includes('create') ? 'Create' : 'Update'}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
})

export default CRUDModal
