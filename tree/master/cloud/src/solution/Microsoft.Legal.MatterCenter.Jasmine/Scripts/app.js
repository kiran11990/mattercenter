﻿
(function () {

    // Enter Global Config Values & Instantiate ADAL AuthenticationContext
    window.config = {
        instance: 'https://login.microsoftonline.com/',
        tenant: 'msmatter.onmicrosoft.com', //Enter tenant Name e.g. microsoft.onmicrosoft.com
        clientId: 'b94f07df-c825-431f-b9c5-b9499e8e9ac1', //Enter your app Client ID created in Azure Portal
        postLogoutRedirectUri: window.location.origin,
        //cacheLocation: 'localStorage', // enable this for IE, as sessionStorage does not work for localhost.
    };

    var authContext = new AuthenticationContext(config);

    // Get UI jQuery Objects
    //var $panel = $(".panel-body");
    var $userDisplay = $(".app-user");
    var $signInButton = $(".app-login");
    var $signOutButton = $(".app-logout");
    var $errorMessage = $(".app-error");
    var $apiBtn = $("#btnAPI");

    // Check For & Handle Redirect From AAD After Login
    var isCallback = authContext.isCallback(window.location.hash);
    authContext.handleWindowCallback();
    $errorMessage.html(authContext.getLoginError());

    if (isCallback && !authContext.getLoginError()) {
        window.location = authContext._getItem(authContext.CONSTANTS.STORAGE.LOGIN_REQUEST);
    }

    // Check Login Status, Update UI
    var user = authContext.getCachedUser();
    if (user) {
        $userDisplay.html(user.userName);
        $userDisplay.show();
        $signInButton.hide();
        $signOutButton.show();
    } else {
        $userDisplay.empty();
        $userDisplay.hide();
        $signInButton.show();
        $signOutButton.hide();
    }

    // Register NavBar Click Handlers
    $signOutButton.click(function () {
        authContext.logOut();
    });
    $(document).ready(function () {
        if (null == sessionStorage.getItem('adal.idtoken') || "" === sessionStorage.getItem('adal.idtoken')) {
            authContext.login();
        }
    });
}());