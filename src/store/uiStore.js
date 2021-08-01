/* eslint-disable no-unused-vars */
import { makeAutoObservable } from 'mobx'
import { Assignment } from './classes/assignment'
import { DICT } from './classes/localize'
import { Member } from './classes/member'
import { Message } from './classes/message'
import { Class, Group } from './classes/messageGroups'
import { RootStore } from './rootStore'

export class UIStore {
    selected = ''
    subSelected = ''
    innerSelected = ''
    innerSelectedId = ''
    selectedId = ''
    theme = localStorage.getItem('fl_theme') ? localStorage.getItem('fl_theme') : 'dark'
    modal = ''
    selectedRole = ''
    searchUser = ''
    dependant = ''
    history = null
    /**
     * @type {RootStore}
     */
    root = null
    constructor(root) {
        makeAutoObservable(this)
        this.root = root
        this.selected = ''
    }
    switchTheme = () => {
        if (this.theme === 'light') this.theme = 'dark'
        else this.theme = 'light'
        localStorage.setItem('fl_theme', this.theme)
    }

    /**@type {Message[]} */
    get messages() {
        const selectedClass =
            this.selectedRole === 'admin' ? this.root.adminStore.selectedClass : this.root.classStore.selectedClass
        let selectedGroup

        if (this.selectedRole === 'admin') {
            if (this.root.groupStore.exists(this.selectedId)) {
                selectedGroup = this.root.groupStore.selectedGroup
            } else {
                selectedGroup = this.root.adminStore.selectedGroup
            }
        } else {
            selectedGroup = this.root.groupStore.selectedGroup
        }

        if (this.selected === 'chat' || this.selected === 'admin') {
            if (this.subSelected === 'class') {
                if (this.innerSelected === 'announcement') {
                    return selectedClass?.announcements
                } else if (this.innerSelected === 'assignment') {
                    return selectedClass.selectedAssignment?.messages
                } else {
                    return selectedClass?.messages
                }
            } else if (this.subSelected === 'group') {
                return selectedGroup?.messages
            } else if (this.subSelected === 'direct') {
                return this.root.directStore.selectedDirect?.messages
            } else return []
        } else return []
    }

    removeMessage = async (id) => {
        console.log(id)
        await this.root.HTTP('class/remove-message', { messageId: id })
        if (this.subSelected === 'class') {
            if (this.innerSelected === 'announcement') {
                const item = this.root.classStore.selectedClass.announcements
                item.replace(item.filter((data) => data._id !== id))
            } else if (this.innerSelected === 'assignment') {
                const item = this.root.classStore.selectedClass.selectedAssignment
                item.messages.replace(item.messages.filter((msg) => msg._id !== id))
            } else {
                const item = this.root.classStore.selectedClass
                item.messages.replace(item.messages.filter((msg) => msg._id !== id))
            }
        } else if (this.subSelected === 'group') {
            const item = this.root.groupStore.selectedGroup
            item.messages.replace(item.messages.filter((msg) => msg._id !== id))
        } else if (this.subSelected === 'direct') {
            const item = this.root.directStore.selectedDirect
            item.messages.replace(item.messages.filter((msg) => msg._id !== id))
        } else return []
    }

    crud = async ({ title, description, isPrivate, link, linkTitle, remove, daily }) => {
        if (this.modal.includes('create')) {
            if (this.modal.includes('class')) {
                const result = await this.root.HTTP('class/create-class', { title })
                result.members.map((x) => {
                    this.root.memberStore.members.set(x._id, x)
                })
                this.root.classStore.classes.push(new Class(result.class, this.root))
            } else if (this.modal.includes('group')) {
                const result = await this.root.HTTP('user/create-group', {
                    title,
                    description,
                    isPrivate,
                    isGuidance: !this.modal.includes('group'),
                })
                this.root.groupStore.group.push(new Group(result, this.root))
            } else {
                const result = await this.root.HTTP('assignment/create', {
                    title,
                    description,
                    classId: this.selectedId,
                    link,
                    linkTitle,
                })
                this.root.classStore.selectedClass.assignments.push(new Assignment(result, this.root))
            }
        } else if (this.modal.includes('edit')) {
            if (this.modal.includes('class')) {
                await this.root.HTTP('class/edit-class', { title, classId: this.selectedId, dailyMessage: daily })
                this.root.classStore.selectedClass.title = title
                this.root.classStore.selectedClass.dailyMessage = daily
            } else if (this.modal.includes('assignment')) {
                if (!remove) {
                    await this.root.HTTP('assignment/update', {
                        title,
                        assignmentId: this.innerSelectedId,
                        description,
                        link,
                        linkTitle,
                    })
                    this.root.classStore.selectedClass.selectedAssignment.title = title
                    this.root.classStore.selectedClass.selectedAssignment.description = description
                    this.root.classStore.selectedClass.selectedAssignment.link = link
                    this.root.classStore.selectedClass.selectedAssignment.linkTitle = linkTitle
                    this.root.showToast(
                        this.root.classStore.selectedClass.selectedAssignment.title + ' successfully updated!',
                        '',
                        'success',
                    )
                } else {
                    await this.root.HTTP('assignment/remove', {
                        classId: this.selectedId,
                        assignmentId: this.innerSelectedId,
                    })
                    let oldId = this.innerSelectedId
                    this.root.showToast(
                        this.root.classStore.selectedClass.selectedAssignment.title + ' successfully deleted!',
                        '',
                        'success',
                    )
                    this.innerSelected = ''
                    this.innerSelectedId = ''
                    this.history.push(`/chat/class/${this.selectedId}`)
                    this.root.classStore.selectedClass.assignments.replace(
                        this.root.classStore.selectedClass.assignments.filter((x) => x._id !== oldId),
                    )
                }
            } else {
                if (remove) {
                    await this.root.HTTP('user/remove-group', { groupId: this.selectedId })
                    this.root.groupStore.group.replace(
                        this.root.groupStore.group.filter((x) => x._id !== this.selectedId),
                    )
                } else {
                    await this.root.HTTP('user/edit-group', {
                        groupId: this.selectedId,
                        title,
                        description,
                        isPrivate,
                        isGuidance: !this.modal.includes('group'),
                    })
                    this.root.groupStore.selectedGroup.title = title
                    this.root.groupStore.selectedGroup.description = description
                    this.root.groupStore.selectedGroup.isPrivate = isPrivate
                }
            }
        }
    }

    addPeople = async (users) => {
        if (this.subSelected === 'direct' || this.subSelected === 'group') {
            const data = await this.root.HTTP('user/invite-users', {
                type: this.subSelected,
                typeId: this.selectedId,
                users,
            })
            if (this.subSelected === 'direct') {
                users.map((x) => {
                    this.root.directStore.selectedDirect.members.push(this.root.memberStore.getMember(x))
                })
            } else {
                users.map((x) => {
                    this.root.groupStore.selectedGroup.members.push(this.root.memberStore.getMember(x))
                })
            }
        }
    }

    get searchUserDetail() {
        return this.root.memberStore.getMember(this.searchUser.userId)
    }

    get selectedTitle() {
        let result = this.root.t(DICT.message)
        let selectedClass =
            this.selectedRole === 'admin' ? this.root.adminStore.selectedClass : this.root.classStore.selectedClass
        let selectedGroups =
            this.selectedRole === 'admin' ? this.root.adminStore.selectedGroup : this.root.groupStore.selectedGroup
        if (this.selected === 'chat' || this.selectedRole === 'admin') {
            if (this.subSelected === 'class') {
                if (this.innerSelected === 'announcement') {
                    result += ' #' + this.root.t(DICT.announcements)
                } else if (this.innerSelected === 'assignment') {
                    result += ' #' + selectedClass.selectedAssignment.title
                } else {
                    result += ' #' + selectedClass?.title
                }
            } else if (this.subSelected === 'group') {
                result += ' #' + selectedGroups?.title
            } else if (this.subSelected === 'direct') {
                result += this.root.directStore.selectedDirect.otherMemeberNames(50)
            }
        }
        return result
    }

    addFeed = async (payload) => {
        const data = await this.root.HTTP('feed/create', payload)
        console.log(data)
        if (!data.user) {
            data.user._id = this.root.selfUser._id
            data.name = this.root.selfUser.name
            data.profilePic = this.root.selfUser.profilePic
        }
        this.root.feedStore.feed.push(data)
    }

    get scrollCSS() {
        return {
            '&::-webkit-scrollbar': {
                width: '4px',
            },
            '&::-webkit-scrollbar-track': {
                width: '6px',
            },
            '&::-webkit-scrollbar-thumb': {
                background: this.theme === 'dark' ? '#4d4d4d' : '#d6d6d6',
                borderRadius: '24px',
            },
        }
    }
}
