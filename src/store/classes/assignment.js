/* eslint-disable no-unused-vars */
import { makeAutoObservable } from 'mobx'
import { RootStore } from '../rootStore'
import { Message } from './message'
export class Assignment {
    _id = ''
    dueOn = 0
    description = ''
    title = ''
    link = ''
    linkTitle = ''
    /**
     * @type {Message[]}
     */
    messages = []
    /**
     * @type {RootStore}
     */
    root = null
    constructor(data, root) {
        makeAutoObservable(this)
        this._id = data._id
        this.dueOn = data.dueOn
        this.description = data.description
        this.title = data.title
        this.link = data.link
        this.linkTitle = data.linkTitle
        this.root = root
        this.messages.replace(data.messages?.map((item) => new Message(item, root)))
    }
}
