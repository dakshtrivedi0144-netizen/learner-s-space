angular.module('learningPortalApp', ['ngRoute'])

.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

  $locationProvider.hashPrefix('!');

  $routeProvider
    // Home - Semester Selector
    .when('/home', {
      templateUrl: 'views/home.html',
      controller: 'HomeCtrl'
    })
    // Semester - Subject List
    .when('/semester/:semId', {
      templateUrl: 'views/semester.html',
      controller: 'SemesterCtrl'
    })
    // AngularJS (6th Sem)
    .when('/overview', {
      templateUrl: 'views/overview.html',
      controller: 'DashboardCtrl'
    })
    .when('/practicals', {
      templateUrl: 'views/practicals.html',
      controller: 'LabCtrl'
    })
    .when('/references', {
      templateUrl: 'views/references.html',
      controller: 'ReferencesCtrl'
    })
    // Cloud Computing (6th Sem)
    .when('/cc-overview', {
      templateUrl: 'views/cc-overview.html',
      controller: 'CCDashboardCtrl'
    })
    .when('/cc-practicals', {
      templateUrl: 'views/cc-practicals.html',
      controller: 'CCLabCtrl'
    })
    // Data Mining & DW (6th Sem)
    .when('/dm-overview', {
      templateUrl: 'views/dm-overview.html',
      controller: 'DMDashboardCtrl'
    })
    .when('/dm-practicals', {
      templateUrl: 'views/dm-practicals.html',
      controller: 'DMLabCtrl'
    })
    .otherwise({ redirectTo: '/home' });
}]);
