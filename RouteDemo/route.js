/**
 * Created by Amit Thakkar on 8/3/14.
 */
'use strict';

var users = [
    {id: 1, name: "Amit", age: 25},
    {id: 2, name: "NM", age: 43},
    {id: 3, name: "Kanika", age: 45}
];

/*
 * Master Controller, whose scope will be visible to whole body,
 * because we will mark it on body tag.
 * */
function MainController($scope) {
    $scope.mainPage = {
        title: "User Management"
    };
}

/*
 * UserListController, who is responsible for /user/list Url
 * and its scope will be visible to list.html only.
 * */
function UserListController($scope) {
    $scope.users = users;
    $scope.remove = function (id) {
        $scope.users = _.filter(users, function (user) {
            return user.id != id;
        });
        users = $scope.users;
    };
}

/*
 * CreateUserController, who is responsible for /user/create Url
 * and its scope will be visible to create.html only.
 * */
function CreateUserController($scope, $location) {
    $scope.user = {id: users.length + 1};
    $scope.add = function () {
        users.push(angular.copy($scope.user));
        $location.path("/user/show/" + $scope.user.id);
    };
    $scope.cancel = function () {
        $scope.user = {id: users.length + 1};
    };
}

/*
 * ShowUserController, who is responsible for /user/show Url
 * and its scope will be visible to show.html only.
 * */
function ShowUserController($scope, $routeParams) {
    $scope.user = _.find(users, function (user) {
        return user.id == $routeParams.id;
    });
}

/*
 * EditUserController, who is responsible for /user/edit Url
 * and its scope will be visible to edit.html only.
 * */
function EditUserController($scope, $routeParams, $location) {
    var currentUser = _.find(users, function (user) {
        return user.id == $routeParams.id;
    });
    $scope.user = angular.copy(currentUser);
    $scope.update = function () {
        users[$scope.user.id - 1] = angular.copy($scope.user);
        $location.path("/user/list");
    };
    $scope.cancel = function () {
        $scope.user = angular.copy(currentUser);
    };
}

/*
 * Route Mapping: defining route for routeTest module, and as from angular 1.2 version
 * ngRoute is now different module, which we have to include explicitly in depended module.
 * */
// Defining a module with name routeTest and providing ngRoute as dependency.
angular.module('routeTest', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        // Defining different pages with different URLs
        $routeProvider
            // If Url is /user/list then list.html will render and UserListController will execute.
            .when('/user/list', {templateUrl: 'partials/list.html', controller: UserListController})
            // If Url is /user/create then create.html will render and CreateUserController will execute.
            .when('/user/create', {templateUrl: 'partials/create.html', controller: CreateUserController})
            // If Url is /user/edit/:id then edit.html will render and EditUserController will execute.
            .when('/user/edit/:id', {templateUrl: 'partials/edit.html', controller: EditUserController})
            // If Url is /user/show/:id then show.html will render and ShowUserController will execute.
            .when('/user/show/:id', {templateUrl: 'partials/show.html', controller: ShowUserController})
            // TODO Define other URL mapping here.
            // If no URL matches then otherwise will execute and will redirect to /user/list
            .otherwise({redirectTo: '/user/list'});
    }]);
