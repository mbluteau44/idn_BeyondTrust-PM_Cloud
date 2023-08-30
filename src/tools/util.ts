import { AttributeChange, ConnectorError, StdAccountCreateInput, StdAccountCreateOutput, StdEntitlementListOutput } from "@sailpoint/connector-sdk"
import { Group } from "../model/group"
import { User } from "../model/user"
import { Container } from "../model/container"

export class Util {
  

    /**
     * converts user object to IDN account output
     *
     * @param {User} user User object
     * @returns {StdAccountCreateOutput} IDN account create object
     */
    public userToAccount(user: User): StdAccountCreateOutput {
        var jsonPath = require('JSONPath');
        // Formatting output for IdentityNow
                console.log('###### userToAccount user = '+JSON.stringify(user))
                const uid = user.id ? user.id : ''
                const email = user.emails[0].value ? user.emails[0].value : ''
                const groups = user.roles ? user.roles : ''
                const entitlements = user.entitlements ? user.entitlements : ''
                let groups_idn = []
                let ents_idn = []
                console.log('##### user id = '+uid)
                console.log('##### # of groups = '+ groups.length+'  groups ='+JSON.stringify(groups))
                for (let index = 0; index < groups.length; ++index) {
                    console.log('######## group = '+JSON.stringify(groups[index].value))
                        groups_idn.push(groups[index].value)
                }
                console.log('##### # of entitlements = '+ entitlements.length+'  entitlements ='+JSON.stringify(entitlements))
                for (let indexE = 0; indexE < entitlements.length; ++indexE) {
                    console.log('######## entitlements = '+JSON.stringify(entitlements[indexE].value))
                        ents_idn.push(entitlements[indexE].value)
                }
        return {
            // Convert id to string because IDN doesn't work well with number types for the account ID
            identity: user.id ? user.id : '',
            uuid: user.id ? user.id : '',
            attributes: {
                id: user.id ? user.id : '',
                userName: user.userName ? user.userName : '',
                timezone: user.timezone ? user.timezone : '',
                locale: user.locale ? user.locale : '',
                email: email,
                active: user.active ? user.active : true,
                roles: groups_idn,
                entitlements: ents_idn
            }
        }
    }

    /**
     * converts group object to IDN Entitlement List Output
     *
     * @param {Group} group group object
     * @returns {StdAccountCreateOutput} IDN Entitlement List Output
     */
    public groupToEntitlement(group: Group): StdEntitlementListOutput {
//        const groupId = 'g:'+group.id.toString()
        const groupId = group.name
        let allowPermissions = []
        if (group.allowPermissions) {
            for(const allowPermission of group.allowPermissions){
            console.log('resource = '+JSON.stringify(allowPermission))
            allowPermissions.push(allowPermission['resource']+'::'+allowPermission['action'])
        }
    }
        let denyPermissions = []
        if (group.denyPermissions) {
            for(const denyPermission of group.denyPermissions){
            console.log('DENY resource = '+JSON.stringify(denyPermission))
            denyPermissions.push(denyPermission['resource']+'::'+denyPermission['action'])
        }
    }
        return {
            identity: groupId,
            uuid: groupId,
            type: 'roles',
            attributes: {
                id: groupId,
                name: group.name,
                allowPermissions: allowPermissions,
                denyPermissions: denyPermissions
            }
        }
    }

    /**
     * converts container object to IDN Entitlement List Output
     *
     * @param {Container} container container object
     * @returns {StdAccountCreateOutput} IDN Entitlement List Output
     */
    public containerToEntitlement(container: Container): StdEntitlementListOutput {
        const containerId = 'c:'+container.id?.toString()
        return {
            identity: containerId,
            uuid: containerId,
            type: 'group',
            attributes: {
                id: containerId,
                name: 'CONTAINER::'+container.name,
                displayName: container.displayName,
                description: container.description,
                managedAccounts: container.privilegedData,
                memberOf: container.memberOf
            }
        }
    }

    /**
     * converts user object to IDN account output
     *
     * @param {User} user User object
     * @returns {StdAccountCreateOutput} IDN account create object
     */
    public userToAccount_report(user: User,report: []): StdAccountCreateOutput {
        var jsonPath = require('JSONPath');
        // Formatting output for IdentityNow
        console.log('###### userToAccount user = '+JSON.stringify(user))
        const uid = user.id ? user.id : ''
        const email = user.emails[0].value ? user.emails[0].value : ''
        const roles = user.roles ? user.roles : ''
let groups_idn = []
        console.log('##### user id = '+uid)
        console.log('##### # of roles = '+ roles.length+'  roles ='+JSON.stringify(roles))
        for (let index = 0; index < roles.length; ++index) {
            console.log('######## role = '+JSON.stringify(roles[index].value))
                groups_idn.push(roles[index].value)
        }
return {
    // Convert id to string because IDN doesn't work well with number types for the account ID
    identity: user.id ? user.id : '',
    uuid: user.id ? user.id : '',
    attributes: {
        id: user.id ? user.id : '',
        userName: user.userName ? user.userName : '',
        email: email,
        timezone: user.timezone ? user.timezone : '',
        locale: user.locale ? user.locale : '',
        groups: groups_idn
}
}
}


}
