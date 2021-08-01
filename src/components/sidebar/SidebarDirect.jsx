import React, { useState, useEffect } from 'react'
import { Box, Text, Center, Flex, Image, Circle, Icon, Avatar, Spacer, AvatarBadge } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { useStores } from '../../store/rootStore'
import { Member } from '../../store/classes/member'

const SidebarDirect = observer(({ _id, history, count = 0 }) => {
    const { directStore, uiStore } = useStores()
    const rootStore = useStores()
    const direct = directStore.findDirect(_id)
    const isSelected = uiStore.selectedId === direct._id

    return (
        <Flex
            px={5}
            py="8px"
            align="center"
            bg={isSelected ? 'secondary.100' : 'transparent'}
            fontWeight={isSelected ? 'semibold' : 'normal'}
            borderRightColor={isSelected ? 'blue.100' : 'transparent'}
            borderLeftColor={isSelected ? 'blue.100' : 'transparent'}
            borderRightWidth={2}
            borderLeftWidth={2}
            cursor="pointer"
            _hover={{
                fontWeight: 'semibold',
                borderRightColor: 'blue.100',
                borderLeftColor: 'blue.100',
                bg: 'secondary.300',
            }}
            onClick={() => {
                rootStore.uiStore.innerSelected = ''
                rootStore.uiStore.innerSelectedId = ''
                rootStore.uiStore.subSelected = 'direct'
                rootStore.uiStore.selectedId = _id
                if (!rootStore.memberStore.getMember(_id)) {
                    history.push('/chat/direct/' + _id)
                }
            }}
        >
            <Avatar src={direct.otherMembers[0].profilePic} boxSize={6}>
                {direct.otherMembers.length > 1 && (
                    <AvatarBadge borderWidth={0} bg="grey.300" boxSize={4}>
                        <Center boxSize={4} color="secondary.100" fontSize="xs">
                            {direct.otherMembers.length}
                        </Center>
                    </AvatarBadge>
                )}
            </Avatar>
            <Text
                fontSize="sm"
                ml={2}
                color={isSelected ? 'blue.100' : 'grey.100'}
                fontWeight={isSelected ? 'bold' : 'normal'}
            >
                {direct.otherMemeberNames(25)}
            </Text>
            <Spacer />
            <Text
                color={isSelected ? 'blue.100' : 'grey.100'}
                fontWeight={isSelected ? 'bold' : 'normal'}
                fontSize="sm"
                mr={2}
            >
                {count}
            </Text>
        </Flex>
    )
})

export default SidebarDirect
