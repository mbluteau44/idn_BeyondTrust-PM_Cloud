import {
    Context,
    createConnector,
    readConfig,
    Response,
    logger,
    StdAccountListOutput,
    StdAccountReadInput,
    StdAccountReadOutput,
    StdAccountUpdateInput,
    StdAccountUpdateOutput,
    StdTestConnectionOutput,
    StdEntitlementListInput,
    StdEntitlementListOutput,
    StdEntitlementReadOutput,
    StdEntitlementReadInput,
    ConnectorError
} from '@sailpoint/connector-sdk'
import { MyClient } from './my-client'
import { Util } from './tools/util'

// Connector must be exported as module property named connector
export const connector = async () => {

    // Get connector source config
    const config = await readConfig()
    const util = new Util();

    // Use the vendor SDK, or implement own client as necessary, to initialize a client
    const myClient = new MyClient(config)

    return createConnector()
        .stdTestConnection(async (context: Context, input: undefined, res: Response<StdTestConnectionOutput>) => {
            logger.info("Running test connection")
            res.send(await myClient.testConnection())
        })
        .stdAccountList(async (context: Context, input: any, res: Response<StdAccountListOutput>) => {
            const accounts = await myClient.getAllAccounts()

            for (const account of accounts) {
                res.send(util.userToAccount(account))            }
            logger.info(`stdAccountList sent ${accounts.length} accounts`)
        })
        .stdAccountRead(async (context: Context, input: StdAccountReadInput, res: Response<StdAccountReadOutput>) => {
            const account = await myClient.getAccount(input.identity)

            res.send(util.userToAccount(account)) 
            logger.info(`stdAccountRead read account : ${input.identity}`)

        })
        .stdAccountUpdate(async (context: Context, input: StdAccountUpdateInput, res: Response<StdAccountUpdateOutput>) => {
            logger.info(input, "getting account using input")
            logger.info(input.identity, "changing the following account in BeyondTrust SRA")
//            throw new ConnectorError('85 Unknown account change op: ' + JSON.stringify(input))

input.changes.forEach((c: { op: string }) => {
    switch (c.op) {
        case "Add":
            myClient.changeAccount(input.identity, c)
            break
        case "Remove":
//            myClient.changeAccount(input.identity, c)
            break
        default:
            throw new ConnectorError('Unknown account change op: ' + c.op)
    }
})

//            const account = await myClient.changeAccount(input.identity, input.changes)                
            const account = await myClient.getAccount(input.identity)                
               
            res.send(util.userToAccount(account))

        })

        .stdEntitlementList(async (context: Context, input: StdEntitlementListInput, res: Response<StdEntitlementListOutput>) => {
            const groups = await myClient.getAllGroups()
            logger.info('Groups = '+JSON.stringify(groups))
            for (const group of groups) {
                res.send(util.groupToEntitlement(group))
}
                logger.info(`stdEntitlementList sent ${groups.length} groups`)
            })

            .stdEntitlementRead(async (context: Context, input: StdEntitlementReadInput, res: Response<StdEntitlementReadOutput>) => {
                logger.debug(input, 'entitlement read input object')
                const group: any = await myClient.getAGroup(input.identity)
                logger.debug(group, 'EPM group found')
                res.send(util.groupToEntitlement(group))
            })


}
