import {
    Avatar,
    Button,
    Flex,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    Text,
    useDisclosure,
    Divider,
} from '@chakra-ui/react'
import { CUIAutoComplete } from 'chakra-ui-autocomplete'
import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import { MdGroupAdd } from 'react-icons/md'
import { useStores } from '../../store/rootStore'
import ModalHeaderComponent from '../common/ModalHeaderComponent'

const SearchUserModal = observer(() => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { uiStore, memberStore } = useStores()
    const rootStore = useStores()
    const [selectedItems, setSelectedItems] = useState([])
    const [pickerItems, setPickerItems] = React.useState()
    const [payload, setPayload] = useState({
        classes: [],
        direct: [],
        groups: [],
    })
    const [selected, setSelected] = useState([])
    useEffect(() => {
        setPickerItems(
            memberStore.allMembers.map((x) => {
                return { value: x._id, label: x.name }
            }),
        )
        setSelectedItems([])
    }, [])

    const handleSelectedItemsChange = async (selectedItems) => {
        if (selectedItems.length > 0) {
            setSelectedItems([selectedItems.slice(-1)[0]])
            if (selectedItems.length > 0) {
                const data = await rootStore.HTTP('admin/search-user-info', {
                    userId: selectedItems.slice(-1)[0].value,
                })
                setPayload(data)
                console.log(data)
            }
        } else {
            setSelectedItems([])
            setPayload({
                classes: [],
                direct: [],
                groups: [],
            })
        }
    }

    const customRender = (selected) => {
        return (
            <Flex flexDir="row" alignItems="center" py={2}>
                <Avatar mr={2} size="sm" src={memberStore.getMember(selected.value).profilePic} />
                <Text>{selected.label}</Text>
            </Flex>
        )
    }

    const Title = ({ title }) => {
        return (
            <Flex>
                <Text bg="primary.100" color="white" rounded="full" px={2} my={2} fontSize="sm" fontWeight="semibold">
                    {title}
                </Text>
            </Flex>
        )
    }

    const Item = ({ item }) => {
        return (
            <Flex mr={2}>
                <Text
                    bg="secondary.100"
                    color="white"
                    rounded="full"
                    px={2}
                    my={2}
                    fontSize="sm"
                    fontWeight="semibold"
                    cursor="pointer"
                    borderWidth="1px"
                    borderColor={selected.find((x) => x._id === item._id) ? 'primary.100' : 'border.50'}
                    _hover={{ borderColor: 'primary.100' }}
                    onClick={() => {
                        const itx = selected.find((x) => x._id === item._id)
                        if (itx) {
                            setSelected([...selected.filter((x) => x._id !== item._id)])
                        } else {
                            setSelected([...selected, item])
                        }
                    }}
                >
                    {item.title}
                </Text>
            </Flex>
        )
    }

    return (
        <>
            <Modal
                isOpen={uiStore.modal && uiStore.modal === 'search-user'}
                onClose={() => {
                    onClose()
                    uiStore.modal = ''
                }}
                size="3xl"
            >
                <ModalContent bg="secondary.100" color="grey.100" overflow="hidden">
                    <ModalHeaderComponent
                        title="Search user logs"
                        icon={MdGroupAdd}
                        onClose={() => {
                            uiStore.modal = ''
                            onClose()
                        }}
                    />
                    <ModalBody bg="secondary.200">
                        <CUIAutoComplete
                            inputStyleProps={{
                                bg: 'secondary.100',
                                focusBorderColor: 'primary.100',
                                fontWeight: 'semibold',
                                _placeholder: { color: 'grey.300', fontWeight: 'normal' },
                            }}
                            tagStyleProps={{ bg: 'primary.100', color: 'white', h: 6 }}
                            disableCreateItem
                            itemRenderer={customRender}
                            placeholder="Start typing a name"
                            items={pickerItems}
                            listItemStyleProps={{ py: 0, my: 0 }}
                            hideToggleButton
                            highlightItemBg="primary.100"
                            listStyleProps={{ maxH: 220, overflowY: 'scroll', bg: 'secondary.100' }}
                            selectedItems={selectedItems}
                            onSelectedItemsChange={(changes) => handleSelectedItemsChange(changes.selectedItems)}
                        />
                        <Divider h="1px" bg="border.100" opacity={0.4} mb={3} />

                        <Flex direction="column">
                            <Title title="# Classes" />
                            <Flex wrap="wrap">
                                {payload.classes.map((x) => {
                                    return <Item key={x._id} item={x} />
                                })}
                            </Flex>
                        </Flex>

                        <Flex direction="column">
                            <Title title="# Rooms" />
                            {payload.groups.map((x) => {
                                return <Item key={x._id} item={x} />
                            })}
                        </Flex>

                        <Flex direction="column">
                            <Title title="# Direct Messages" />
                            <Flex wrap="wrap">
                                {payload.direct.map((item) => {
                                    return (
                                        <Flex
                                            align="center"
                                            mr={2}
                                            bg="secondary.100"
                                            rounded="full"
                                            my={2}
                                            p={1}
                                            borderWidth="1px"
                                            cursor="pointer"
                                            borderColor={
                                                selected.find((x) => x._id === item._id) ? 'primary.100' : 'border.50'
                                            }
                                            _hover={{ borderColor: 'primary.100' }}
                                            onClick={() => {
                                                const itx = selected.find((x) => x._id === item._id)
                                                if (itx) {
                                                    setSelected([...selected.filter((x) => x._id !== item._id)])
                                                } else {
                                                    setSelected([...selected, item])
                                                }
                                            }}
                                        >
                                            <Avatar src={item.profilePic} size="xs" mr={1} />
                                            <Text key={item._id} color="white" fontSize="sm" mr={1}>
                                                {item.name}
                                            </Text>
                                        </Flex>
                                    )
                                })}
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
                                uiStore.history.push('/chat/search')
                                const temp = {}
                                payload.classes.forEach((x) => {
                                    temp[x._id] = { title: x.title, type: 'class' }
                                })
                                payload.groups.forEach((x) => {
                                    temp[x._id] = { title: x.title, type: 'group' }
                                })
                                payload.direct.forEach((x) => {
                                    temp[x.direct] = { title: x.name, profilePic: x.profilePic, type: 'direct' }
                                })
                                uiStore.searchUser = { userId: selectedItems[0].value, filters: selected, all: temp }
                                uiStore.modal = ''
                            }}
                        >
                            Search
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
})

export default SearchUserModal
