import { makeAutoObservable } from 'mobx'

export class ErrorData {
    _errors = {
        1001: 'Credentials Expired, Please sign in again.',
        1002: 'Unauthorized, Please try again.',
    }

    statusCode = 0
    errorCode = ''
    message = 0
    /**
     *
     * @param {ErrorData} data
     */
    constructor(data) {
        makeAutoObservable(this)
        this.statusCode = data.statusCode
        this.errorCode = data.errorCode
        if (this.statusCode === 500) this.message = this._errors[this.errorCode]
        else this.message = 'Something went wrong, please try again later.'
    }
}
