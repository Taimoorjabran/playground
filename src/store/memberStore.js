/* eslint-disable no-unused-vars */
import { makeAutoObservable, get, observable, toJS } from 'mobx'
import { Member } from './classes/member'
import { RootStore } from './rootStore'

export class MemberStore {
    /**
     * @type {observable.map}
     */
    members = new observable.map()
    /**
     * @type {RootStore}
     */
    root = null
    constructor(root) {
        makeAutoObservable(this)
        this.root = root
    }

    get allMembers() {
        const result = []
        this.members.forEach((key) => {
            result.push(key)
        })
        return result
    }

    get otherMembers() {
        const result = []
        this.members.forEach((key) => {
            if (this.root.uiStore.selectedRole === 'admin') {
                if (
                    this.root.uiStore.subSelected === 'class' &&
                    !this.root.adminStore.selectedClass.containsMember(key._id)
                ) {
                    result.push(key)
                } else if (this.root.uiStore.subSelected === 'group') {
                    if (this.root.groupStore.exists(this.root.uiStore.selectedId)) {
                        if (!this.root.groupStore.selectedGroup.containsMember(key._id)) result.push(key)
                    } else {
                        if (!this.root.adminStore.selectedGroup.containsMember(key._id)) {
                            result.push(key)
                        }
                    }
                }
            } else {
                if (
                    this.root.uiStore.subSelected === 'class' &&
                    !this.root.classStore.selectedClass.containsMember(key._id)
                ) {
                    result.push(key)
                } else if (
                    this.root.uiStore.subSelected === 'group' &&
                    !this.root.groupStore.selectedGroup.containsMember(key._id)
                ) {
                    result.push(key)
                } else if (
                    this.root.uiStore.subSelected === 'direct' &&
                    !this.root.directStore.selectedDirect.containsMember(key._id)
                ) {
                    result.push(key)
                }
            }
        })
        return result
    }
    /**
     *
     * @param {*} _id
     * @returns {Member}
     */
    getMember(_id) {
        return toJS(this.members.get(_id))
    }
}
