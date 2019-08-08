# Steps for configuring a VBCS Mobile App with OMH Client SDK
This tutorial shows you how to create an Oracle VBCS Mobile application and configure it with Oracle Mobile Hub Client SDK

## Introduction

Scope:
-	Use default VBCS Mobile app template
-	Configure with OMH Client SDK and 
    *	enable Login / Logout
    *	get logged in user details from OMH
    *	get avatar profile picture from OMH Storage Collection

Overall Cloud environment prerequisites:
-	OMH Instance + IDCS access for managing users
-	VBCS Instance

Overall local environment prerequisites:
-	OMH Client SDK for Cordova Applications

Disclaimer:
-	Because of new versions constantly being released, this tutorial might not work in the future; Other workarounds might be needed or, things might work easily
-	Versions used in this case:
    *	Windows 10, Windows Power Shell
    *	OMH Cordova Client SDK: amce-cordova-sdk-v18.3.3.0
    *	OMH Instance: 19.1.3 
    *	Android: 8.0.0
    *	Java JDK: jdk1.8.0_201

## Cloud Environment Prerequisites

-	Get access to/Create OMH Instance in a tenancy
-	Get access to/Create VBCS Instance in a tenancy

## Local Environment Prerequisites

-	Download OMH Cordova Client SDK
    *	Safest way: go to OMH Instance Console > Development Menu > Downloads
    *	Accept License Agreement
    *	Download latest __Cordova SDK__ from _OMC / AMCE SDKS_ section (for example amce-cordova-sdk-v18.3.3.0.zip)
    *	Unpack the .zip in a working root folder, under a parent folder with the same name as the .zip file
    *	Folder structure should be:
        ```sh	
		amce-cordova-sdk-v18.3.3.0\oracle-mcs-notifications-cordova-plugin
		amce-cordova-sdk-v18.3.3.0\types
		amce-cordova-sdk-v18.3.3.0\mcs.js
		amce-cordova-sdk-v18.3.3.0\package.json
		…
        ```

## App development

Use __OracleMobileHubDemoApps -> omhmobileapp1__ VBCS Mobile App as a reference.

### 1st step: add OMH JavaScript SDK in the VBCS Mobile App project

-	Copy amce-cordova-sdk-v18.3.3.0\mcs.js file and move it in your project resources as, for example:
    >	/mobileApps/\[your vbcs mobile app\]/resources/js/mcs.js
    *	In this way, the OMH SDK file can be referenced from other JS files

-	Do some minor changes to the JS file:
    *	In the Platform.prototype.invokeService function add the following lines of code:
    ```javascript
        var headers = xhr['responseHeaders'] ?
        	_this._utils.normalizeHeaderKeys(xhr['responseHeaders']) :
        	_this._utils.parseHeaders(xhr.getAllResponseHeaders());
    ``` 
		        if (typeof response === "string" ){
		          if (response.length > 0){
		        	response = JSON.parse(response);
		          }
		        }
    ``` 
        var netResponse = new network_response_1.NetworkResponse(xhr.status, response, headers);
    ```
    
    *	Reason: when building the app and running on mobile device, for some reason, all the HTTP request responses are retrieved as string values and not as JS objects; it might not reproduce

    *	In the User Object definition change the following lines of code:
    ```javascript
        var User = /** @class */ (function () {
            function User(user) {
                this._id = user.id;
                this._userName = user.username;
    ```            
                    this._firstName = user.firstName; //this one
                    this._lastName = user.lastName; //and this one
    ```javascript
                this._email = user.email;
            }
    ```
    
    *	Reason: when retrieving current logged in user profile, existing SDK Client typos prevent getting right values for firstname and lastname of the user

### 2nd step: add an OMH Mobile Backend JS configuration file

-	In the tenancy of your OMH Instance, go to IDCS console and create a new user or use your username

-	In the OMH Instance Console go to Roles (Development > Roles) and create a test role, for example _omh_test_role_

-	In the OMH Instance Console go to your mobile backend: Development > Backends > \[your mobile backend\] > Security (create a mobile backend if you haven’t done yet)
    *	Enable Role-based Access
    *	Select the previously created role under Roles field

-	To add your user to the role, go to IDCS console:
    *	Go to Applications and find the Application corresponding to your OMH instance, usually with the name MobileStandard_\[omh instance name\]
    *	Open the Application
    *	Go to > Application roles and you’ll see a role with the name of the one created in the OMH Instance console
    *	Assign your user to that role (Role actions > Assign users)

-	Create a mbe.js JavaScript file in your project resources as, for example:
    >	/mobileApps/\[your vbcs mobile app\]/resources/js/mbe.js

-	Use the reference app for the source code; this file will be as a wrapper on top of the SDK JS file, and it can be referenced from all Application/Flow/Page Module functions (it’s exposed as a JS module)

-	Edit the mbe.js file and replace all placeholders for the mcs_config variable with the appropriate values from Mobile Backend Settings page in the OMH Instance Console; most important in this case:
    *	Backend Name
    *	Backend Id
    *	Backend Base URL

-	To prevent CORS errors edit your OMH Instance Policy. Go to OMH Instance Console > Settings > Policies:
    *	Export Policy file
    *	Change the Security_AllowOrigin setting by replacing the line with:
        ```
        *.*.Security_AllowOrigin=http\://localhost\:*,https\://vbinstance-tenancy.integration.ocp.oraclecloud.com
        ```
    *	(Change the above line with the relevant VBCS Base URL)
    *	Import the Policy file

-	Now you can use the following function in any Application/Flow/Page Module custom JS functions: init, authenticate, logout, getCurrentUserProfile, getCurrentUserProfilePicture
    *	For the UserProfilePicture, we assume we have in OMH an User Isolated Storage Collection called ProfilePictures; each user has only one picture there, otherwise extra logic is required to select the right picture object
        +	The ProfilePictures Storage Collection has to be mapped with the Mobile Backend
        +	Assign the necessary Permissions to the collection. For example, you can assign the same mcs_test_role for Read-Write Permission (OMH Instance Console > Development > Storage > ProfilePictures > Properties tab)
        +	Add a profile picture for the test user: OMH Instance Console > Development > Storage > ProfilePictures > Upload > Select test user; Select example [profile.png] file
    *	Almost all mobileBackend calls are returning a Promise as response; so make sure the Promise is cascaded up to VBCS Action Chain in order to act synchronously (__!! If a custom JS Module function is returning a Promise and if its response is marked as Object on the Call Module Function Activity in the Action Chain, then the call will be blocking, so the Action Chain flow is continued only after the Promise has been resolved. In this way we can handle the OMH responses in the same Action Chain!!__)

-	Check the mobileApps/omhmobileapp1/flows/login/pages/login-start-page.js Page Module to see an example on how to use the mbe.js file

-	You should be able now to Run the app in Development mode (in Browser)

### 3rd step: Stage the Mobile app and run it on device

-	Open Setting for your VBCS Mobile App (in case of the reference app, OracleMobileHubDemoApps -> omhmobileapp1)

-	Allow anonymous access in the Security Tab; as we’ll authenticate directly using the OMH SDK client, we don’t need out of the box VBCS authentication mechanism; If both VBCS and OMH are in the same tenancy, the same IDCS User Identity Store we’ll be used, but our custom login page will replace the browser based IDCS authentication

-	Prepare a keystore for the Build Configuration:
    *	Generate keystore:
        ```sh
        $ <JDK HOME Path>\bin\keytool.exe -genkey -v -keystore debug.keystore -alias VBCSOMH -keyalg RSA -keysize 2048 -validity 10000
        ```
    *	Remember the key alias, keystore password and key password

-	Add New Configuration for Android in Build Configurations tab:
    *	Select Build Type: Debug
    *	Leave the other fields as default
    *	Upload the keystore
    *	Fill values for keystore password, key alias and key password

-	Run the application again in Development mode (in Browser)

-	Use the Stage button to Stage the app and to generate a QR code for downloading the app

-	Download the app, install it, enable Internet Connection and test it!

[profile.png]: vbcs_omh_sdk/src/profile.png
