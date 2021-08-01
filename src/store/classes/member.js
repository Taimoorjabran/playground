import { makeAutoObservable } from 'mobx'

export class Member {
    _id = ''
    name = ''
    email = ''
    guardian = ''
    schoolId = ''
    roles = ''
    karma = 0
    status = ''
    loginType = ''
    quote = ''
    profilePic = ''
    lastActive = 0
    userRoles = []

    constructor(data) {
        makeAutoObservable(this)
        this._id = data._id
        this.name = data.name
        this.email = data.email
        this.guardian = data.guardian
        this.schoolId = data.schoolId
        this.roles = data.roles
        this.karma = data.karma
        this.status = data.status
        this.loginType = data.loginType
        this.quote = data.quote
        this.profilePic = data.profilePic
        this.lastActive = data.lastActive
        this.userRoles.replace(data.userRoles)
    }
}
