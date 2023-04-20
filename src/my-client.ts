import { ConnectorError, logger } from "@sailpoint/connector-sdk"
import {epm_auth, epm_GET_computer_group, epm_GET_computers_details,epm_GET_computer,epm_GET_computer_groups,epm_change_account} from './epm-functions'

const MOCK_DATA = new Map([
    [
        'john.doe',
        {
            id: '1',
            username: 'john.doe',
            firstName: 'john',
            lastName: 'doe',
            email: 'john.doe@example.com',
        },
    ],
    [
        'jane.doe',
        {
            id: '2',
            username: 'jane.doe',
            firstName: 'jane',
            lastName: 'doe',
            email: 'jane.doe@example.com',
        },
    ],
])

export class MyClient {
    private readonly instance?: string
    private readonly authUrl?: string
    private readonly client_id?: string
    private readonly client_secret?: string

    constructor(config: any) {
        // Fetch necessary properties from config.
        // Following properties actually do not exist in the config -- it just serves as an example.
        this.instance = config?.instance
        this.authUrl = config?.authUrl
        this.client_id = config?.client_id
        this.client_secret = config?.client_secret
        if (this.client_id == null) {
            throw new ConnectorError('client_id and client_secret must be provided from config')
        }
    }

    async getAllAccounts(): Promise<any[]> {
        logger.info('getAllAccounts instance = '+this.instance)
        let resAuth = await epm_auth(this.authUrl,this.client_id,this.client_secret)

        let resAccounts = await epm_GET_computers_details(this.instance,"Bearer "+resAuth.data.access_token)
        logger.info('emp GET accounts = '+JSON.stringify(resAccounts))

//        return Array.from(MOCK_DATA.values())
        return(resAccounts)
}

    async getAccount(identity: string): Promise<any> {
        // In a real use case, this requires a HTTP call out to SaaS app to fetch an account,
        // which is why it's good practice for this to be async and return a promise.
//        return MOCK_DATA.get(identity)
logger.info('getAccount instance = '+this.instance)
let resAuth = await epm_auth(this.authUrl,this.client_id,this.client_secret)

let resAccount = await epm_GET_computer(this.instance,"Bearer "+resAuth.data.access_token, identity)

return(resAccount)
    }

    async changeAccount(account: string, change: any): Promise<any> {
        // In a real use case, this requires a HTTP call out to SaaS app to fetch an account,
        // which is why it's good practice for this to be async and return a promise.
        let resAuth = await epm_auth(this.authUrl,this.client_id,this.client_secret)

//        changes.forEach((c: any) => {
            epm_change_account(this.instance,"Bearer "+resAuth.data.access_token,account,change)
            logger.info(`forEach change : ${JSON.stringify(change)}`)
//        })

let resAccount = await epm_GET_computer(this.instance,"Bearer "+resAuth.data.access_token, account)

return(resAccount)    
}

    async testConnection(): Promise<any> {
        logger.info('testConnection instance = '+this.instance)
        let resAuth = await epm_auth(this.authUrl,this.client_id,this.client_secret)
        return {}
//          return resAuth.data
}

    async getAllGroups(): Promise<any[]> {
        logger.info('getAllGroups instance = '+this.instance)
        let resAuth = await epm_auth(this.authUrl,this.client_id,this.client_secret)

        let resGroups = await epm_GET_computer_groups(this.instance,"Bearer "+resAuth.data.access_token)

        logger.info('getAllGroups res = '+JSON.stringify(resGroups.data.data))
        return(resGroups.data.data)
}

async getAGroup(identity: string): Promise<any[]> {
    logger.info('getAGroup instance = '+this.instance)
    let resAuth = await epm_auth(this.authUrl,this.client_id,this.client_secret)

    let resGroup = await epm_GET_computer_group(this.instance,"Bearer "+resAuth.data.access_token, identity)

    logger.info('getAGroup res = '+JSON.stringify(resGroup))
    return(resGroup)
}

async getAllEntitlements(): Promise<any[]> {
    let resAuth = await epm_auth(this.authUrl,this.client_id,this.client_secret)

    let resGroups = await epm_GET_computer_groups(this.instance,"Bearer "+resAuth.data.access_token)

    console.log('We are in getAllEntitlements my-client')
    console.log('resGroups from my-client = '+JSON.stringify(resGroups.data.data))
    return resGroups.data.data

}

async getEntitlement(identity: string): Promise<any[]> {
    let resAuth = await epm_auth(this.authUrl,this.client_id,this.client_secret)

    let resGP = await epm_GET_computer_group(this.instance,"Bearer "+resAuth.data.access_token,identity)
//    logger.info('Policy XML = '+JSON.stringify(resGP.data))
    var parseString = require('xml2js').parseString
    parseString(resGP.data, (parseError: any, xml2json:any) => {
    if (parseError) {
     throw parseError;
    }
	  console.log('xml2json _Version : '+xml2json.Configuration.$.Version)
	  console.log('Policy length : '+xml2json.Configuration.Policies[0].Policy.length)
      	  const policyCount = xml2json.Configuration.Policies[0].Policy.length
    for (let policyIndex = 1 - 1; policyIndex < policyCount && (policyIndex + 1 - 1) < policyCount; ++policyIndex) {
	  console.log('####### Policy Index : '+policyIndex)
	  console.log('Policy Name : '+xml2json.Configuration.Policies[0].Policy[policyIndex].$.Name)
	  console.log('Policy : '+JSON.stringify(xml2json.Configuration.Policies[0].Policy[policyIndex]))
	  console.log('Policy Description : '+xml2json.Configuration.Policies[0].Policy[policyIndex].$.Description)

      const AccountsFilterLength = xml2json.Configuration.Policies[0].Policy[policyIndex].Filters[0].AccountsFilter.length
      console.log('AccountsFilter length = '+AccountsFilterLength)

      const AccountsFilter = xml2json.Configuration.Policies[0].Policy[policyIndex].Filters[0].AccountsFilter[0]
	  console.log('Policy AccountsFilter : '+JSON.stringify(AccountsFilter))
      const Accounts = AccountsFilter.Accounts
	  console.log('Policy Accounts InverseFilter: '+JSON.stringify(Accounts[0].Account[0].$.Name))
      if(AccountsFilterLength == 2){
        console.log('Policy Accounts InverseFilter: '+JSON.stringify(Accounts[0].Account[0].$.Name))
        const AccountsFilter2 = xml2json.Configuration.Policies[0].Policy[policyIndex].Filters[0].AccountsFilter[1]
        const Accounts2 = AccountsFilter2.Accounts
        console.log('Policy Accounts : '+JSON.stringify(Accounts2[0].Account[0].$.Name))

      }
//      const AccountName = Accounts[0].$.Name
//	  console.log('Policy Account Name : '+JSON.stringify(AccountName))
		const policyName = xml2json.Configuration.Policies[0].Policy[policyIndex].$.Name
		const description = xml2json.Configuration.Policies[0].Policy[policyIndex].$.Description
    }
    });    
    return resGP

}

}
