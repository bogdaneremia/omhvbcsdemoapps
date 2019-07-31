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

        //Backend Operations 
        function init() {

                //Initialise the mobile backend with the settings configured above
                mcs.init(mcs_config);
                mobileBackend = mcs.mobileBackend;
                mobileBackend.setAuthenticationType(mcs.AUTHENTICATION_TYPES.basic);
        };

        function authenticate(username, password) {
            //console.log("MBE authenticate > username=" + username + " password=" + password);
          
            return mobileBackend.authorization.authenticate(username, password);
        };

        function logout() {
            mobileBackend.authorization.logout();
        };
        
        function getCurrentUserProfile(){
          
            return mobileBackend.authorization.getCurrentUser();
        };
        
        function getCurrentUserProfilePicture(){
          
            //console.log("MBE profile: " + JSON.stringify(mobileBackend.storage.getCollection("ProfilePictures")));
            
            return mobileBackend.storage.getCollection("ProfilePictures").then(
                function(collection){
                  
                    console.log("MBE profile coll: " + JSON.stringify(collection));
                    
                    return collection.getObjects();
                },
                function(exception){
             
                   console.log("MBE profile coll error: " + JSON.stringify(exception));
                }
            ).then(
                function(objects){
                  
                    console.log("MBE profile objs: " + JSON.stringify(objects));
                    
                    //it should return one single object
                    if (objects && Array.isArray(objects)){
                      
                        var profilePictureObject = objects[0];
                        
                        console.log("MBE profile obj: " + JSON.stringify(profilePictureObject));
                        
                        //returns Promise
                        return profilePictureObject.readPayload("blob");
                    }
                },
                function(exception){
             
                   console.log("MBE profile obj error: " + JSON.stringify(exception));
                }       
            );
        };
            
        return {
            init: init,
            authenticate: authenticate,
            logout: logout,
            getCurrentUserProfile : getCurrentUserProfile,
            getCurrentUserProfilePicture : getCurrentUserProfilePicture
        };
}));