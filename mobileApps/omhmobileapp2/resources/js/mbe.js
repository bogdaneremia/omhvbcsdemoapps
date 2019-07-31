(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
      // AMD
    define(['resources/js/mcs'], factory);
  } else if (typeof exports === 'object') {
      // CommonJS
    module.exports = factory(require('resources/js/mcs'));
  } else {
    // Browser globals (Note: root is window)
    root.returnExports = factory(root.mcs);
  }
}(this, function (mcs) {

        var mcs_config = {
            "logLevel": mcs.LOG_LEVEL.INFO,
            "enableLogger": true,
            "logHTTP": true,
            "oAuthTokenEndPoint": "<oauth_endopoint>",
            "mobileBackend": {
                "name": "<mobile backend name>",
                "baseUrl": "<mbe base url>",
                "authentication": {
                    "type": mcs.AUTHENTICATION_TYPES.basic,
                    "basic": {
                        "mobileBackendId": "<mbe id>",
                        "anonymousKey": "<mbe anonymous key>"
                    },
                    "oauth": {
                        "clientId": "<oauth client id>",
                        "clientSecret": "<oauth client secret>"
                    },
                    "token": {
                        "mobileBackendId": "<mbe id>",
                        "anonymousKey": "<mbe anonymous key>",
                        "clientId": "<oauth client id>",
                        "clientSecret": "<oauth client secret>"
                    }
                }
            },
            "syncExpress": {
                "handler": "OracleRestHandler",
                "policies": [{
                        "path": '/mobile/custom/firstApi/tasks/:id(\\d+)?',
                    },
                    {
                        "path": '/mobile/custom/secondApi/tasks/:id(\\d+)?',
                    }
                ]
            }
        };
        
        var mobileBackend;
        var myvbcsEventHelper;

        //Backend Operations 
        function init(vbcsEventHelper) {

                //Initialise the mobile backend with the settings configured above
                mcs.init(mcs_config);
                mobileBackend = mcs.mobileBackend;
                mobileBackend.setAuthenticationType(mcs.AUTHENTICATION_TYPES.basic);
                
                myvbcsEventHelper = vbcsEventHelper;
        };

        function authenticate(username, password) {
            //console.log("MBE authenticate > username=" + username + " password=" + password);
          
            return mobileBackend.authorization.authenticate(username, password);
        };

        function logout() {
            mobileBackend.authorization.logout();
        };

        /** OMH Push Notifications Functions **/
        function handleDeviceReady() {
            
            MCSNotificationsCordovaPlugin.onTokenRefresh(handleTokenRefresh, handleError);
            MCSNotificationsCordovaPlugin.onMessageReceived(handleMessageReceived, handleError);
        }

        function handleTokenRefresh(token) {
            console.log('NotificationsService Token refreshed', token);
            var packageName = "com.oraclecorp.internal.ent1.omhvbcstest";
            var appVersion = "1.0.0";

            mobileBackend.notifications.registerForNotifications(token, packageName, appVersion, 'FCM')
                .then(handleRegisterForNotifications)
                .catch(handleError);
        }

        function handleRegisterForNotifications(response) {
            console.log('handleRegisterForNotifications >> ' + 'NotificationsService, device registered for notifications');
            console.log('handleRegisterForNotifications >> ' + response);
        }

        function handleMessageReceived(data) {
            console.log('NotificationsService Message received', JSON.stringify(data));
            console.log(data);
            
            //do something with the data
            let customData = JSON.parse(data.custom);
            let pageToNavigate = customData.page;
            
            myvbcsEventHelper.fireCustomEvent('navDrawerNavigation', {"detail": {"value":pageToNavigate}});
        }

        function handleError(error) {
            console.error('NotificationsService Error', error);
        }
        
        /** END - OMH Push Notifications Functions **/
            
        return {
            init: init,
            authenticate: authenticate,
            logout: logout,
            handleDeviceReady: handleDeviceReady
        };
}));