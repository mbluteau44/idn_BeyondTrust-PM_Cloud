// BeyondTrust SCIM functions
import { ConnectorError, logger } from '@sailpoint/connector-sdk'

// =================================================
// GENERIC - Check OAuth Bearer Token expiration time
// =================================================
export async function check_token_expiration() {

// Check EXPIRATION_TIME
console.log('auth data before Auth = '+globalThis.__ACCESS_TOKEN)
let now = 0
now = Date.now();
console.log('now Time =        '+now)
console.log('Expiration Time = '+globalThis.__EXPIRATION_TIME)
const time_buffer = 100
let valid_token = 'valid'
if(!globalThis.__EXPIRATION_TIME){
    console.log('######### Expiration Time is undefined')
    valid_token = 'undefined'
}
else{
    if(globalThis.__EXPIRATION_TIME - time_buffer <= now){
        console.log('Expiration Time is in the past')
        valid_token = 'expired'
    }
    else{
        console.log('### Expiration Time is in the future:  No need to Re-Authenticate')
        valid_token = 'valid'
    }
}

return valid_token

}

// =================================================
// GENERIC - Smart Error Handling
// =================================================
export async function smart_error_handling(err: any) {

    console.log('############ We are in smart_error handling, error name = '+err.name+'    Error Message = '+err.message)
    // Smart Error Handling
    if(err.message.substr(0,21) == 'getaddrinfo ENOTFOUND'){
        throw new ConnectorError(err.message+'  ::  Verify the Source instance portion of the URL in Configuration.   '+err.message)
    }   else if(err.message == 'Request failed with status code 401'){
        throw new ConnectorError(err.message+'  ::  Verify that the Source API account client_id and client_secret are valid in Configuration.   '+err.message)
    }   else if(err.message == 'Request failed with status code 403'){
            throw new ConnectorError(err.message+'  ::  Verify that the Source API account has required permissions. '+err.message)
    }   else if(err.message == 'Request failed with status code 400'){
            throw new ConnectorError(err.message+'  ::  Verify Client ID and Client Secret values. '+err.message)
    }   else if(err.message == 'Request failed with status code 404'){
            throw new ConnectorError(err.message+'  ::  Source instance responded, but there is a problem with the URL in Configuration.  '+err.message)
    }    else{
        console.log('about to throw ConnectorError')
        throw new ConnectorError(err.name+'  ::  '+err.message)
    }
    }
    
 // SCIM Functions

// =================================================
// Authentication Simple
// =================================================
export async function scim_auth() {

        // set the Authorization header
    let base64data = Buffer.from(globalThis.__CLIENT_ID+':'+globalThis.__CLIENT_SECRET).toString('base64')
    const authorization = 'Basic '+base64data
    
    const axios = require('axios');
    const qs = require('querystring');
    const data = {
        grant_type: 'client_credentials'
    };
    console.log('AuthUrl = '+globalThis.__AUTHURL+'   authorization = '+authorization)
    // set the headers
    const config = {
        method: 'post',
        rejectUnauthorized: false,
        url: globalThis.__AUTHURL,
        data: qs.stringify(data),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': authorization
        }
    };
    try{
        let resAuth = await axios(config)
        // Store res data in Global variable
        let now = 0
        now = Date.now();
        globalThis.__ACCESS_TOKEN = resAuth.data.access_token
        globalThis.__EXPIRATION_TIME = now + (resAuth.data.expires_in * 1000)    
        return resAuth
    }   catch (err:any) {
        await smart_error_handling(err)
    }
    
    }
    
// =================================================
// SCIM GET ServiceProviderConfig
// =================================================
export async function scim_GET_ServiceProviderConfig() {

    const axios = require('axios');
    const qs = require('querystring');

        const configGP = {
            method: 'get',
            rejectUnauthorized: false,
            url: globalThis.__INSTANCE + '/ServiceProviderConfig',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer '+globalThis.__ACCESS_TOKEN
            }
        }
            let resSP = await axios(configGP)
            return resSP

    }

// =================================================
// SCIM GET Schemas
// =================================================
export async function scim_GET_Schemas() {

    const axios = require('axios');
    const qs = require('querystring');

        const configGP = {
            method: 'get',
            rejectUnauthorized: false,
            url: globalThis.__INSTANCE + '/Schemas',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer '+globalThis.__ACCESS_TOKEN
            }
        }
            let resSP = await axios(configGP)
            return resSP

    }

// =================================================
// SCIM GET ResourceTypes
// =================================================
export async function scim_GET_ResourceTypes() {

    const axios = require('axios');
    const qs = require('querystring');

        const configGP = {
            method: 'get',
            rejectUnauthorized: false,
            url: globalThis.__INSTANCE + '/ResourceTypes',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer '+globalThis.__ACCESS_TOKEN
            }
        }
            let resSP = await axios(configGP)
            return resSP

    }
    
// =================================================
// SCIM GET Users
// =================================================
export async function scim_GET_Users() {

    const axios = require('axios');
    const qs = require('querystring');

        const configGP = {
            method: 'get',
            rejectUnauthorized: false,
            url: globalThis.__INSTANCE + '/Users',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer '+globalThis.__ACCESS_TOKEN
            }
        }
            let res = await axios(configGP)

    // PAGINATION BEGIN
    var accounts = res.data.Resources
    const numberOfUsers = res.data.totalResults
    const itemsPerPage = res.data.itemsPerPage
    const startIndex = res.data.startIndex
    const lastPage = numberOfUsers / 25

    console.log('Total # of Users = '+numberOfUsers+'  itemsPerPage = '+itemsPerPage+' startIndex = '+startIndex+' lastPage = '+lastPage)
    if(lastPage > 1){
        for (let page = 2; page < lastPage + 1; ++page) {
            console.log('PAGINATION: Last Page = '+lastPage+'   We are working on Page # '+page)
            const configGP2 = {
                method: 'get',
                rejectUnauthorized: false,
                url: globalThis.__INSTANCE + '/Users'+'?startIndex='+page+'&itemsPerPage=25',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer '+globalThis.__ACCESS_TOKEN
                }
            }
    
            let res2 = await await axios(configGP2)
            accounts = accounts.concat(res2.data.Resources)
        }
    }
    // PAGINATION END

            return accounts

    }

// =================================================
// SCIM GET User 
// =================================================
export async function scim_GET_User(id:any) {

    const axios = require('axios');
    const qs = require('querystring');
    
    // set the headers
    const config = {
        method: 'get',
        rejectUnauthorized: false,
        url: globalThis.__INSTANCE + '/Users/'+id,
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer '+globalThis.__ACCESS_TOKEN
        }
    };
    let res = await axios(config)

      return res.data
    }

// =================================================
// SCIM POST User
// =================================================
export async function scim_POST_User(identity:any) {

    const axios = require('axios');
    const qs = require('querystring');


    const data = {
        "schemas": [
            "urn:ietf:params:scim:schemas:core:2.0:User"
        ],
        "userName": identity.username,
        "timezone": identity.timezone,
        "locale": identity.locale,
        "emails": [
            {
                "type": "work",
                "primary": true,
                "value": identity.email
            }
        ],
        "roles": identity.roles,
        "active": identity.active,
        "password": identity.password,
        }

    // set the headers
    const config = {
        method: 'post',
        rejectUnauthorized: false,
        url: globalThis.__INSTANCE + '/Users',
        data: data,
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer '+globalThis.__ACCESS_TOKEN
        }
    };
    let res = await axios(config)
    
    return res.data
    
    }

// =================================================
// SCIM PUT User
// =================================================
export async function scim_PUT_User(identity:any) {

    const axios = require('axios');
    const qs = require('querystring');


    const data = {
        "schemas": [
            "urn:ietf:params:scim:schemas:core:2.0:User"
        ],
        "userName": identity.username,
        "name": {
            "givenName": identity.firstname,
            "familyName": identity.lastname
        },
        "emails": [
            {
                "type": "work",
                "primary": true,
                "value": identity.email
            }
        ],
        "active": identity.active,
        "password": identity.password
        }

    // set the headers
    const config = {
        method: 'put',
        rejectUnauthorized: false,
        url: globalThis.__INSTANCE + '/Users/'+identity.id,
        data: data,
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer '+globalThis.__ACCESS_TOKEN
        }
    };
    let res = await axios(config)
    
    return res.data
    
    }

// =================================================
// SCIM PATCH User
// =================================================
export async function scim_PATCH_User(id:any, change:any) {

    const axios = require('axios');
    const qs = require('querystring');

        console.log('##### PATCH User change = '+JSON.stringify(change))
        const changePath = {
            "op": change.op,
            "path": change.attribute,
            "value": change.value
        }
        console.log('##### changePath = '+changePath)
        // Define boby for PATCH 
        const body = {"schemas":["urn:ietf:params:scim:api:messages:2.0:PatchOp"],"Operations":[changePath]}
        console.log('PATCH body = '+JSON.stringify(body))
        
        const data = {
            method: 'patch',
            rejectUnauthorized: false,
            url: globalThis.__INSTANCE + '/Users/'+id,
            data: body,
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer '+globalThis.__ACCESS_TOKEN
            }
      
    }
    let res = await axios(data)
    return res.data

}    

// =================================================
// SCIM DELETE User 
// =================================================
export async function scim_DELETE_User(id:any) {

    const axios = require('axios');
    const qs = require('querystring');
    
    // set the headers
    const config = {
        method: 'delete',
        rejectUnauthorized: false,
        url: globalThis.__INSTANCE + '/Users/'+id,
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer '+globalThis.__ACCESS_TOKEN
        }
    };
    let res = await axios(config)

      return res
    }

// =================================================
// SCIM GET Groups
// =================================================
export async function scim_GET_Groups() {

    const axios = require('axios');
    const qs = require('querystring');

        const config = {
            method: 'get',
            rejectUnauthorized: false,
            url: globalThis.__INSTANCE + '/Groups',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer '+globalThis.__ACCESS_TOKEN
            }
        }
            let res = await axios(config)
            return res.data.Resources

    }

// =================================================
// SCIM GET Groups with SCIM PAM Containers + PrivilegedData
// =================================================
export async function scim_GET_Groups_Details() {

    const axios = require('axios');
    const qs = require('querystring');

        let Groups = []
        // GET ContainerPermissions
        const configGroups = {
            method: 'get',
            rejectUnauthorized: false,
            url: globalThis.__INSTANCE + '/Groups',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer '+globalThis.__ACCESS_TOKEN
            }
        }
        let resGroups = await axios(configGroups)
        // Iterate Groups to GET ContainerPermissions
        for (const Group of resGroups.data.Resources) {
//        if(Group.id == "19"){
//            console.log('##### Group = '+Group.displayName+'  And Group.value = '+Group.id)
//            console.log('##### url = '+globalThis.__INSTANCE + '/ContainerPermissions?filter=group.value+eq+'+Group.id)
            let Containers = []
            let memberOf = []
            // GET ContainerPermissions
            const configCP = {
                method: 'get',
                rejectUnauthorized: false,
                url: globalThis.__INSTANCE + '/ContainerPermissions?filter=group.value+eq+'+Group.id,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer '+globalThis.__ACCESS_TOKEN
                }
            }
            let resCP = await axios(configCP)
//            console.log('##### ContainerPermissions for Group = '+JSON.stringify(resCP.data.Resources))
            // GET Containers
            for (const ContainerPermission of resCP.data.Resources){
//                console.log('##### ContainerPermission to be added = '+JSON.stringify(ContainerPermission))
                const configC = {
                    method: 'get',
                    rejectUnauthorized: false,
                    url: globalThis.__INSTANCE + '/Containers/'+ContainerPermission.container.value,
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'Bearer '+globalThis.__ACCESS_TOKEN
                    }
                }
                let resC = await axios(configC)
//                Containers.push({"id":resC.data.id,"name":resC.data.name,"displayName":resC.data.displayName,"description":resC.data.description,"privilegedData":resC.data.privilegedData})
//                Containers.push('c:'+resC.data.id)
                Containers.push(resC.data.displayName+'  |  rights: '+JSON.stringify(ContainerPermission.rights))
                memberOf.push('c:'+ContainerPermission.container.value)
            }
            // Assemble Group with Details
            let Members = []
            for (const member of Group.members){
                let resU = await scim_GET_User(member.value)
                Members.push(member.value+'  |  '+resU.userName)
            }
            Groups.push({
                "schemas": [
                    "urn:ietf:params:scim:schemas:core:2.0:Group"
                ],
                "id": Group.id,
                "displayName": Group.displayName,
                "members": Members,
                "description": Group.description,
                "containers": Containers,
                "memberOf": memberOf    
            })
//        }
            }
    
//            console.log('######## Groups ='+JSON.stringify(Groups))
            return Groups

    }


// =================================================
// SCIM GET Group 
// =================================================
export async function scim_GET_Group(id:any) {

    const axios = require('axios');
    const qs = require('querystring');
    
    // set the headers
    const config = {
        method: 'get',
        rejectUnauthorized: false,
        url: globalThis.__INSTANCE + '/Groups/'+id,
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer '+globalThis.__ACCESS_TOKEN
        }
    };
    let res = await axios(config)

      return res
    }

// =================================================
// SCIM POST Group
// =================================================
export async function scim_POST_Group(identity:any) {

    const axios = require('axios');
    const qs = require('querystring');


    const data = {
        "displayName": identity.displayname,
        "description": identity.description
        }

    // set the headers
    const config = {
        method: 'post',
        rejectUnauthorized: false,
        url: globalThis.__INSTANCE + '/Groups',
        data: data,
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer '+globalThis.__ACCESS_TOKEN
        }
    };
    let res = await axios(config)
    
    return res.data
    
    }

// =================================================
// SCIM PUT Group
// =================================================
export async function scim_PUT_Group(identity:any) {

    const axios = require('axios');
    const qs = require('querystring');


    const data = {
        "displayName": identity.displayname,
        "description": identity.description
        }

    // set the headers
    const config = {
        method: 'put',
        rejectUnauthorized: false,
        url: globalThis.__INSTANCE + '/Groups/'+identity.id,
        data: data,
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer '+globalThis.__ACCESS_TOKEN
        }
    };
    let res = await axios(config)
    
    return res.data
    
    }

// =================================================
// SCIM PATCH Group
// =================================================
export async function scim_PATCH_Group(id:any, change:any) {

    const axios = require('axios');
    const qs = require('querystring');

        // Define boby for PATCH 
        const body = {"schemas":["urn:ietf:params:scim:api:messages:2.0:PatchOp"],"Operations":[change]}
        console.log('Group PATCH body = '+JSON.stringify(body))
        console.log('Group PATCH url = '+globalThis.__INSTANCE + '/Groups/'+id)

        const data = {
            method: 'patch',
            rejectUnauthorized: false,
            url: globalThis.__INSTANCE + '/Groups/'+id,
            data: body,
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer '+globalThis.__ACCESS_TOKEN
            }
      
    }
    let res = await axios(data)
    return res

}    

// =================================================
// SCIM DELETE Group 
// =================================================
export async function scim_DELETE_Group(id:any) {

    const axios = require('axios');
    const qs = require('querystring');
    
    // set the headers
    const config = {
        method: 'delete',
        rejectUnauthorized: false,
        url: globalThis.__INSTANCE + '/Groups/'+id,
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer '+globalThis.__ACCESS_TOKEN
        }
    };
    let res = await axios(config)

      return res
    }

// =================================================
// SCIM GET Containers
// =================================================
export async function scim_GET_Containers() {

    const axios = require('axios');
    const qs = require('querystring');

        const configGP = {
            method: 'get',
            rejectUnauthorized: false,
            url: globalThis.__INSTANCE + '/Containers',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer '+globalThis.__ACCESS_TOKEN
            }
        }
            let resSP = await axios(configGP)
            let Containers = []
            for (const container of resSP.data.Resources){
                let memberOf = []
                // GET ContainerPermissions
                const configCP = {
                    method: 'get',
                    rejectUnauthorized: false,
                    url: globalThis.__INSTANCE + '/ContainerPermissions?filter=container.value+eq+'+container.id,
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'Bearer '+globalThis.__ACCESS_TOKEN
                    }
                }
                let resCP = await axios(configCP)
                for (const ContainerPermission of resCP.data.Resources){
                    memberOf.push('g:'+ContainerPermission.group.value)
                }
                //                console.log('##### container = '+JSON.stringify(container))
                let privilegedDataIDs = []
                for (const privilegedData of container.privilegedData){
                        privilegedDataIDs.push(privilegedData.display)
                }
                Containers.push({
                    "id": container.id,
                    "name": container.name,
                    "displayName": container.displayName,
                    "description": container.description,
                    "privilegedData": privilegedDataIDs,
                    "memberOf": memberOf
                })
            }
            return Containers

    }

// =================================================
// SCIM GET ContainerPermissions
// =================================================
export async function scim_GET_ContainerPermissions() {

    const axios = require('axios');
    const qs = require('querystring');

        const configGP = {
            method: 'get',
            rejectUnauthorized: false,
            url: globalThis.__INSTANCE + '/ContainerPermissions',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer '+globalThis.__ACCESS_TOKEN
            }
        }
            let resSP = await axios(configGP)
            return resSP

    }

// =================================================
// SCIM GET ContainerPermission 
// =================================================
export async function scim_GET_ContainerPermission(id:any) {

    const axios = require('axios');
    const qs = require('querystring');
    
    // set the headers
    const config = {
        method: 'get',
        rejectUnauthorized: false,
        url: globalThis.__INSTANCE + '/ContainerPermissions/'+id,
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer '+globalThis.__ACCESS_TOKEN
        }
    };
    let res = await axios(config)

      return res
    }

// =================================================
// SCIM POST ContainerPermission
// =================================================
export async function scim_POST_ContainerPermission(identity:any) {

    const axios = require('axios');
    const qs = require('querystring');


    const data = {
        "container": identity.container,
        "group": identity.group,
        "rights": identity.rights
        }

    // set the headers
    const config = {
        method: 'post',
        rejectUnauthorized: false,
        url: globalThis.__INSTANCE + '/ContainerPermissions',
        data: data,
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer '+globalThis.__ACCESS_TOKEN
        }
    };
    let res = await axios(config)
    
    return res.data
    
    }

// =================================================
// SCIM PUT ContainerPermission
// =================================================
export async function scim_PUT_ContainerPermission(identity:any) {

    const axios = require('axios');
    const qs = require('querystring');


    const data = {
        "container": identity.container,
        "group": identity.group,
        "rights": identity.rights
        }

    // set the headers
    const config = {
        method: 'put',
        rejectUnauthorized: false,
        url: globalThis.__INSTANCE + '/ContainerPermissions/'+identity.id,
        data: data,
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer '+globalThis.__ACCESS_TOKEN
        }
    };
    let res = await axios(config)
    
    return res.data
    
    }

// =================================================
// SCIM PATCH ContainerPermission
// =================================================
export async function scim_PATCH_ContainerPermission(id:any, change:any) {

    const axios = require('axios');
    const qs = require('querystring');


        const data = {
            method: 'patch',
            rejectUnauthorized: false,
            url: globalThis.__INSTANCE + '/ContainerPermissions/'+id,
            data: change,
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer '+globalThis.__ACCESS_TOKEN
            }
      
    }
    let res = await axios(data)
    return res

}    

// =================================================
// SCIM DELETE ContainerPermission 
// =================================================
export async function scim_DELETE_ContainerPermission(id:any) {

    const axios = require('axios');
    const qs = require('querystring');
    
    // set the headers
    const config = {
        method: 'delete',
        rejectUnauthorized: false,
        url: globalThis.__INSTANCE + '/ContainerPermissions/'+id,
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer '+globalThis.__ACCESS_TOKEN
        }
    };
    let res = await axios(config)

      return res
    }

// =================================================
// SCIM GET PrivilegedData List
// =================================================
export async function scim_GET_PrivilegedDataList() {

    const axios = require('axios');
    const qs = require('querystring');

        const configGP = {
            method: 'get',
            rejectUnauthorized: false,
            url: globalThis.__INSTANCE + '/PrivilegedData',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer '+globalThis.__ACCESS_TOKEN
            }
        }
            let resSP = await axios(configGP)
            return resSP

    }

// =================================================
// SCIM GET PrivilegedData 
// =================================================
export async function scim_GET_PrivilegedData(id:any) {

    const axios = require('axios');
    const qs = require('querystring');
    
    // set the headers
    const config = {
        method: 'get',
        rejectUnauthorized: false,
        url: globalThis.__INSTANCE + '/PrivilegedData/'+id,
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer '+globalThis.__ACCESS_TOKEN
        }
    };
    let res = await axios(config)

      return res
    }
