/* eslint-disable no-unused-vars */
import { makeAutoObservable } from 'mobx'
import { Group, Class, AdminMessageGroup } from './classes/messageGroups'
import { RootStore } from './rootStore'

export class AdminStore {
    /**
     * @type {AdminMessageGroup[]}
     */
    baseGroup = []

    /**
     * @type {AdminMessageGroup[]}
     */
    baseClass = []

    /**
     * @type {Group[]}
     */
    groups = []

    /**
     * @type {Class[]}
     */
    classes = []

    /** @type {RootStore}*/
    root = null
    constructor(root) {
        makeAutoObservable(this)
        this.root = root
    }

    existsClass = (id) => {
        const temp = this.classes.find((cls) => cls._id === id)
        return temp !== undefined
    }

    existsGroup = (id) => {
        const temp = this.groups.find((grp) => grp._id === id)
        return temp !== undefined
    }

    classById = (id) => {
        return this.classes.find((cls) => cls._id === id)
    }

    groupById = (id) => {
        return this.groups.find((grp) => grp._id === id)
    }
    /**
     * @type {Group}
     */
    get selectedGroup() {
        if (this.root.uiStore.subSelected === 'group') {
            return this.groups.find((grp) => grp._id === this.root.uiStore.selectedId)
        } else return null
    }

    /**
     * @type {Class}
     */
    get selectedClass() {
        if (this.root.uiStore.subSelected === 'class') {
            return this.classes.find((cls) => cls._id === this.root.uiStore.selectedId)
        } else return null
    }
}
