import {
    Context,
    createConnector,
    ConnectorError,
    readConfig,
    Response,
    logger,
    StdAccountListOutput,
    StdAccountReadInput,
    StdAccountReadOutput,
    StdAccountCreateInput,    
    StdAccountCreateOutput,    
    StdAccountDeleteInput,
    StdAccountDeleteOutput,
    StdAccountDisableInput,
    StdAccountDisableOutput,
    StdAccountEnableInput,
    StdAccountEnableOutput,
    StdAccountUnlockInput,
    StdAccountUnlockOutput,
    StdAccountUpdateInput,
    StdAccountUpdateOutput,
    StdTestConnectionOutput,
    StdEntitlementListInput,
    StdEntitlementListOutput,
    StdEntitlementReadOutput,
    StdEntitlementReadInput
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

    try{
    return createConnector()
        .stdTestConnection(async (context: Context, input: undefined, res: Response<StdTestConnectionOutput>) => {
            logger.info("Running test connection")
            res.send(await myClient.testConnection())
        })
        .stdAccountList(async (context: Context, input: any, res: Response<StdAccountListOutput>) => {

            const accounts = await myClient.getAllAccounts()

            for (const account of accounts) {
            // GET User Sessions Report
//            let sessions = await myClient.getAccountSessionReport(account.id)

                res.send(util.userToAccount(account))
            }
                logger.info(`stdAccountList sent ${accounts.length} accounts`)
        })
        .stdAccountRead(async (context: Context, input: StdAccountReadInput, res: Response<StdAccountReadOutput>) => {
            const account = await myClient.getAccount(input.identity)

                res.send(util.userToAccount(account))

            logger.info(`stdAccountRead read account : ${input.identity}`)

        })
        .stdAccountCreate(async (context: Context, input: StdAccountCreateInput, res: Response<StdAccountCreateOutput>) => {
            logger.info(input, "creating account using input")
            if (!input) {
                throw new Error('identity cannot be null')
            }
            const account = await myClient.createAccount(input.attributes)
            logger.info(account, "created user in PM Cloud")
            res.send(util.userToAccount(account))

        })

        .stdAccountUpdate(async (context: Context, input: StdAccountUpdateInput, res: Response<StdAccountUpdateOutput>) => {
            logger.info(input, "getting account using input")
            logger.info(input.identity, "changing the following account in BeyondTrust PM Cloud")

                let accountChange = await myClient.updateAccount(input.identity, input.changes[0])

            let account = await myClient.getAccount(input.identity)
            res.send(util.userToAccount(account))

        })

        .stdAccountDisable(async (context: Context, input: StdAccountDisableInput, res: Response<StdAccountDisableOutput>) => {
            logger.info(input.identity, "disabling the following account in BeyondTrust Password Safe")
            const account = await myClient.changeAccountStatus(input.identity, false)
            logger.info(input.identity, "new account after changes applied")
            res.send(util.userToAccount(account))

        })

        .stdAccountEnable(async (context: Context, input: StdAccountEnableInput, res: Response<StdAccountEnableOutput>) => {
            logger.info(input.identity, "enabling the following account in BeyondTrust PM Cloud")
            const account = await myClient.changeAccountStatus(input.identity, true)
            logger.info(input.identity, "new account after changes applied")
            res.send(util.userToAccount(account))

        })

        .stdAccountUnlock(async (context: Context, input: StdAccountUnlockInput, res: Response<StdAccountUnlockOutput>) => {
            logger.info(input.identity, "unlocking the following account in BeyondTrust PM Cloud")
            const account = await myClient.changeAccountStatus(input.identity, true)
            logger.info(input.identity, "new account after changes applied")
            res.send(util.userToAccount(account))

        })

        .stdAccountDelete(async (context: Context, input: StdAccountDeleteInput, res: Response<StdAccountDeleteOutput>) => {
            logger.info(input.identity, "deleting the following account in BeyondTrust PM Cloud")
            const account = await myClient.deleteAccount(input.identity)
            logger.info(input.identity, "account deleted")
//            res.send(account.toStdAccountDisableOutput())
        })

        .stdEntitlementList(async (context: Context, input: StdEntitlementListInput, res: Response<StdEntitlementListOutput>) => {
            // Authenticate to Password Safe REST API
            const roles = await myClient.getAllEntitlements()
            for (const role of roles) {
            res.send(util.groupToEntitlement(role))
}
            logger.info(`stdEntitlementList sent ${roles.length} groups`)
        })

        .stdEntitlementRead(async (context: Context, input: StdEntitlementReadInput, res: Response<StdEntitlementReadOutput>) => {
                logger.debug(input, 'entitlement read input object')
                const role: any = await myClient.getEntitlement(input.identity)
                logger.debug(role, 'PM Cloud found')
                res.send(util.groupToEntitlement(role))
        })
    } catch (err:any) {
        throw new ConnectorError('Index level error  :  '+err.name+'  :index:  '+err.message)
    }

        }
