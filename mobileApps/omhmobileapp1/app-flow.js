define(['resources/js/mbe'], function(mbe) {
  'use strict';

  var AppModule = function AppModule() {
    
      AppModule.prototype.logout = function(){
        
        mbe.logout();
      };
  };

  return AppModule;
});
