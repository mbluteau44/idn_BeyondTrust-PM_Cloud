import { Group } from "./group"

/**
 * User is a complete definition of a user, including entitlements
 */
export class User {
    id?: string
    hostType?: string
    created?: string
    adapterVersion?: string
    agentVersion?: string
    authorisationState?: string
    authorised?: string
    connected?: string
    lastConnected?: string
    deactivated?: boolean
    autoDeactivated?: boolean
    pendingDeactivation?: boolean
    deactivatedOn?: string
    groupId?: string
    groupName?: string
    policyId?: number
    policyName?: string
    policyRevision?: number
    policyRevisionStatus?: string
    macAddress?: string
    osArchitecture?: string
    osCaption?: string
    osCodeSet?: string
    osComputerDescription?: string
    osCountryCode?: string
    osInstallDate?: string
    osManufacturer?: string
    osOrganization?: string
    osSerialNumber?: string
    osSystemDirectory?: string
    osSystemDrive?: string
    osVersion?: string
    osVersionString?: string
    processorCaption?: string
    processorDescription?: string
    processorManufacturer?: string
    processorName?: string
    systemDnsHostName?: string
    systemDomain?: string
    systemManufacturer?: string
    systemModel?: string
    systemName?: string
    systemPrimaryOwnerName?: string
    systemSystemType?: string
    systemWorkgroup?: string
//    endpointInformation?: {macAddress?: string,osArchitecture?: string,osCaption?: string,osCodeSet?: string,osComputerDescription?: string,systemDomain?: string,systemName?: string,systemPrimaryOwnerName?: string}
}