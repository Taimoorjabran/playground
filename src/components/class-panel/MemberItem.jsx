import { Avatar, Circle, Flex, Icon, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { ImBook } from 'react-icons/im'
import { MdEdit } from 'react-icons/md'
import { DICT } from '../../store/classes/localize'
import { useStores } from '../../store/rootStore'

const MemberItem = observer(({ item, guardian = false, history }) => {
    const rootStore = useStores()
    const { t, uiStore } = useStores()
    const current = rootStore.classStore.selectedClass

    return (
        <Flex
            key={item?._id}
            px={5}
            color="grey.300"
            fontSize="sm"
            py={2}
            align="center"
            cursor="pointer"
            borderRightWidth={2}
            borderLeftWidth={2}
            borderRightColor="transparent"
            borderLeftColor="transparent"
            bg="secondary.100"
            _hover={{
                borderRightColor: 'blue.100',
                borderLeftColor: 'blue.100',
                bg: 'secondary.150',
            }}
            onClick={() => {
                if (!guardian && rootStore.userId !== item?._id) {
                    rootStore.directStore.addTempUser(item?._id)
                    rootStore.uiStore.innerSelected = ''
                    rootStore.uiStore.innerSelectedId = ''
                    rootStore.uiStore.subSelected = 'direct'
                    rootStore.uiStore.selectedId = item?._id
                    history.push('/chat/direct/')
                }
            }}
        >
            {guardian ? <Avatar name={item?.guardian} size="sm" /> : <Avatar src={item?.profilePic} size="sm" />}
            <Text flex={1} ml={3}>
                {guardian ? item?.guardian : item?.name}
            </Text>
            <Circle boxSize={2} bg="green.100" />
        </Flex>
    )
})

export default MemberItem
