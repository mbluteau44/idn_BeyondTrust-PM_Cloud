import { ConnectorError, logger } from "@sailpoint/connector-sdk"
import {check_token_expiration,smart_error_handling,scim_auth, scim_GET_ServiceProviderConfig,scim_GET_Users,scim_GET_User,scim_POST_User,scim_PUT_User,scim_PATCH_User,scim_GET_Groups,scim_GET_Groups_Details,scim_GET_Containers,scim_DELETE_User,scim_PATCH_Group} from './scim-functions'
import {pmc_get} from './pmc-functions'

export class MyClient {
    private readonly instance?: string
    private readonly authUrl?: string
    private readonly client_id?: string
    private readonly client_secret?: string

    constructor(config: any) {
        // Fetch necessary properties from config.
        // Global Variables
        // Remove trailing slash in URL if present.  Then store in Global Variables.
        if(config?.instance.substr(config?.instance.length - 1 ) == '/'){
            globalThis.__INSTANCE = config?.instance.substr(0,config?.instance.length - 1) + '/management-api/scim/v2'
            globalThis.__REST_API = config?.instance.substr(0,config?.instance.length - 1) + '/management-api/v1'
        }  else{
            globalThis.__INSTANCE = config?.instance+'/management-api/scim/v2'
            globalThis.__REST_API = config?.instance+'/management-api'
        }
        // Remove trailing slash in Auth URL if present.  Then store in Global Variables.
        if(config?.authUrl.substr(config?.authUrl.length - 1 ) == '/'){
            globalThis.__AUTHURL = config?.authUrl.substr(0,config?.authUrl.length - 1)
        }  else{
            globalThis.__AUTHURL = config?.authUrl
        }
        // Store Client Credentials in Global Variables
        globalThis.__CLIENT_ID = config?.client_id
        globalThis.__CLIENT_SECRET = config?.client_secret

    }

    async getAllAccounts(): Promise<any[]> {

        // Check expiration time for Bearer token in Global variable
        let valid_token = await check_token_expiration()
        if((valid_token == 'undefined') || (valid_token == 'expired')){
            console.log('######### Expiration Time is undefined or in the past')
            let resAuth = await scim_auth()
            logger.info(`resAuth : ${JSON.stringify(resAuth.data)}`)
                }
        else if(valid_token == 'valid'){
            console.log('### Expiration Time is in the future:  No need to Re-Authenticate')
            }

            // Declare account
            try{
                let resAccounts = await scim_GET_Users()
                //console.log('accounts = '+JSON.stringify(resAccounts))
                return resAccounts
            }  catch (err:any) {
                console.log('##### Error name = '+err.name)
                console.log('##### Error message = '+err.message)
                if(err.message == 'Request failed with status code 401'){
                    console.log('#### error status = 401')
                    let resAuth2: any = await scim_auth()
                    logger.info(`resAuth2 : ${JSON.stringify(resAuth2.data)}`)
                    let resAccounts2 = await scim_GET_Users()
                    return resAccounts2
                }    else{
                    console.log('about to throw ConnectorError')
                    await smart_error_handling(err)
                    return err.message
                }

            }  
            }

    async getAccount(identity: string): Promise<any> {
        // In a real use case, this requires a HTTP call out to SaaS app to fetch an account,
        // which is why it's good practice for this to be async and return a promise.

        // Check expiration time for Bearer token in Global variable
        let valid_token = await check_token_expiration()
        if((valid_token == 'undefined') || (valid_token == 'expired')){
            console.log('######### Expiration Time is undefined or in the past')
            let resAuth = await scim_auth()
                }
        else if(valid_token == 'valid'){
            console.log('### Expiration Time is in the future:  No need to Re-Authenticate')
            }

            // Declare account
            try{
                let resAccount = await scim_GET_User(identity)
                return resAccount
        }  catch (err:any) {
                console.log('##### Error name = '+err.name)
                console.log('##### Error message = '+err.message)
                if(err.message == 'Request failed with status code 401'){
                    console.log('#### error status = 401')
                    let resAuth2: any = await scim_auth()
                    let resAccount2 = await scim_GET_User(identity)
                    return resAccount2
                }   else{
                        console.log('about to throw ConnectorError')
                        await smart_error_handling(err)
                        return err.message
                    }
            }  

    }

    async createAccount(account: string): Promise<any> {
        // In a real use case, this requires a HTTP call out to SaaS app to fetch an account,
        // which is why it's good practice for this to be async and return a promise.

        // Check expiration time for Bearer token in Global variable
        let valid_token = await check_token_expiration()
        if((valid_token == 'undefined') || (valid_token == 'expired')){
            console.log('######### Expiration Time is undefined or in the past')
            let resAuth = await scim_auth()
            logger.info(`resAuth : ${JSON.stringify(resAuth.data)}`)
                }
        else if(valid_token == 'valid'){
            console.log('### Expiration Time is in the future:  No need to Re-Authenticate')
            }

            // Declare account
            try{
                let resAccount = await scim_POST_User(account)
                return resAccount
            }  catch (err:any) {
                console.log('##### Error name = '+err.name)
                console.log('##### Error message = '+err.message)
                if(err.message == 'Request failed with status code 401'){
                    console.log('#### error status = 401')
                    let resAuth2: any = await scim_auth()
                    logger.info(`resAuth2 : ${JSON.stringify(resAuth2.data)}`)
                    let resAccounts2 = await scim_POST_User(account)
                    return resAccounts2
                }   else{
                    console.log('about to throw ConnectorError')
                    await smart_error_handling(err)
                    return err.message
                }

            } 
    }

    async changeAccountStatus(identity: string, status: boolean): Promise<any> {
        // In a real use case, this requires a HTTP call out to SaaS app to fetch an account,
        // which is why it's good practice for this to be async and return a promise.

        // Check expiration time for Bearer token in Global variable
        let valid_token = await check_token_expiration()
        if((valid_token == 'undefined') || (valid_token == 'expired')){
            console.log('######### Expiration Time is undefined or in the past')
            let resAuth = await scim_auth()
            logger.info(`resAuth : ${JSON.stringify(resAuth.data)}`)
                }
        else if(valid_token == 'valid'){
            console.log('### Expiration Time is in the future:  No need to Re-Authenticate')
            }

            // Change account
            try{
                const change = 
                      {
                        "op": "replace",
                        "attribute": "active",
                        "value": status
                      }

                let changeAccount = await scim_PATCH_User(identity,change)
                return changeAccount
            }  catch (err:any) {
                console.log('##### Error name = '+err.name)
                console.log('##### Error message = '+err.message)
                if(err.message == 'Request failed with status code 401'){
                    console.log('#### error status = 401')
                    let resAuth2: any = await scim_auth()
                    logger.info(`resAuth2 : ${JSON.stringify(resAuth2.data)}`)
                    const change = 
                    {
                      "op": "replace",
                      "attribute": "active",
                      "value": status
                    }
                  let changeAccount2 = await scim_PATCH_User(identity,change)
                    return changeAccount2
                }     else{
                        console.log('about to throw ConnectorError')
                        await smart_error_handling(err)
                        return err.message
                    }

            }  
    }

    async updateAccount(account: string, change: any): Promise<any> {
        // In a real use case, this requires a HTTP call out to SaaS app to fetch an account,
        // which is why it's good practice for this to be async and return a promise.

        // Check expiration time for Bearer token in Global variable
        let valid_token = await check_token_expiration()
        if((valid_token == 'undefined') || (valid_token == 'expired')){
            console.log('######### Expiration Time is undefined or in the past')
            let resAuth = await scim_auth()
            logger.info(`resAuth : ${JSON.stringify(resAuth.data)}`)
                }
        else if(valid_token == 'valid'){
            console.log('### Expiration Time is in the future:  No need to Re-Authenticate')
            }

            // Change account
            let Change = change
        try{
                let changeAccount = await scim_PATCH_User(account,Change)
                return changeAccount
            }  catch (err:any) {
                console.log('##### Error name = '+err.name)
                console.log('##### Error message = '+err.message)
                if(err.message == 'Request failed with status code 401'){
                    console.log('#### error status = 401')
                    let resAuth2: any = await scim_auth()
                    logger.info(`resAuth2 : ${JSON.stringify(resAuth2.data)}`)
                        let changeAccount2 = await scim_PATCH_User(account,Change)
                    return changeAccount2
                }    else{
                        console.log('about to throw ConnectorError')
                        await smart_error_handling(err)
                        return err.message
                    }

                } 
    }

    async deleteAccount(identity: string): Promise<any> {
        // In a real use case, this requires a HTTP call out to SaaS app to fetch an account,
        // which is why it's good practice for this to be async and return a promise.

        // Check expiration time for Bearer token in Global variable
        let valid_token = await check_token_expiration()
        if((valid_token == 'undefined') || (valid_token == 'expired')){
            console.log('######### Expiration Time is undefined or in the past')
            let resAuth = await scim_auth()
            logger.info(`resAuth : ${JSON.stringify(resAuth.data)}`)
                }
        else if(valid_token == 'valid'){
            console.log('### Expiration Time is in the future:  No need to Re-Authenticate')
            }

            // Delete account
            try{
                let changeAccount = await scim_DELETE_User(identity)
                return changeAccount
            }  catch (err:any) {
                console.log('##### Error name = '+err.name)
                console.log('##### Error message = '+err.message)
                if(err.message == 'Request failed with status code 401'){
                    console.log('#### error status = 401')
                    let resAuth2: any = await scim_auth()
                    logger.info(`resAuth2 : ${JSON.stringify(resAuth2.data)}`)
                    let changeAccount2 = await scim_DELETE_User(identity)
                    return changeAccount2
                }     else{
                        console.log('about to throw ConnectorError')
                        await smart_error_handling(err)
                        return err.message
                    }

            }  
    }

    async testConnection(): Promise<any> {

        // Check expiration time for Bearer token in Global variable
        let valid_token = await check_token_expiration()
        if((valid_token == 'undefined') || (valid_token == 'expired')){
            console.log('######### Expiration Time is undefined or in the past')
            let resAuth = await scim_auth()
            logger.info(`resAuth : ${JSON.stringify(resAuth.data)}`)
                }
        else if(valid_token == 'valid'){
            console.log('### Expiration Time is in the future:  No need to Re-Authenticate')
            }

        // TEST = GET Security Providers
        try{
        let SPs = await scim_GET_ServiceProviderConfig()
        logger.info(`Service Providers : ${JSON.stringify(SPs.data)}`)
        return {}
    } catch (err:any) {
        console.log('##### Error name = '+err.name)
        console.log('##### Error message = '+err.message)
        if(err.message == 'Request failed with status code 401'){
            console.log('#### error status = 401')
            let resAuth2: any = await scim_auth()
            logger.info(`resAuth2 : ${JSON.stringify(resAuth2.data)}`)
            let SPs2 = await scim_GET_ServiceProviderConfig()
            return {}
        }   else{
            console.log('We are about to throw ConnectorError in Test Connection')
            await smart_error_handling(err)
            return err.message
        }
    }
    }

    async getAllEntitlements(): Promise<any[]> {
        // Check expiration time for Bearer token in Global variable
        let valid_token = await check_token_expiration()
        if((valid_token == 'undefined') || (valid_token == 'expired')){
            console.log('######### Expiration Time is undefined or in the past')
            let resAuth = await scim_auth()
            logger.info(`resAuth : ${JSON.stringify(resAuth.data)}`)
                }
        else if(valid_token == 'valid'){
            console.log('### Expiration Time is in the future:  No need to Re-Authenticate')
            }

            // GET entitlements
            try{
//                let permissions = await this.getPermissions()
                let resG = await pmc_get('/v2/Roles')
                return resG
            }  catch (err:any) {
                console.log('##### Error name = '+err.name)
                console.log('##### Error message = '+err.message)
                if(err.message == 'Request failed with status code 401'){
                    console.log('#### error status = 401')
                    let resAuth2: any = await scim_auth()
                    let resG2 = await pmc_get('/v2/Roles')
                    return resG2
                    }    else{
                    console.log('about to throw ConnectorError')
                    await smart_error_handling(err)
                    return err.message
                }
            }
    }

    async getEntitlement(identity: string): Promise<any[]> {
        // Check expiration time for Bearer token in Global variable
        let valid_token = await check_token_expiration()
        if((valid_token == 'undefined') || (valid_token == 'expired')){
            console.log('######### Expiration Time is undefined or in the past')
            let resAuth = await scim_auth()
            logger.info(`resAuth : ${JSON.stringify(resAuth.data)}`)
                }
        else if(valid_token == 'valid'){
            console.log('### Expiration Time is in the future:  No need to Re-Authenticate')
            }

            // GET entitlement
            try{
                let resGP = await pmc_get('/v2/Roles/'+identity)
                return resGP
            }  catch (err:any) {
                console.log('##### Error name = '+err.name)
                console.log('##### Error message = '+err.message)
                if(err.message == 'Request failed with status code 401'){
                    console.log('#### error status = 401')
                    let resAuth2: any = await scim_auth()
                    logger.info(`resAuth2 : ${JSON.stringify(resAuth2.data)}`)
                    let resGP2 = await pmc_get('/v2/Roles/'+identity)
                    return resGP2
                    }     else{
                    console.log('about to throw ConnectorError')
                    await smart_error_handling(err)
                    return err.message
                }

            }  

    }

}
