define(['resources/js/mbe'], function(mbe) {
  'use strict';

  var PageModule = function PageModule() {
    
    PageModule.prototype.login = function(username, password){
    
      //Init Mobile Backend
      mbe.init();
      
      //mbe.authenticate returns a Promise
      //.then returns a Promise
      return mbe.authenticate(username, password).then( 
          function(result){ 
              console.log("result > " + JSON.stringify(result));

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


    PageModule.prototype.getUserProfile = function(){
      
      
      return mbe.getCurrentUserProfile().then(
          function(data){
            
            console.log("getUserProfile: " + JSON.stringify(data));
            
            if (data && data.user){
              
              return data.user;
            }
            else{
              
              return {"_firstName":"No", "_lastName":"Data"};
            }
          },
          function(exception){
             
             console.log("getUserProfile error: " + JSON.stringify(exception));
             
             return {"_firstName":"No", "_lastName":"Data"};
          }
      );
    };
    
    PageModule.prototype.getUserPicture = function(){
      
      return mbe.getCurrentUserProfilePicture().then( 
          function(picture){
            
            console.log("getCurrentUserProfilePicture: " + picture._payload);
            
    
            var reader = new FileReader();
            if (picture._payload instanceof ArrayBuffer){
              
              console.log("getCurrentUserProfilePicture: " + "ArrayBuffer!");
              picture._payload = new Blob([new Uint8Array(picture._payload)]);
            }
            
            reader.readAsDataURL(picture._payload); 
            reader.onloadend = function() {

               document.getElementById("navigation-bar-avatar").setAttribute("src", reader.result);             
            };
          },
          function(exception){
             
             console.log("getCurrentUserProfilePicture error: " + JSON.stringify(exception));
          }
      );
    };
    
  };


  return PageModule;
});

