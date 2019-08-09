# Steps for configuring a VBCS mobile app with OMH Client to support Push Notifications (Android)
This tutorial shows you how to create an **Oracle Visual Builder** Mobile application and configure it with **Oracle Mobile Hub** Client to support Push Notifications (Android build).

## Introduction

Scope:
-	Use default VBCS Mobile app template
-	Configure with OMH Client SDK and 
    *	enable Login / Logout
-	Configure with OMH Push Notification Cordova Plugin
-	Send push notifications via Google Firebase
-	Handle push notification and navigate to a mobile page (flow)

Overall Cloud environment prerequisites:
-	Google and Firebase account
-	OMH Instance + IDCS access for managing users
-	VBCS Instance

Overall local environment prerequisites:
-	Cordova
-	OMH Client SDK for Cordova Applications
-	OMH Push Notifications Cordova Plugin
-	Postman (for sending Push notifications)

Disclaimer:
-	Because of new versions constantly being released, this tutorial might not work in the future; Other workarounds might be needed or, things might work easily
-	Versions used in this case:
    *	Windows 10, Windows Power Shell
    *	OMH Push Notifications Cordova: amce-cordova-sdk-v18.3.3.0
    *	OMH Instance: 19.1.3
    *	npm: 6.4.1 
    *	Cordova: 9.0.0
    *	Android: 8.0.0
    *	Java JDK: jdk1.8.0_201

## Cloud Environment Prerequisites

-	Create Google (email) account:
    *	https://mail.google.com
mobile phone number, recovery email not mandatory
-	Activate / Access Google Firebase
    *	https://console.firebase.google.com/
-	Get access to/Create OMH Instance in a tenancy
-	Get access to/Create VBCS Instance in a tenancy

## Local Environment Prerequisites

-	Install Node.js, npm: https://nodejs.org/en/download/
-	Install cordova
    ```sh 
    $ npm install -g cordova
	```
-	[Optional] Install Android Studio (it helps for debugging .apk files, debugging your device, etc.)
    *	https://developer.android.com/studio/index.html
    *	Choose to install an Emulator Accelerator
    *	Choose for AVD Manager
-	Depending on the Android device brand:
    *	Enable Developer Options on the device
    *	Install USB drivers if using a Windows Machine: https://developer.android.com/studio/run/oem-usb.html
-	Configure required environment variables:
    
    *	JAVA_HOME (Java JDK install, ex. value: C:\Programs\Oracle\Java\jdk1.8.0_201\)
-	[Optional] Configure required environment variables for Android Studio
    *	ANDROID_HOME (Android SDK install, ex. value: C:\Programs\Google\Android\SDK)
    *	ANDROID_SDK_ROOT (same value as ANDROID_HOME)
    *	Path
        +	add/check following entries added to the end (example for Windows):
        	```sh
			C:\Programs\Gradle\gradle-5.4.1\bin
			C:\Programs\Google\Android\SDK\emulator
			C:\Programs\Google\Android\SDK\tools
			C:\Programs\Google\Android\SDK\tools\bin
			C:\Programs\Google\Android\SDK\platform-tools
        	```
        +	The order is important, Android\SDK\emulator must be loaded first, otherwise problems might occur when launching the Android emulator
-	Download OMH Cordova Client SDK
    *	Safest way: go to *OMH Instance Console* > *Development* Menu > *Downloads*
    *	Accept License Agreement
    *	Download latest __Cordova SDK__ from *OMC / AMCE SDKS* section (for example amce-cordova-sdk-v18.3.3.0.zip)
    *	Unpack the .zip file contents in a parent folder with the same name as the .zip file
    *	Folder structure should be:
        ```sh
		amce-cordova-sdk-v18.3.3.0\oracle-mcs-notifications-cordova-plugin
		amce-cordova-sdk-v18.3.3.0\types
		amce-cordova-sdk-v18.3.3.0\mcs.js
		amce-cordova-sdk-v18.3.3.0\package.json
		amce-cordova-sdk-v18.3.3.0\…
        ```
    *	To fix some future build errors, change the following line in the amce-cordova-sdk-v18.3.3.0\oracle-mcs-notifications-cordova-plugin\scripts\android-before-build.js file:
		```sh        
		const ANDROID_PLATFORM_SRC_PATH = 'platforms/android/src';
		```
		with
		```sh
		const ANDROID_PLATFORM_SRC_PATH = 'platforms/android/app/src/main/java';
		```
    *	To force to an old version as Firebase dependency (at the time of writing this tutorial, latest **oracle-mcs-notifications-cordova-plugin** wasn’t compatible with the latest __firebase-core__ and __firebase-messaging__ packages) change the following lines in the \amce-cordova-sdk-v18.3.3.0\oracle-mcs-notifications-cordova-plugin\plugin.xml file:
        ```
		<framework src="com.google.firebase:firebase-core:+" />
		<framework src="com.google.firebase:firebase-messaging:+" />
        ```
		with
        ```
		<framework src="com.google.firebase:firebase-core:16.0.3" />
		<framework src="com.google.firebase:firebase-messaging:17.6.0" />
        ```

## App development

Use __OracleMobileHubDemoApps -> omhmobileapp2__ VBCS Mobile App as a reference.

Follow the guide [Steps for configuring a VBCS mobile app with OMH Client SDK][vbcs_omh_sdk]. You may add to your app only the login/logout functionality; you can skip getting profile details from OMH. This guide will focus only on configuring Push Notifications.

### 1st step: add OMH JavaScript SDK in the VBCS Mobile App project

-	Follow 1st step from [Steps for configuring a VBCS mobile app with OMH Client SDK][vbcs_omh_sdk] guide

### 2nd step: add an OMH Mobile Backend JS configuration file
-	Follow 2nd step from[Steps for configuring a VBCS mobile app with OMH Client SDK][vbcs_omh_sdk] guide

-	Use __omhmobileapp2__ VBCS Mobile App as a reference for the mbe.js code as it adds new functions for handling device registration and receiving push notifications data

-	Check the mobileApps/omhmobileapp2/flows/login/pages/login-start-page.js Page Module to see an example on how to use the mbe.js file; we register the app for push notifications only if the login has been successful

-	We cannot test in Development mode (in Browser) and we need to add the OMH Push Notification Cordova Plugin to make available the _MCSNotificationsCordovaPlugin_ object at runtime

### 3rd step:  Prepare VBCS Mobile App build template

-	Setup an applicationID / Bundle ID:
    *	Go to the VBCS Mobile App *Settings* > *General Setting* tab
    *	Setup an Android applicationID for the Package Name / Bundle ID Default
        +	Example format: __com.oraclecorp.internal.ent1.omhvbcstest__
        +	(Please use a different ID, not the above one of the reference application)
    *	Make sure to update the _handleTokenRefresh_ function in mbe.js with the same value for _packageName_ variable

-	Download project build template and prepare the app for Android
    *	Go to the VBCS Mobile App *Settings* > *Custom Plugins* tab
    *	_Download Cordova Project Source_
    *	Extract the .zip content in a folder – cordova-package, for example -, preferable alongside the OMH SDK folder (amce-cordova-sdk-v18.3.3.0 in my case); 
    *	Edit the config.xml file under the cordova-package folder:
        +	Replace the default applicationID in the root *widget* tag with the value setup earlier
        +	Do the same for the applicationID preference under the *platform* tag
        +	There are two occurrences in total; This is important as the OMH Push Notifications Cordova Plugin won’t install if the template project and the google-services.json file (that we’ll be adding later) are not using the same applicationID

-	Add the Android Platform
    *	Under the cordova-package folder, execute the following for adding the Android platform:
        ```sh
		$ cordova platform add android --nosave
        ```
    *	This will the Android Platform to the project and core cordova plugins
    *	Remove the network-information plugin; it will require unnecessary app permissions:
        ```sh
		$ cordova plugin remove cordova-plugin-network-information
        ```

### 4th step: Get Google Firebase Configuration and add OMH Cordova plugin

-	Create a project in Google Firebase
    *	Go to Google Firebase and create a new project:
        +	*ProjectName*: any name as you wish
        +	*Location*: select suitable values
    *	Go to *Project Settings*:
        +	Select a Support email address
    *	In _Your Apps_ section add a new Android App:
        +	*Android Package Name*: the applicationID value that we setup earlier
        +	Register App
        +	Download google-services.json file
        +	Save that under the cordova-package folder
        +	Place another copy of the filer under \[cordova-package folder\]\platforms\android\app folder
        +	*Next* (ignore gradle steps, those will be handled by the OMH Push Notifications Cordova Plugin)
        +	Skip _Checking Communication with servers_ step

-	Add OMH Push Notifications Cordova plugin
    *	Execute inside cordova-package folder: 
        ```sh
		$ cordova plugin add ..\amce-cordova-sdk-v18.3.3.0\oracle-mcs-notifications-cordova-plugin
        ```
    *	You may change the above path of the plugin depending the location where you unpacked the OMH Cordova SDK

-	Prepare a keystore for the Building the template app and the VBCS app:
    *	Generate keystore (execute outside the cordova-package folder):
        ```sh
		$ <JDK HOME Path>\bin\keytool.exe -genkey -v -keystore debug.keystore -alias VBCSOMH -keyalg RSA -keysize 2048 -validity 10000
        ```
    *	Remember the key alias, keystore password and key password

    *	Build the template application (execute within the cordova-package folder):
        ```sh
		$ cordova build android --device --debug --keystore=../debug.keystore --storePassword=<store password> --alias=<key alias> --password=<key password> --keystoreType=jks
        ```

-	Configure OMH for Push Notifications
    *	Go to OMH Instance Console > *Development* > *Backends* > \[your mobile backend\]
    *	Go to *Clients* Tab and add a new Client:
        +	Set a *Client Name* / *Display Name*
        +	*Platform*: Android
        +	*Package name*: the applicationID value that we have setup earlier
        +	*Mobile App Version*: appVersion value that we have setup earlier (1.0.0)
        +	*Create*
    *	Switch to *Profiles* tab in the newly created Client and Create a new Profile:
        +	Set a profile *Name*
        +	*Notification Service*: Firebase Cloud Messaging (FCM)
        +	*Send Method*: HTTP
        +	*API Key*: You get this value from the Google Firebase Console > \[Your project\] > *Settings* > *Cloud Messaging* Tab > *Project Credentials* section > *Server Key* (it should be a long string)
        +	*Sender ID*: You get this value from the same section as above, Sender ID field value
        +	*Create*
    *	Now, OMH should be able to contact Google Firebase in order to send push notifications to your app

### 5th step: Stage the Mobile app and run it on device


-	Open *Setting* for your VBCS Mobile App (in case of the reference app, OracleMobileHubDemoApps -> omhmobileapp2)

-	*Allow anonymous access* in the *Security* Tab; as we’ll authenticate directly using the OMH SDK client, we don’t need out of the box VBCS authentication mechanism; If both VBCS and OMH are in the same tenancy, the same IDCS User Identity Store we’ll be used, but our custom login page will replace the browser based IDCS authentication

-	Add New Configuration for Android in Build Configurations tab:
    *	Select *Build Type*: Debug
    *	Leave the other fields as default
    *	Upload the keystore
    *	Fill values for keystore password, key alias and key password

-	In *Custom Plugins* tab, upload the .apk file generated earlier:
    *	Select *Upload* > *Android*
    *	Give a *Template Name*
    *	Select _Debug_
    *	Upload the .apk file

-	Install and run the Mobile App:
    *	Run the application in Development mode (in Browser); don’t login yet – the plugin will not work in Web Browser
    *	Use the *Stage* button to Stage the app and to generate a QR code for downloading the app
    *	Download the app, install it, enable Internet Connection

-	Test the Application
    *	First, Login on the Dashboard page
    *	Check Device registration in OHM Instance Console
        +	Go to *Development* > \[your mobile backend\] > *Notifications* > *Manage Devices*
        +	A new device should have appeared here; if not, check the *Request history* and look for error messages
        +	Option to debug: Use Chrome to inspect JS console of the mobile app
    *	Use Postman to invoke OMH Push Notifications APIs that will send a push notification to the app through Google Firebase
        +	*HTTP Method*: POST
        +	*Endpoint*: \[mobile backend base url\]/mobile/system/notifications/notifications/
        +	*Authentication*: Basic; use your OHM user credentials
        +	*Headers*:
        >		Content-Type: application/json
        >		oracle-mobile-backend-id: [your mobile backend id value]
        +	Body: Use the content of the [postman.js] example file
        +	Before invoking minimize the app
        +	Invoke; you should receive a 201 Create HTTP response code
        +	You should receive a Push Notification on the device
        +	If you open the push notification, it will open the app and navigate to the Page 2 page; you can customize the payload in Postman and change the page id; The redirect is dynamic, based on the Push Notification custom json payload.

[postman.js]: vbcs_omh_push_notifications/src/postman.js
[vbcs_omh_sdk]: vbcs_omh_sdk.md