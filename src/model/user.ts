import { Group } from "./group"

/**
 * User is a complete definition of a user, including entitlements
 */
export class User {
    id?: string
    userName?: string
    timezone?: string
    locale?: string
    emails?: any
    active?: boolean
    roles?: any[]
    entitlements?: any[]
}
