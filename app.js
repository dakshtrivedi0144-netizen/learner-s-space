angular.module('learningPortalApp', ['ngRoute'])

.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

  $locationProvider.hashPrefix('!');

  $routeProvider
    .when('/login', {
      templateUrl: 'views/login.html',
      controller: 'AuthCtrl'
    })
    .when('/home', {
      templateUrl: 'views/home.html',
      controller: 'HomeCtrl'
    })
    .when('/semester/:semId', {
      templateUrl: 'views/semester.html',
      controller: 'SemesterCtrl'
    })
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
    .when('/cc-overview', {
      templateUrl: 'views/cc-overview.html',
      controller: 'CCDashboardCtrl'
    })
    .when('/cc-practicals', {
      templateUrl: 'views/cc-practicals.html',
      controller: 'CCLabCtrl'
    })
    .when('/dm-overview', {
      templateUrl: 'views/dm-overview.html',
      controller: 'DMDashboardCtrl'
    })
    .when('/dm-practicals', {
      templateUrl: 'views/dm-practicals.html',
      controller: 'DMLabCtrl'
    })
    .otherwise({ redirectTo: '/login' });
}])

.run(['$rootScope', '$location', function($rootScope, $location) {
  var SESSION_KEY = 'ulp_session';

  // Route guard — redirect to login if not authenticated
  $rootScope.$on('$routeChangeStart', function(event, next) {
    var isLogin = next.originalPath === '/login';
    var session = localStorage.getItem(SESSION_KEY);
    if (!isLogin && !session) {
      $location.path('/login');
    }
  });

  // Make current user available globally
  $rootScope.getCurrentUser = function() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)); }
    catch(e) { return null; }
  };

  $rootScope.logout = function() {
    localStorage.removeItem(SESSION_KEY);
    $location.path('/login');
  };
}]);
