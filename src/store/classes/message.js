/* eslint-disable no-unused-vars */
import { makeAutoObservable } from 'mobx'
import { RootStore } from '../rootStore'

export class Message {
    _id = ''
    parentId = ''
    parentType = ''
    user = ''
    msgEs = ''
    msg = ''
    createdAt = ''
    updatedAt = ''
    msgType = ''
    lastEdited = 0
    /**
     * @type {Reaction[]}
     */
    reactions = []

    /**
     * @type {RootStore}
     */
    root
    constructor(data, root) {
        makeAutoObservable(this)
        this._id = data._id
        this.parentId = data.parentId
        this.parentType = data.parentType
        this.user = data.user
        this.msg = data.msg
        this.msgEs = data.msgEs
        this.createdAt = data.createdAt
        this.updatedAt = data.updatedAt
        this.msgType = data.msgType
        this.lastEdited = data.lastEdited
        this.reactions.replace(data?.reactions.map((x) => new Reaction(x)))
        this.root = root
    }

    get message() {
        return this.root.language === 'en' ? this.msg : this.msgEs ? this.msgEs : this.msg
    }

    get userDetail() {
        return this.root.memberStore.getMember(this.user)
    }
}

export class Reaction {
    /**
     * @type {string[]}
     */
    members = []
    emoji = ''
    constructor(data) {
        makeAutoObservable(this)
        this.members.replace(data.members)
        this.emoji = data.emoji
    }
}
