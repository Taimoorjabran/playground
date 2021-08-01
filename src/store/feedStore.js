/* eslint-disable no-unused-vars */
import { makeAutoObservable } from 'mobx'
import { Feed } from './classes/feed'
import { RootStore } from './rootStore'

export class FeedStore {
    /**
     * @type {Feed[]}
     */
    feed = []
    /**
     * @type {RootStore}
     */
    root = null
    constructor(root) {
        makeAutoObservable(this)
        this.root = root
    }

    fetch = async () => {
        const result = await this.root.HTTP('feed/get')

        this.feed.replace(result.map((x) => new Feed(x)))
    }

    remove = async (feed) => {
        await this.root.HTTP('feed/remove', { feed })
        this.feed.replace(this.feed.filter((x) => x._id !== feed))
    }
}
