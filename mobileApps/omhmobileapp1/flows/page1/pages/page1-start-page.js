define(["resources/js/testmodule"], function(testmodule) {
  'use strict';

  var PageModule = function PageModule() {
    
    PageModule.prototype.helloFromModule = function(){
      
      testmodule.hello();
    };
    
    PageModule.prototype.goodbyeFromModule = function(){
      
      testmodule.goodbye();
    };
  
  };

  return PageModule;
});
