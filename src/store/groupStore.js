/* eslint-disable no-unused-vars */
import { makeAutoObservable } from 'mobx'
import { Group } from './classes/messageGroups'
import { RootStore } from './rootStore'

export class GroupStore {
    /**
     * @type {Group[]}
     */
    group = []
    /** @type {RootStore}*/
    root = null
    constructor(root) {
        makeAutoObservable(this)
        this.root = root
    }

    get adminGroups() {
        return this.group.filter((x) => x.isAdmin)
    }

    filteredGroups = (guidance) => {
        return this.group.filter((x) => {
            return x.isGuidance === guidance && !x.isAdmin
        })
    }

    /**
     * @type {Group}
     */
    get selectedGroup() {
        if (this.root.uiStore.subSelected === 'group') {
            return this.group.find((grp) => grp._id === this.root.uiStore.selectedId)
        } else return null
    }

    exists = (id) => {
        const temp = this.group.find((grp) => grp._id === id)
        return temp !== undefined
    }
}
