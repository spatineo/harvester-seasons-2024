# Harvester Seasons



## CDK

Howto:

1. Run in the vscode terminal and answer questions from awscli:

```shell
$ aws configure sso
SSO session name (Recommended): harvester
SSO start URL [None]: https://spatineo.awsapps.com/start
SSO region [None]: eu-west-1
SSO registration scopes [sso:account:access]:
Attempting to automatically open the SSO authorization page in your default browser.
If the browser does not open or you wish to use a different device to authorize this request, open the following URL:

https://device.sso.eu-west-1.amazonaws.com/

Then enter the code:
```

2. Your browser will open a login, accept stuff. 
3. Go back to the vscode terminal, you will be presented with options. Choose either harvester-seasons-staging or harvester-seasons-production

4. Enter in the following information:

```shell
There are 9 AWS accounts available to you.
Using the account ID 399350213473
The only role available to you is: HarvesterSeasonsAdmin
Using the role name "HarvesterSeasonsAdmin"
CLI default client Region [None]: eu-north-1
CLI default output format [None]: json
CLI profile name [HarvesterSeasonsAdmin-399350213473]: harvester-staging

To use this profile, specify the profile name using --profile, as shown:

aws s3 ls --profile harvester-staging
```

5. Set default profile:

`export AWS_PROFILE=harvester-staging`

6. Done!

