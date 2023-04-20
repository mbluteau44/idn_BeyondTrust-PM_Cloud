// BeyondTrust Privilege Management for Windows and Mac functions
// Policy
import {
    logger
} from '@sailpoint/connector-sdk'

// =================================================
// Authentication 
// =================================================
export async function epm_auth(authUrl:any, client_id:any, client_secret:any) {

    // set the Authorization header
let base64data = Buffer.from(client_id+':'+client_secret).toString('base64')
const authorization = 'Basic '+base64data

const axios = require('axios');
const qs = require('querystring');
const data = {
    grant_type: 'client_credentials'
};
// set the headers
const config = {
    method: 'post',
    rejectUnauthorized: false,
    url: authUrl,
    data: qs.stringify(data),
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': authorization
    }
};
let res = await axios(config)
return res

}

// =================================================
// GET all Computers with details 
// =================================================
export async function epm_GET_computers_details(instance:any, token:any) {

const axios = require('axios');
const qs = require('querystring');

// set the headers
const config = {
    method: 'get',
    rejectUnauthorized: false,
    url: instance + '/management-api/v1/Computers',
    headers: {
        'Accept': 'application/json',
        'Authorization': token
    }
};
let resComputers = await axios(config)

console.log('Computers = '+ JSON.stringify(resComputers.data.data))

const computersCount = resComputers.data.data.length
let computers = []
for (let computerIndex = 1 - 1; computerIndex < computersCount && (computerIndex + 1 - 1) < computersCount; ++computerIndex) {
//    const configDetails = {
//        method: 'get',
//        rejectUnauthorized: false,
//        url: instance + '/management-api/v1/Computers/'+resComputers.data.data[computerIndex].id,
//        headers: {
//            'Accept': 'application/json',
//            'Authorization': token
//        }
//    };
    let resComputerDetails = await epm_GET_computer(instance, token, resComputers.data.data[computerIndex].id)
    computers.push(resComputerDetails)
}    

return computers

}

// =================================================
// GET a Computer
// =================================================
export async function epm_GET_computer(instance:any, token:any, ID:any) {

    const axios = require('axios');
    const qs = require('querystring');
    
    // set the headers
    const config = {
        method: 'get',
        rejectUnauthorized: false,
        url: instance + '/management-api/v1/Computers/'+ID,
        headers: {
            'Accept': 'application/json',
            'Authorization': token
        }
    };
    let res = await axios(config)
    
    console.log('Get a Computer epm-functions = '+JSON.stringify(res.data))
    const computer = {
    "id":res.data.id,
    "hostType":res.data.hostType,
    "created":res.data.created,
    "adapterVersion":res.data.adapterVersion,
    "agentVersion":res.data.agentVersion,
    "authorisationState":res.data.authorisationState,
    "authorised":res.data.authorised,"connected":res.data.connected,
    "lastConnected":res.data.lastConnected,
    "deactivated":res.data.deactivated,"autoDeactivated":res.data.autoDeactivated,
    "pendingDeactivation":res.data.pendingDeactivation,
    "deactivatedOn":res.data.deactivatedOn,
    "groupId":res.data.groupId,
    "groupName":res.data.groupName,
    "policyId":res.data.policyId,
    "policyName":res.data.policyName,
    "policyRevision":res.data.policyRevision,
    "policyRevisionStatus":res.data.policyRevisionStatus,
    "macAddress":res.data.endpointInformation.macAddress,
    "osArchitecture":res.data.endpointInformation.osArchitecture,
    "osCaption":res.data.endpointInformation.osCaption,
    "osCodeSet":res.data.endpointInformation.osCodeSet,
    "osComputerDescription":res.data.endpointInformation.osComputerDescription,
    "osCountryCode":res.data.endpointInformation.osCountryCode,
    "osInstallDate":res.data.endpointInformation.osInstallDate,
    "osManufacturer":res.data.endpointInformation.osManufacturer,
    "osOrganization":res.data.endpointInformation.osOrganization,
    "osSerialNumber":res.data.endpointInformation.osSerialNumber,
    "osSystemDirectory":res.data.endpointInformation.osSystemDirectory,
    "osSystemDrive":res.data.endpointInformation.osSystemDrive,
    "osVersion":res.data.endpointInformation.osVersion,
    "osVersionString":res.data.endpointInformation.osVersionString,
    "processorCaption":res.data.endpointInformation.processorCaption,
    "processorDescription":res.data.endpointInformation.processorDescription,
    "processorManufacturer":res.data.endpointInformation.processorManufacturer,
    "processorName":res.data.endpointInformation.processorName,
    "systemDnsHostName":res.data.endpointInformation.systemDnsHostName,
    "systemDomain":res.data.endpointInformation.systemDomain,
    "systemManufacturer":res.data.endpointInformation.systemManufacturer,
    "systemModel":res.data.endpointInformation.systemModel,
    "systemName":res.data.endpointInformation.systemName,
    "systemPrimaryOwnerName":res.data.endpointInformation.systemPrimaryOwnerName,
    "systemSystemType":res.data.endpointInformation.systemSystemType,
    "systemWorkgroup":res.data.endpointInformation.systemWorkgroup
    }
    return computer
    
    }

// =================================================
// GET all Computer Groups
// =================================================
export async function epm_GET_computer_groups(instance:any, token:any) {

    const axios = require('axios');
    const qs = require('querystring');
    
    // set the headers
    const config = {
        method: 'get',
        rejectUnauthorized: false,
        url: instance + '/management-api/v1/Groups',
        headers: {
            'Accept': 'application/json',
            'Authorization': token
        }
    };
    let resGroups = await axios(config)
    
    console.log('Computer Groups = '+ JSON.stringify(resGroups.data))
    
    return resGroups
    
    }
   
// =================================================
// GET a Computer Group
// =================================================
export async function epm_GET_computer_group(instance:any, token:any, ID:any) {

    const axios = require('axios');
    const qs = require('querystring');
    
    // set the headers
    const config = {
        method: 'get',
        rejectUnauthorized: false,
        url: instance + '/management-api/v1/Groups/'+ID,
        headers: {
            'Accept': 'application/json',
            'Authorization': token
        }
    };
    let resGroup = await axios(config)
    
    console.log('Computer Group = '+ JSON.stringify(resGroup.data))
    
    return resGroup.data
    
    }
      
// =================================================
// Assign Computer to a Group
// =================================================
export async function epm_change_account(instance:any, token:any, account:any, change:any) {

    const axios = require('axios');
    const qs = require('querystring');

    // entitlements = Computer Group    
    if (change.attribute){
        const gpid = change.value

    //Assign Computer to Group
    if (change.op == "Add" || change.op == "add" || change.op == "Set" || change.op == "set"){
        //Get Member ID via Group Policy Query
        const assign_group = {
            method: 'post',
            rejectUnauthorized: false,
            url: instance + '/management-api/v1/Groups/'+gpid+'/AssignComputers',
            data: {"computerIds": [account]},
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Authorization': token
            }
        }
        let resAssign = await axios(assign_group)
       }
       let resComputerDetails = await epm_GET_computer(instance, token, account)
       return resComputerDetails
}
    
    }

// =================================================
// GET Group Policies
// =================================================
export async function epm_GET_group_policies(instance:any, token:any) {

    const axios = require('axios');
    const qs = require('querystring');

    const configGP = {
        method: 'get',
        rejectUnauthorized: false,
        url: instance + '/management-api/v1/policies',
        headers: {
            'Accept': 'application/json',
            'Authorization': token
        }
    };
    let resGP = await axios(configGP)
      return resGP

    }

// =================================================
// GET Group Policy
// =================================================
export async function epm_GET_group_policy(instance:any, token:any, id:any) {

    const axios = require('axios');
    const qs = require('querystring');


    const configGP = {
        method: 'get',
        rejectUnauthorized: false,
        url: instance + '/management-api/v1/Policies/'+id+'/Content',
        headers: {
            'Accept': 'application/json',
            'Authorization': token
        }
    };
    let resGP = await axios(configGP)
      return resGP

    }
     