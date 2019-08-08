/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
define(['mcs/mcs', 'appController'],
    function (mcs, app) {
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

        //Backend Operations 
        function MobileBackend() {
            var self = this;
            self.mobileBackend;
            self.userName;
            self.password;

            self.init = () => {
                return new Promise((resolve, reject) => {
                    //Initialise the mobile backend with the settings configured above
                    mcs.init(mcs_config)
                    self.mobileBackend = mcs.mobileBackend;
                    self.mobileBackend.setAuthenticationType(mcs.AUTHENTICATION_TYPES.basic);
                })
            }
            
            //This handles success and failure callbacks using parameters (unlike the authAnonymous example)
            self.authenticate = function (username, password, successCallback, failureCallback) {
                self.mobileBackend.authorization.authenticate(username, password).then(result => {
                        //handleDeviceReady()
                        successCallback(result);
                    }, error => {
                        failureCallback(error);
                    });
            };

            //this handles success and failure callbacks using parameters
            self.logout = function () {
                self.mobileBackend.authorization.logout();
            };

            /*
            function handleDeviceReady() {
                MCSNotificationsCordovaPlugin.onTokenRefresh(handleTokenRefresh, handleError)
                MCSNotificationsCordovaPlugin.onMessageReceived(handleMessageReceived, handleError)
            }

            function handleTokenRefresh(token) {
                console.log('NotificationsService Token refreshed', token);
                var packageName = "org.oraclejet.mobileappnavdrawerhybridtest";
                var appVersion = "1.0.0";

                self.mobileBackend.notifications.registerForNotifications(token, packageName, appVersion, 'FCM')
                    .then(handleRegisterForNotifications)
                    .catch(handleError);
            }

            function handleRegisterForNotifications(response) {
                console.log('handleRegisterForNotifications >> ' + 'NotificationsService, device registered for notifications');
                console.log('handleRegisterForNotifications >> ' + response)
            }

            function handleMessageReceived(data) {
                console.log('NotificationsService Message received', JSON.stringify(data));
                console.log(data);
                //do something with the data
                let customData = JSON.parse(data.custom);
                let pageToNavigate = customData.page;
                require(['appController'],
                    function (app) {
                        oj.Router.sync().then(
                            function () {
                                app.router.go(pageToNavigate);
                            },
                            function (error) {
                                Logger.error('Error when starting router: ' + error.message);
                            })

                    })

            }

            function handleError(error) {
                console.error('NotificationsService Error', error);
            }
            */

            self.init();
        }
        return new MobileBackend();
    });