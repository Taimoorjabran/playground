/* eslint-disable no-unused-vars */
import { makeObservable, observable, computed, action, override, toJS, makeAutoObservable } from 'mobx'
import { truncateString } from '../../utils/truncate'
import { RootStore } from '../rootStore'
import { Assignment } from './assignment'
import { Member } from './member'
import { Message } from './message'

export class Direct {
    _id = ''
    /**
     * @type  {Member[]}
     */
    members = []
    /**
     * @type {Message[]}
     */
    messages = []
    description = ''
    title = ''

    /**
     * @type {RootStore}
     */
    root = null

    constructor(data, root) {
        makeObservable(this, {
            _id: observable,
            members: observable,
            messages: observable,
            description: observable,
            title: observable,
        })
        this._id = data?._id
        this.title = data?.title
        this.root = root
        this.members.replace(
            data.members.map((x) => {
                return this.root.memberStore.getMember(x)
            }),
        )
        this.messages.replace(data.messages?.map((x) => new Message(x, root)))
        this.description = data.description
    }

    get otherMembers() {
        return this.members.filter((x) => x._id !== this.root.userId)
    }

    otherMemeberNames = (trunc = 20) => {
        let result = ''
        this.otherMembers.map((x) => (result += ' ' + x.name + ','))
        result = result.slice(0, -1)
        return truncateString(result, trunc)
    }

    get commonClasses() {
        const temp = []
        const otherMemberId = this.otherMembers[0]._id
        this.root.classStore.classes.map((cls) => {
            cls.members.map((x) => {
                if (x._id === otherMemberId) {
                    temp.push({ _id: cls._id, title: cls.title })
                }
            })
        })
        return temp
    }

    containsMember = (id) => {
        return this.members.find((x) => x._id === id)
    }
}

export class Group extends Direct {
    isPrivate = false
    isGuidance = false
    isAdmin = false
    adminType = ''
    constructor(data, root) {
        super(data, root)
        makeObservable(this, {
            isPrivate: observable,
            isGuidance: observable,
        })
        this.messages.replace(data?.messages?.map((x) => new Message(x, root)))
        this.description = data?.description
        this.isPrivate = data?.isPrivate
        this.isGuidance = data?.isGuidance
        this.isAdmin = data?.isAdmin
        this.adminType = data?.adminType
    }
}

export class Class extends Direct {
    subtitle = ''
    dailyMessage = ''
    /**
     * @type {Assignment[]}
     */
    assignments = []
    /**
     * @type {Member[]}
     */
    teachers = []
    /**
     * @type {Member[]}
     */
    teachingAssistants = []

    /**
     * @type {Message[]}
     */
    announcements = []

    constructor(data, root) {
        super(data, root)
        makeObservable(this, {
            subtitle: observable,
            dailyMessage: observable,
            assignments: observable,
            teachers: observable,
            announcements: observable,
            teachingAssistants: observable,
        })
        this.description = data.description
        this.subtitle = data.subtitle
        this.dailyMessage = data.dailyMessage
        this.announcements.replace(data.announcements?.map((x) => new Message(x, root)))
        this.teachers.replace(
            data?.teachers?.map((x) => {
                return this.root.memberStore.getMember(x)
            }),
        )
        this.teachingAssistants.replace(
            data?.teachingAssistants?.map((x) => {
                return this.root.memberStore.getMember(x)
            }),
        )
        this.assignments.replace(data.assignments?.map((x) => new Assignment(x, root)))
        this.messages.replace(data.messages?.map((x) => new Message(x, root)))
    }

    assignmentExists = (id) => {
        const temp = this.assignments.find((item) => item._id === id)
        return temp !== undefined
    }

    get selectedAssignment() {
        return this.assignments.find((x) => x._id === this.root.uiStore.innerSelectedId)
    }

    get students() {
        const ta = this.teachingAssistants.map((x) => x._id)
        return this.members.filter((x) => x.roles === 'student' && !ta.includes(x._id))
    }

    get guardians() {
        const ta = this.teachingAssistants.map((x) => x?._id)
        return this.members?.filter((x) => x.roles === 'student' && !ta.includes(x._id) && x.guardian)
    }
}

export class AdminMessageGroup {
    _id = ''
    title = ''
    constructor(data) {
        makeAutoObservable(this)
        this._id = data._id
        this.title = data.title
    }
}
