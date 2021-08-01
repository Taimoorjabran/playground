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
} from '@chakra-ui/react'
import { CUIAutoComplete } from 'chakra-ui-autocomplete'
import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import { MdGroupAdd } from 'react-icons/md'
import { useStores } from '../../store/rootStore'
import ModalHeaderComponent from '../common/ModalHeaderComponent'

const InviteModal = observer(() => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { uiStore, memberStore } = useStores()
    const rootStore = useStores()
    const [selectedItems, setSelectedItems] = useState([])
    const [pickerItems, setPickerItems] = React.useState()

    useEffect(() => {
        setPickerItems(
            memberStore.otherMembers.map((x) => {
                return { value: x._id, label: x.name }
            }),
        )
        setSelectedItems([])
    }, [])

    const handleSelectedItemsChange = (selectedItems) => {
        if (selectedItems) {
            setSelectedItems(selectedItems)
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

    return (
        <>
            <Modal
                isOpen={uiStore.modal && (uiStore.modal === 'invite' || uiStore.modal === 'direct')}
                onClose={() => {
                    onClose()
                    uiStore.modal = ''
                }}
                size="2xl"
            >
                <ModalContent bg="secondary.100" color="grey.100" overflow="hidden">
                    <ModalHeaderComponent
                        title={uiStore.modal === 'direct' ? 'Direct message' : 'Add more people'}
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
                    </ModalBody>

                    <ModalFooter p={3} bg="secondary.200">
                        <Button
                            color="grey.100"
                            bg="secondary.300"
                            _hover={{ color: 'primary.100', bg: 'transparent' }}
                            mr={3}
                            onClick={() => {
                                onClose()
                                if (uiStore.modal === 'direct') {
                                    rootStore.directStore.addTempUser(selectedItems[0]?.value)
                                    rootStore.uiStore.innerSelected = ''
                                    rootStore.uiStore.innerSelectedId = ''
                                    rootStore.uiStore.subSelected = 'direct'
                                    rootStore.uiStore.selectedId = selectedItems[0]?.value
                                    rootStore.uiStore.history.push('/chat/direct/')
                                } else {
                                    uiStore.addPeople(selectedItems.map((x) => x.value))
                                }
                                uiStore.modal = ''
                            }}
                        >
                            {uiStore.modal === 'direct' ? 'Message' : 'Add'}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
})

export default InviteModal
