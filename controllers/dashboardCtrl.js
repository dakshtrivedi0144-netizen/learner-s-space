angular.module('learningPortalApp')
.controller('DashboardCtrl', ['$scope', function($scope) {
  $scope.studentInfo = { course: 'BTech Computer Engineering', subject: 'AngularJS (Unit I-V)' };
  $scope.searchTerm = '';
  $scope.sortField = 'hours';

  var unit1 = { id:1, title:'Unit I: Introduction to AngularJS', hours:8, topics:[
    { name:'MVC Architecture', material:'MVC separates an app into Model, View, and Controller. AngularJS enforces this through scope, templates, and the digest cycle.', example:'function MyCtrl($scope) { $scope.msg = "Hello"; }' },
    { name:'Introduction to AngularJS', material:'AngularJS is a JS framework by Google for building SPAs with directives, two-way binding, DI, routing, and form validation.', example:'<html ng-app="myApp"><body ng-controller="MainCtrl"><h1>{{title}}</h1></body></html>' },
    { name:'Setting up AngularJS via CDN', material:'Include AngularJS via CDN. Set ng-app on the root element. No npm needed.', example:'<script src="angular.min.js"></script>' },
    { name:'Two-way Data Binding', material:'ng-model changes update scope instantly and vice versa via the digest cycle.', example:'<input type="text" ng-model="name"><h2>Hello {{name}}</h2>' },
    { name:'ng-model directive', material:'ng-model binds form elements to scope and tracks pristine, dirty, valid, invalid, touched states.', example:'<input type="text" ng-model="name">' },
    { name:'Expressions and Interpolation', material:'Expressions evaluate against scope. Support arithmetic, ternary, filters. Sandboxed.', example:'<p>{{ 10 + 5 }}</p>' }
  ]};

  var unit2 = { id:2, title:'Unit II: Filters and Directives', hours:10, topics:[
    { name:'Built-in Filters', material:'Filters format data using pipe. lowercase, uppercase, currency, number, date, limitTo.', example:'<p>{{ "HELLO" | lowercase }}</p>' },
    { name:'orderBy Filter', material:'Sorts array by field before ng-repeat renders. Prefix dash for descending. Non-destructive.', example:'<li ng-repeat="s in students | orderBy:\'marks\'">{{s.name}}</li>' },
    { name:'filter Filter', material:'Selects array items matching a search string. Combined with ng-model enables live search.', example:'<input ng-model="search"><li ng-repeat="item in items | filter:search">{{item}}</li>' },
    { name:'ng-repeat Directive', material:'Iterates over arrays rendering a template per item. Exposes $index, $first, $last.', example:'<li ng-repeat="lang in languages">{{lang}}</li>' },
    { name:'ng-if / ng-show / ng-hide', material:'ng-if adds or removes from DOM. ng-show and ng-hide toggle CSS visibility.', example:'<p ng-if="show">In DOM only when true</p>' },
    { name:'Custom Element Directive', material:'restrict: "E" creates element directives. Use isolate scope to pass data via attributes.', example:'directive("greetCard", function(){ return { restrict:"E", template:"<div><h3>Hi</h3></div>" }; })' },
    { name:'Directive with Isolate Scope', material:'Use "=" for two-way binding, "@" for one-way string, "&" for callbacks.', example:'scope: { name: "=", role: "=" }' }
  ]};

  var unit3 = { id:3, title:'Unit III: Controllers and Scope', hours:8, topics:[
    { name:'Controllers and $scope', material:'Controllers populate $scope with data and functions. Each gets its own scope. Use DI array notation.', example:'.controller("MyCtrl", ["$scope", function($scope){ $scope.msg = "Hello"; }])' },
    { name:'Scope Inheritance', material:'Child controllers inherit parent scope via prototypal inheritance. Use objects to avoid primitive shadowing.', example:'<div ng-controller="ParentCtrl"><div ng-controller="ChildCtrl"><p>{{parentMsg}}</p></div></div>' },
    { name:'Event Handling: ng-click, ng-keyup', material:'ng-click binds to clicks. ng-keyup fires on key release. ng-change when input changes.', example:'<button ng-click="increment()">+1</button>' },
    { name:'ng-class and ng-style', material:'ng-class applies CSS classes dynamically. ng-style applies inline styles. Both reactive.', example:'<p ng-class="{highlight: isActive}">Dynamic</p>' },
    { name:'$watch and $apply', material:'$watch fires when scope value changes. $apply triggers digest manually for changes outside AngularJS.', example:'$scope.$watch("term", function(n, o){ console.log(o, "->", n); })' }
  ]};

  var unit4 = { id:4, title:'Unit IV: Forms and Validation', hours:8, topics:[
    { name:'Form States: pristine, dirty, touched', material:'pristine = never modified. dirty = modified. touched = blurred. valid and invalid reflect validation status.', example:'<form name="f"><input name="email" ng-model="email" required><p>Valid: {{f.$valid}}</p></form>' },
    { name:'Built-in Validators', material:'required, ng-minlength, ng-maxlength, ng-pattern, type="email". Errors via field.$error object.', example:'<input name="phone" ng-model="phone" required ng-pattern="/^\\d{10}$/">' },
    { name:'ng-invalid CSS Feedback', material:'AngularJS adds ng-invalid, ng-valid, ng-touched classes automatically. Style them in CSS.', example:'input.ng-invalid.ng-touched { border: 2px solid red; }' },
    { name:'Form Submission and Reset', material:'Disable submit with ng-disabled when invalid or pristine. After submit call $setPristine to reset.', example:'<button ng-disabled="f.$invalid" ng-click="submit(f)">Submit</button>' }
  ]};

  var unit5 = { id:5, title:'Unit V: Routing and HTTP', hours:8, topics:[
    { name:'$routeProvider and SPA Navigation', material:'Maps URL paths to templateUrl and controller. ng-view is the outlet. otherwise handles unknown routes.', example:'$rp.when("/home", { templateUrl: "views/home.html", controller: "HomeCtrl" }).otherwise({ redirectTo: "/home" })' },
    { name:'$http Service', material:'Built-in HTTP client returning a promise. .then for success, .catch for errors. Response has .data and .status.', example:'$http.get("data/items.json").then(function(res){ $scope.items = res.data; })' },
    { name:'$q and Promises', material:'$q.defer() creates a deferred. resolve(data) on success, reject(reason) on failure. Return deferred.promise.', example:'var d = $q.defer(); $timeout(function(){ d.resolve("Done"); }, 1000); return d.promise;' },
    { name:'AngularJS Services and DI', material:'Services are singletons shared via DI. Use .service() or .factory(). Always use DI array notation.', example:'.service("MathSvc", function(){ this.square = function(n){ return n*n; }; })' }
  ]};

  $scope.syllabus = [unit1, unit2, unit3, unit4, unit5];
}]);
