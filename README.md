# oraclemobilehubapps

This is a reference **Oracle Visual Builder Application** that shows how to use **Oracle Mobile HUB** as a backend for a VBCS Mobile Application.

There are two mobile apps that you can use as a reference when integrating OMH in a VBCS Mobile Application:

**omhmobileapp1**: it shows how to integrate OMH Client SDK and demos how to use the SDK for:

- Login / Logout
- Getting logged-in user profile information from OMH
- Displaying logged-in user avatar picture from OMH Storage Collection

**omhmobileapp1**: in addition to using OMH Client SDK, it shows how to enable Push Notification using OMH Push Notifications Cordova Plugin



## Tutorials

[Steps for configuring a VBCS Mobile App with OMH Client SDK][vbcs_omh_sdk] - This tutorial shows you how to create an Oracle VBCS Mobile application and configure it with Oracle Mobile Hub Client SDK

[Steps for configuring a VBCS mobile app with OMH Client to support Push Notifications (Android)][vbcs_omh_push_notifications] - This tutorial shows you how to create an Oracle VBCS Mobile application and configure it with Oracle Mobile Hub Client to support Push Notifications (Android build)



If interested using plain **Oracle JET** instead of Visual Builder, you may find useful:

[Steps for configuring a JET mobile app with OMH Client to support Push Notifications (Android)][vbcs_omh_sdk] - This tutorial shows you how to create an Oracle JET Mobile application and configure it with Oracle Mobile Hub Client to support Push Notifications (Android build)



## Importing the source code

**Oracle Visual Builder** uses **Oracle Developer Cloud Service** GIT repositories for versioning the source code. You can import a https://github.com repo when creating a new repository in Oracle DevCS.  Full steps:

- Create a Developer Cloud Service Instance in your Oracle Cloud tenancy (if you don't have one)
- Create a new Empty Project in Dev CS Console (if you don't have one)
- Go to Project Administration > Repositories
  - *Create Hosted Repository*
  - Select *Import Existing Repository* for *Initial Content*
  - URL: https://github.com/bogdaneremia/omhvbcsdemoapps.git
- In Visual Builder Cloud Service Instance hit *Import* for Importing an application:
  - Select *Application from Oracle Developer GIT*
  - [Optional] *Add Credentials* if your DevCS Instance hasn't been already linked with your VBCS Instance
    - URL format: https://[devcs instance name]-[tenancy name].developer.ocp.oraclecloud.com/[devcs instance name]-[tenancy name]/
    - Setup an username/password (the user has to be a team member for the DevCS Project created earlier)
  -  Select the DevCS linked instance, DevCS Project, Repository created earlier and branch (master)
  - Give an *Application Name*
  
[vbcs_omh_sdk]: /mddocs/vbcs_omh_sdk.md
[vbcs_omh_push_notifications]: /mddocs/vbcs_omh_push_notifications.md
[vbcs_omh_sdk]: /mddocs/vbcs_omh_sdk.md