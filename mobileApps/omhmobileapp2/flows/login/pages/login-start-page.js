define(['resources/js/mbe'], function(mbe) {
  'use strict';

  var PageModule = function PageModule(context) {
    
    this.eventHelper = context.getEventHelper();
    
    PageModule.prototype.login = function(username, password){
    
      //Init Mobile Backend
      mbe.init(this.eventHelper);
      
      //mbe.authenticate returns a Promise
      //.then returns a Promise
      return mbe.authenticate(username, password).then( 
          function(result){ 
              console.log("result > " + JSON.stringify(result));

              //register to push notifications
              mbe.handleDeviceReady();

              return {
                "success" : true
              };
          },
          function(error){ 
              console.log("error > " + JSON.stringify(error));

              return {
                "success" : false
              };
          }
      );
      
      //PageModule.prototype.login returns a Promise
    };
    
  };
  
  return PageModule;
});

