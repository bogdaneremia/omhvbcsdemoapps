/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your dashboard ViewModel code goes here
 */
define(['knockout', 'appController', 'ojs/ojmodule-element-utils', 'ojs/ojcore', 'jquery', 'mbe/mbe', 'ojs/ojknockout', 'ojs/ojselectcombobox', 'ojs/ojbutton', 'ojs/ojinputtext'],
 function(ko, app, moduleUtils, oj, $, mbe) {

    function DashboardViewModel() {
      var self = this;

      // Header Config
      self.headerConfig = ko.observable({'view':[], 'viewModel':null});
      moduleUtils.createView({'viewPath':'views/header.html'}).then(function(view) {
        self.headerConfig({'view':view, 'viewModel':new app.getHeaderModel()})
      })

      // Below are a set of the ViewModel methods invoked by the oj-module component.
      // Please reference the oj-module jsDoc for additional information.

      /**
       * Optional ViewModel method invoked after the View is inserted into the
       * document DOM.  The application can put logic that requires the DOM being
       * attached here.
       * This method might be called multiple times - after the View is created
       * and inserted into the DOM and after the View is reconnected
       * after being disconnected.
       */
      self.connected = function() {
        // Implement if needed
      };

      /**
       * Optional ViewModel method invoked after the View is disconnected from the DOM.
       */
      self.disconnected = function() {
        // Implement if needed
      };

      /**
       * Optional ViewModel method invoked after transition to the new View is complete.
       * That includes any possible animation between the old and the new View.
       */
      self.transitionCompleted = function() {
        // Implement if needed
      };
      
      //CUSTOM
      self.isLoggedIn = ko.observable(false);

      //set these to defaults to enable login testing
      self.username = ko.observable("username");
      self.password = ko.observable("password");

      //pass callbacks to the login to trigger page behavior on success or failure
      self.login = function () {
          mbe.authenticate(self.username(), self.password(), self.loginSuccess, self.loginFailure);
      };

      //pass callbacks to the login to trigger page behavior on success or failure
      self.logout = function () {
          mbe.logout();
          self.isLoggedIn(false);
      };

      self.loginSuccess = function (response) {
          console.log("loginSuccess: ");
          
          console.log(response);
          self.isLoggedIn(true);
      };

      self.loginFailure = function (statusCode) {
          console.log("loginFailure: ");
          
          self.isLoggedIn(false);
          alert("Login failed! " + JSON.strigify(statusCode));
      };
    }

    /*
     * Returns a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.  Return an instance of the ViewModel if
     * only one instance of the ViewModel is needed.
     */
    return new DashboardViewModel();
  }
);
