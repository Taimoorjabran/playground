/* eslint-disable no-unused-vars */
import { makeAutoObservable } from 'mobx'
import { Direct } from './classes/messageGroups'
import { RootStore } from './rootStore'

export class DirectStore {
    /**
     * @type {Direct[]}
     */
    direct = []

    /** @type {RootStore}*/
    root = null
    constructor(root) {
        makeAutoObservable(this)
        this.root = root
    }

    /**
     * @type {Direct}
     */
    get selectedDirect() {
        if (this.root.uiStore.subSelected === 'direct') {
            return this.direct.find((direct) => direct._id === this.root.uiStore.selectedId)
        } else return null
    }

    findDirect = (id) => {
        return this.direct.find((direct) => direct._id === id)
    }

    addTempUser = (id) => {
        if (!this.exists(id)) {
            this.direct.push(
                new Direct(
                    {
                        _id: id,
                        members: [id, this.root.userId],
                        messages: [],
                        title: '',
                        description: '',
                    },
                    this.root,
                ),
            )
        }
    }

    exists = (id) => {
        const temp = this.direct.find((direct) => direct._id === id)
        return temp !== undefined
    }
}
