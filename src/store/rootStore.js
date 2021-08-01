import { makeAutoObservable } from 'mobx'
import { ClassStore } from './classStore'
import { DirectStore } from './directStore'
import { FeedStore } from './feedStore'
import { GroupStore } from './groupStore'
import { MemberStore } from './memberStore'
import { ErrorData } from './classes/error'
import { createContext, useContext } from 'react'
import axios from 'axios'
import { apiUrl, url } from '../constants/url'
import { UIStore } from './uiStore'
// eslint-disable-next-line no-unused-vars
import { Member } from './classes/member'
import { AdminMessageGroup, Class, Direct, Group } from './classes/messageGroups'
import { Feed } from './classes/feed'
import { Message } from './classes/message'
import { createStandaloneToast } from '@chakra-ui/react'
import { lightTheme } from '../theme/lightTheme'
import { darkTheme } from '../theme/darkTheme'
import { AdminStore } from './adminStore'
import { create } from "mobx-persist";

const hydrate = create({
  storage: localStorage,
  jsonify: true
});

export class RootStore {
    /* #region  Properties */
    token = ''
    userId = ''
    /**
     * @type {ClassStore}
     */
    classStore = null
    /**
     * @type {DirectStore}
     */
    directStore = null
    /**
     * @type {GroupStore}
     */
    groupStore = null
    /**
     * @type {FeedStore}
     */
    feedStore = null
    /**
     * @type {MemberStore}
     */
    memberStore = null
    /**
     * @type {UIStore}
     */
    uiStore = null

    /**
     * @type {AdminStore}
     */
    adminStore = null

    /**
     * @type {ErrorData}
     */
    error = null
    /* #endregion */

    language = 'en'

    constructor() {
        makeAutoObservable(this)
        this.memberStore = new MemberStore(this)
        this.classStore = new ClassStore(this)
        this.groupStore = new GroupStore(this)
        this.directStore = new DirectStore(this)
        this.feedStore = new FeedStore(this)
        this.uiStore = new UIStore(this)
        this.adminStore = new AdminStore(this)
        this.language = localStorage.getItem('lng')

        hydrate("class", this.classStore)
    }

    isLoggedIn = () => {
        return this?.token !== null && this?.token?.length > 0
    }

    login = async (accessToken) => {
        const { token } = await this.POST_NO_AUTH('account/login-google', { accessToken, role: 'teacher' })
        this.token = token
        localStorage.setItem('fl_tkn', token)
        await this.fetch()
    }

    fetch = async () => {
        const result = await this.HTTP('user/get', {}, false)
        if (result) {
            const { comms, feed, userId, admin } = result

            Object.keys(comms.members).map((x) => {
                this.memberStore.members.set(x, comms.members[x])
            })
            this.classStore.classes.replace(comms.classes.map((x) => new Class(x, this)))
            this.groupStore.group.replace(comms.groups.map((x) => new Group(x, this)))
            this.directStore.direct.replace(comms.direct.map((x) => new Direct(x, this)))
            this.feedStore.feed.replace(feed.map((x) => new Feed(x, this)))
            this.adminStore.baseClass.replace(admin.classes.map((x) => new AdminMessageGroup(x)))
            this.adminStore.baseGroup.replace(admin.groups.map((x) => new AdminMessageGroup(x)))
            this.userId = userId
            if (localStorage.getItem('fl_role')) {
                this.uiStore.selectedRole = localStorage.getItem('fl_role')
            } else this.uiStore.selectedRole = this.selfUser.userRoles[0]
        } else {
            this.uiStore.history?.push('/login')
        }
    }
    /**
     * @return {Member}
     */
    get selfUser() {
        return this.isLoggedIn() ? this.memberStore?.getMember(this.userId) : null
    }

    sendMessage = async (msg) => {
        const payload = {
            _id: this.userId,
            msg,
        }
        if (this.uiStore.subSelected === 'class') {
            if (this.uiStore.innerSelected === 'announcement') {
                payload.parentId = this.uiStore.selectedId
                payload.parentType = 'announcement'
            } else if (this.uiStore.innerSelected === 'assignment') {
                payload.parentId = this.uiStore.innerSelectedId
                payload.parentType = 'assignment'
            } else {
                payload.parentId = this.uiStore.selectedId
                payload.parentType = 'class'
            }
        } else if (this.uiStore.subSelected === 'group') {
            payload.parentId = this.uiStore.selectedId
            payload.parentType = 'group'
        } else if (this.uiStore.subSelected === 'direct') {
            payload.parentId = this.uiStore.selectedId
            payload.otherId = this.directStore.selectedDirect.otherMembers
            payload.parentType = 'direct'
        }
        const data = await this.HTTP('class/send-message', payload)
        if (!data) return
        const messageObject = new Message(data.msg, this)
        if (payload.parentType === 'class') {
            this.classStore.selectedClass.messages.push(messageObject)
        } else if (payload.parentType === 'direct') {
            if (!this.directStore.exists(data.msg.parentId)) {
                const previous = this.uiStore.selectedId
                data.direct.messages = [data.msg]
                this.directStore.direct.push(new Direct(data.direct, this))
                this.uiStore.selectedId = data.direct._id
                this.uiStore.subSelected = 'direct'
                this.directStore.direct = this.directStore.direct.filter((x) => x._id !== previous)
            } else {
                this.directStore.selectedDirect.messages.push(new Message(data.msg, this))
            }
        } else if (payload.parentType === 'group') {
            this.groupStore.selectedGroup.messages.push(messageObject)
        } else if (payload.parentType === 'assignment') {
            this.classStore.selectedClass.selectedAssignment.messages.push(messageObject)
        } else if (payload.parentType === 'announcement') {
            this.classStore.selectedClass.announcements.push(messageObject)
        }
    }

    t = (id) => {
        if (!this) {
            return id[0]
        } else {
            return id[this.language === 'en' ? 0 : 1]
        }
    }

    /* #region  HTTP Methods */
    HTTP = async (endpoint, data = {}, post = true) => {
        const config = this._getHeaders()
        if (!config) return
        let response = {}
        try {
            if (post) response = await axios.post(apiUrl + endpoint, data, config)
            else response = await axios.get(apiUrl + endpoint, config)
            return response?.data
        } catch (err) {
            this._handleError(err)
            return null
        }
    }

    POST_NO_AUTH = async (endpoint, data) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        }
        const response = await axios.post(url + endpoint, data, config).catch(this._handleError)
        return response?.data
    }

    _handleError = (err) => {
        if (err.response?.status === 500) {
            console.log(err.response)
            this.error = new ErrorData({ statusCode: err.response.status, errorCode: err.response.data })
            console.error(err.response?.data)
            if (this.error.errorCode === 1001) {
                this.token = ''
                localStorage.removeItem('fl_tkn')
            }
        } else {
            this.error = new ErrorData({
                statusCode: 400,
                errorCode: 0,
                message: 'Something went wrong, please try again.',
            })
            console.error(err)
        }
        let toast = createStandaloneToast({ theme: this.uiStore.theme === 'light' ? lightTheme : darkTheme })
        toast({
            title: this.error.message,
            status: 'error',
            duration: 5000,
            isClosable: true,
        })
    }

    showToast = (title, description = '', status = 'info', duration = 5000, isClosable = true) => {
        let toast = createStandaloneToast({ theme: this.uiStore.theme === 'light' ? lightTheme : darkTheme })
        toast({
            title,
            description,
            status,
            duration,
            isClosable,
        })
    }

    _getHeaders = () => {
        if (!this.isLoggedIn()) return null
        return {
            headers: {
                Authorization: `Bearer ${this.token}`,
                'Content-Type': 'application/json',
            },
        }
    }
    /* #endregion */
}

export const RootStoreInstance = new RootStore()

const RootStoreContext = createContext(RootStoreInstance)

export const useStores = () => useContext(RootStoreContext)
