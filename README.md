<!DOCTYPE html>
<html>
<body>

<h1>SailPoint IdentityNow SaaS Connector SDK :: BeyondTrust Privilege Management Cloud for Windows & Mac</h1>

<h2>Privilege Management Cloud for Windows & Mac aka PM Cloud</h2>
  
  The BeyondTrust PM Cloud connector has been created using the <a href="https://developer.sailpoint.com/idn/docs/saas-connectivity/">SailPoint IdentityNow SaaS Connector SDK</a>.
  
  PM Cloud includes a SCIM API, and a Connector in IdentityNow can be created using the generic SCIM Source.
  However, a SaaS Connector allows direct Cloud to Cloud communication without requiring a VA to be deployed on-premises.

  This SaaS Connector is an example for how to use the scim-funtions it includes, when the target application has a SCIM API.

  PM Cloud swagger can be accessed via https://pmc01-services.beyondtrustcloud.com/management-api/swagger/index.html where the instance is https://pmc01.beyondtrustcloud.com
  
   <img src="images/pmc-swagger.png" alt="PM Cloud - Swagger">
  
  PM Cloud web console Users can be added to Roles & Resources via Edit User.
  
   <img src="images/pmc-roles_and_resources.png" alt="Edit User for Roles and Resources">
  
  An API service account needs to be created for the Connector.
  
   <img src="images/pmc-api-config.png" alt="PM Cloud API configuration">

  API service account permissions: Full Access for SCIM and Read Only for Management.
  The Management or REST API is used to aggregate Roles.  A /Roles SCIM endpoint is planned for a future release of PM Cloud.
  
   <img src="images/sra-api-account-permissions.png" alt="SRA API User configuration">

  
  Connector Configuration in IdentityNow.
  
   <img src="images/pmc-source-config.png" alt="PM Cloud Source Configuration">

  You should be able to test the configuration successfully before you can Import Data.

   PM Cloud Accounts in IdentityNow.
  
   <img src="images/pmc-idn-accounts.png" alt="PM Cloud Accounts in IdentityNow">

   When looking at an Account, you should be able to click the Roles at the bottom and view Role Permissions.

   <img src="images/pmc-accounts-entitlement.png" alt="PM Cloud Account in IdentityNow">


  PM Cloud Entitlements in IdentityNow.
  
   <img src="images/pmc-entitlements.png" alt="PM Cloud Entitlements in IdentityNow">
 
  PM Cloud Create Account Provisioning Policy in IdentityNow.
  
   <img src="images/pmc-create-account.png" alt="Create Account in IdentityNow">
  
  Note that PM Cloud userName and email are pointing to the same value in PM Cloud.  The domain portion of the email address must be included in Domain Settings.

    <img src="images/pmc-domain-settings.png" alt="Domain Settings">

    Authentication for Users happens via the authentication Domain, e.g. Azure AD, Okta, Ping Identity.

<h2>Code structure overview</h2>
  
  The BeyondTrust PM Cloud SaaS Connector capabilities are managed within connector-spec.json.

  <img src="images/pmc-code-commands.png" alt="connector-spec.json">
  
  The capability list is used by the IdentityNow instance.  The account and entitlement schemas, and the provisioning policy for new accounts created in PM Cloud, are also included in connector-spec.json.
  
  src/index.ts leverages tools/util.ts to render responses back to IdentityNow connector.

  <img src="images/pmc-index.png" alt="index.ts">


src/tools/util.ts includes functions specific to PM Cloud.

  <img src="images/pmc-util.png" alt="util.ts">
  
src/tools/util.ts leverage model/user.ts and /model/group.ts
  
  <img src="images/pmc-user.png" alt="user.ts">

  <img src="images/pmc-group.png" alt="group.ts">

/src/my-client.ts is called by index.ts for each capability.  Each capability starts with a test for the Bearer Token, to determine if it is expired or undefined and require re-authentication.  As long as a SaaS Connector deployed on an IdentityNow instance, Global Variables are maintained.  The Bearer Token is reused until it expires or it is invalidated.
  
   <img src="images/pmc-checkBearerToken.png" alt="my-client.ts">
  
Global Variables are used to store the Bearer Token, so as long as the Connector is deployed, we can reuse the Bearer Token from previous calls, if it is not expired.
  
  <img src="images/pmc-global-variables.png" alt="my-client.ts">

We also need to catch Unauthorized 401 error, which happens when the Bearer Token we have in Global Variables is invalid despite having a calculated Expiration Time in the future.  This condition can be triggered by changing the instance in configuration after having obtained a Bearer Token from another instance.
  
  <img src="images/pmc-catch401.png" alt="my-client.ts">

  Reusable functions for SCIM are located in /src/scim-functions.ts.
  Note that extra SCIM functions not used by PM Cloud SaaS Connector are available for SCIM and SCIM PAM extension.  scim-functions.ts is experimental and will need to be tested against multiple applications with a SCIM API.
  Also note that instead of implementing a generic GET, each GET call has its own function. This is to faciliate testing at this point.  Same is true for POST, PATCH, PUT.
  
  Functions specific to PM Cloud are located in /src/pmc-functions.ts.
  Note that a single generic GET function is available, and can be used for different GET calls.  
  
  This is the Authentication function leveraging Global Variables to make the Bearer Token and calculated Expiration Time available globally.
  
  <img src="images/pmc-scim-auth.png" alt="scim-functions.ts">
  
  Other SCIM and SCIM PAM functions are shown here:
  
  <img src="images/pmc-scim.png" alt="scim-functions.ts">
  
  And this is the function that provides a User with details:
  
  <img src="images/function-userDetails.png" alt="sra-functions.ts">
  
  <h2>Using the PM Cloud SaaS Connector</h2>

  Once the Connector is deployed to your instance, after you aggregated or imported Accounts and Roles, you can create Access Profiles.
  
  <img src="images/pmc-access-profiles.png" alt="Access Profiles">

  Access Profiles can be added to Role to support Joiner, Mover and Leaver Use Cases.  They can also be added to Applications to support Access Requests.


<h2>Error handling</h2>
  
  <h3>Invalid host in Configuration:  Test Connection.</h3>
  
  With Smart Error Handling function, located in scim-functions.ts, we can present an informative error message to the user:

   <img src="images/pmc-HostNotFound.png" alt="Host Not Found">

  <h3>Invalid credentials in Configuration:  Test Connection.</h3>
     
   With Smart Error Handling, we are presenting a more informative message.
  
   <img src="images/pmc-invalid-credentials.png" alt="Invalid credentials - Smart Error Handling">
 
  <h3>Invalid non-expired Bearer Token.</h3>
  
  This condition is created by changing the Configuration to point to a different instance(requires 2 PM Cloud instances).
  The Connector logic first checks the expiration time, and assumes that the Bearer Token is still valid, so it attemps a call(e.g. GET User) 
  but the  call fails with Unauthorized 401 error.  The Connector handles this error condition by discarding the Bearer Token 
  and forcing re-authentication in order to obtain a new valid Bearer Token.
  
  Switching back and forth between instances and using Test Connection(within Configuration) should result in Success, because the Error condition is catched and handled by code.
  
  <h3>Invalid URL path</h3>
  
  This can be created when the host portion of the URL is valid, but not the path.

  For example, if we use a Base URL that is invalid:  https://pmc01-services.epm.btrusteng.com/scim
 
   <img src="images/pmc-invalid-url-path.png" alt="Invalid URL path - Smart Error Handling">

  <h3>Trailing slash character in either instance or authentication URL</h3>
  
  Logic included in my-client.ts to remove trailing character to avoid error 405.
  
  <img src="images/pmc-remove-trailing-slash.png" alt="Code to remove trailing slash">

  
</body>
</html>

