import { AttributeChange, ConnectorError, StdAccountCreateInput, StdAccountCreateOutput, StdEntitlementListOutput } from "@sailpoint/connector-sdk"
import { Group } from "../model/group"
import { User } from "../model/user"

export class Util {
  

    /**
     * converts user object to IDN account output for BeyondInsight for Unix & Linux
     *
     * @param {User} user User object
     * @returns {StdAccountCreateOutput} IDN account create object
     */
    public userToAccount(user: User): StdAccountCreateOutput {

        return {
            // Convert id to string because IDN doesn't work well with number types for the account ID
            identity: user.id ? user.id : '',
            uuid: user.id ? user.id : '',
            attributes: {
                id: user.id ? user.id : '',
                hostType: user.hostType ? user.hostType : '',
                created: user.created ? user.created : '',
                adapterVersion: user.adapterVersion ? user.adapterVersion : '',
                agentVersion: user.agentVersion ? user.agentVersion : '',
                authorisationState: user.authorisationState ? user.authorisationState : '',
                authorised: user.authorised ? user.authorised : '',
                lastConnected: user.lastConnected ? user.lastConnected : '',
                deactivated: user.deactivated ? user.deactivated : false,
                autoDeactivated: user.autoDeactivated ? user.autoDeactivated : false,
                pendingDeactivation: user.pendingDeactivation ? user.pendingDeactivation : false,
                deactivatedOn: user.deactivatedOn ? user.deactivatedOn : '',
                group: user.groupId ? user.groupId : '',
                groupName: user.groupName ? user.groupName : '',
                policyId: user.policyId ? user.policyId : '',
                policyName: user.policyName ? user.policyName : '',
                policyRevision: user.policyRevision ? user.policyRevision : -1,
                policyRevisionStatus: user.policyRevisionStatus ? user.policyRevisionStatus : '',
                macAddress: user.macAddress ? user.macAddress : '',
                osArchitecture: user.osArchitecture ? user.osArchitecture : '',
                osCaption: user.osCaption ? user.osCaption : '',
                osCodeSet: user.osCodeSet ? user.osCodeSet : '',
                osComputerDescription: user.osComputerDescription ? user.osComputerDescription : '',
                osCountryCode: user.osCountryCode ? user.osCountryCode : '',
                osInstallDate: user.osInstallDate ? user.osInstallDate : '',
                osManufacturer: user.osManufacturer ? user.osManufacturer : '',
                osOrganization: user.osOrganization ? user.osOrganization : '',
                osSerialNumber: user.osSerialNumber ? user.osSerialNumber : '',
                osSystemDirectory: user.osSystemDirectory ? user.osSystemDirectory : '',
                osSystemDrive: user.osSystemDrive ? user.osSystemDrive : '',
                osVersion: user.osVersion ? user.osVersion : '',
                osVersionString: user.osVersionString ? user.osVersionString : '',
                processorCaption: user.processorCaption ? user.processorCaption : '',
                processorDescription: user.processorDescription ? user.processorDescription : '',
                processorManufacturer: user.processorManufacturer ? user.processorManufacturer : '',
                processorName: user.processorName ? user.processorName : '',
                systemDnsHostName: user.systemDnsHostName ? user.systemDnsHostName : '',
                systemDomain: user.systemDomain ? user.systemDomain : '',
                systemManufacturer: user.systemManufacturer ? user.systemManufacturer : '',
                systemModel: user.systemModel ? user.systemModel : '',
                systemName: user.systemName ? user.systemName : '',
                systemPrimaryOwnerName: user.systemPrimaryOwnerName ? user.systemPrimaryOwnerName : '',
                systemSystemType: user.systemSystemType ? user.systemSystemType : '',
                systemWorkgroup: user.systemWorkgroup ? user.systemWorkgroup : ''
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
        return {
            identity: group.id,
            uuid: group.id,
            type: 'group',
            attributes: {
                id: group.id,
                name: group.name,
                description: group.description,
                computerCount: group.computerCount,
                activeComputers: group.activeComputers,
                created: group.created,
                policyRevisionId: group.policyRevisionId,
                policyId: group.policyId,
                policyRevisionStatus: group.policyRevisionStatus,
                policyName: group.policyName,
                revision: group.revision,
                default: group.default,
                locked: group.locked,
                errorInfo: group.errorInfo
             }
        }
    }


}