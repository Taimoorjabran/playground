import { makeAutoObservable } from 'mobx'
import { RootStore } from '../rootStore'

export class Feed {
    _id = ''
    description = ''
    title = ''
    schoolId = ''
    create = ''

    pinned = false
    allowComments = true
    image = false

    /**
     * @type {FeedUser}
     */
    user = null
    /**
     * @type {Comment[]}
     */
    comments = []
    /**
     * @type {RootStore}
     */
    root = null
    constructor(data, root) {
        makeAutoObservable(this)
        this._id = data._id
        this.description = data.description
        this.title = data.title
        this.user = new FeedUser(data?.user)
        this.schoolId = data
        this.create = data.create
        this.pinned = data.pinned
        this.allowComments = data.allowComments
        this.image = data.image
        this.comments.replace(data.comments.map((item) => new Comment(item)))
        this.root = root
    }
}

export class Comment {
    _id = ''
    message = ''
    /**
     * @type {FeedUser}
     */
    user = null

    constructor(data) {
        makeAutoObservable(this)
        this._id = data?.id
        this.message = data?.message
        this.user = new FeedUser(data?.user)
    }
}

export class FeedUser {
    _id = ''
    name = ''
    profilePic = ''
    constructor(data) {
        makeAutoObservable(this)
        this._id = data?.id
        this.name = data?.name
        this.profilePic = data?.profilePic
    }
}
