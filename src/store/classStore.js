/* eslint-disable no-unused-vars */
import { action, makeAutoObservable, observable } from 'mobx'
import { Class } from './classes/messageGroups'
import { RootStore } from './rootStore'
import {decorate, persist} from 'mobx-persist'

export class ClassStore {
    /**
     * @type {Class[]}
     */
    mainClasses = []
    /**
     * @type {RootStore}
     */
    root = null

    constructor(root) {
        makeAutoObservable(this)
        this.root = root
    }

    get classes() {
        return this.mainClasses
    }

    /**
     * @type {Class}
     */
    get selectedClass() {
        if (this.root.uiStore.subSelected === 'class') {
            return this.classes.find((cls) => cls._id === this.root.uiStore.selectedId)
        } else return null
    }

    exists = (id) => {
        const temp = this.classes.find((cls) => cls._id === id)
        return temp !== undefined
    }
}

decorate(ClassStore, {
    mainClasses: [persist('list'), observable],
    classes: action,
    selectedClass: action,
    exists: action
  });
