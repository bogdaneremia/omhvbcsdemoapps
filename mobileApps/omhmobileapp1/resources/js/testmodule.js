(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
      // AMD
    define([], factory);
  } else if (typeof exports === 'object') {
      // CommonJS
    module.exports = factory();
  } else {
    // Browser globals (Note: root is window)
    root.returnExports = factory();
  }
}(this, function () {
  // Methods
  function notHelloOrGoodbye(){}; // A private method
  function hello(){
      window.alert("Hello!");
  }; // A public method because it's returned (see below)
  function goodbye(){
      window.alert("Goodbye!");
  }; // A public method because it's returned (see below)
 
  // Exposed public methods
  return {
      hello: hello,
      goodbye: goodbye
  };
}));