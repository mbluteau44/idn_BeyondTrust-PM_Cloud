import { Container } from "./container"
/**
 * Group is Discourse's representation of a group, omitting the properties we don't need.
 */
 export class Group {
    id = ''
    name = ''
    allowPermissions = [{"resource":'',"action":''}]
    denyPermissions = [{"resource":'',"action":''}]
 }
