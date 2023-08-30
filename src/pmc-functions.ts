// BeyondTrust PM Cloud functions
// Remote Support and Privileged Remote Access
// The only difference between RS and PRA:  RS has extra attribute private_display_name
import { ConnectorError, logger } from '@sailpoint/connector-sdk'
import {smart_error_handling,scim_GET_User} from './scim-functions'


  
// GET - PM Cloud
export async function pmc_get(endpoint: string) {

//  try{
  const axios = require('axios');
  const qs = require('querystring');
  // set the headers
  const config = {
    method: 'get',
    rejectUnauthorized: false,
    url: globalThis.__REST_API + endpoint,
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer '+globalThis.__ACCESS_TOKEN
    }
}
let res_get = await axios(config)
  
      return res_get.data
  
//    } catch (err: any) {
//      throw new ConnectorError('pmc_get  '+err.name+'  ::  '+err.message)    }
  
  }
