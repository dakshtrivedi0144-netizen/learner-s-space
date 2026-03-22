angular.module('learningPortalApp')
.controller('DashboardCtrl', ['$scope', '$location', function($scope, $location) {
  var user = JSON.parse(localStorage.getItem('ulp_session') || 'null');
  if (!user) { $location.path('/login'); return; }
  if (user.role === 'admin') { $location.path('/admin'); return; }
  if (user.role === 'faculty') { $location.path('/faculty'); return; }

  $scope.studentInfo = { course: 'BTech Computer Engineering', subject: 'AngularJS (Unit I-V)' };
  $scope.searchTerm = '';
  $scope.sortField = 'hours';

  var unit1 = { id:1, title:'Unit I: Introduction to AngularJS', hours:8, topics:[
    { name:'MVC Architecture', material:'MVC separates an app into Model, View, and Controller. AngularJS enforces this through $scope, templates, and the digest cycle.', example:'function MyCtrl($scope) { $scope.msg = "Hello"; }' },
    { name:'Introduction to AngularJS', material:'AngularJS is an open-source JS framework by Google (2010) for building SPAs. It extends HTML with directives, supports two-way data binding, DI, routing, and form validation.', example:'<html ng-app="myApp"><body ng-controller="MainCtrl"><h1>{{ title }}</h1></body></html>' },
    { name:'Setting up AngularJS via CDN', material:'Include AngularJS via CDN with a script tag. Set ng-app on the root element. Optionally include angular-route for SPA routing. No npm or build tools needed.', example:'<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.3/angular.min.js"></script>' },
    { name:'Two-way Data Binding', material:'Two-way binding links $scope and the view. When the user changes an ng-model input, $scope updates instantly. When $scope changes in the controller, the view updates instantly via the digest cycle.', example:'<input type="text" ng-model="name" /><h2>Hello, {{ name }}!</h2>' },
    { name:'ng-model directive', material:'ng-model binds form elements to $scope and integrates with form validation. It tracks field state (pristine, dirty, valid, invalid, touched) and adds CSS classes like ng-valid, ng-invalid automatically.', example:'<input type="text" ng-model="name" /><input type="checkbox" ng-model="agreed" />' },
    { name:'Expressions and Interpolation', material:'AngularJS expressions {{ }} are evaluated against $scope. They support arithmetic, comparisons, ternary operators, string concatenation, and filters. Sandboxed - no access to window or document.', example:'<p>{{ 10 + 5 * 2 }}</p><p>{{ age >= 18 ? "Adult" : "Minor" }}</p><p>{{ name | uppercase }}</p>' }
  ]};

  var unit2 = { id:2, title:'Unit II: Filters and Directives', hours:10, topics:[
    { name:'Built-in Filters', material:'Filters format data in templates using the pipe | character. lowercase/uppercase convert string case. currency formats numbers as money. number formats decimals. date formats timestamps. limitTo limits array length.', example:'<p>{{ "HELLO" | lowercase }}</p><p>{{ 1999.5 | currency:"Rs." }}</p><p>{{ 3.14159 | number:2 }}</p>' },
    { name:'orderBy Filter', material:'orderBy sorts an array by a field name before rendering with ng-repeat. Prefix with "-" for descending order. Non-destructive - the original $scope array is unchanged. Supports multi-field sorting.', example:'<li ng-repeat="s in students | orderBy:marks">{{ s.name }} - {{ s.marks }}</li>' },
    { name:'filter Filter', material:'The filter filter selects a subset of an array based on a search string or object. Combined with ng-model, it enables live search. Case-insensitive by default.', example:'<input ng-model="search" /><li ng-repeat="item in items | filter:search">{{ item }}</li>' },
    { name:'ng-repeat Directive', material:'ng-repeat iterates over arrays or objects and renders a template for each item. Exposes $index, $first, $last, $even, $odd. Use track by for performance. Supports nested ng-repeat.', example:'<li ng-repeat="lang in languages track by $index">{{ lang }}</li>' },
    { name:'ng-if, ng-show, ng-hide', material:'ng-if adds/removes elements from the DOM. ng-show/ng-hide toggle CSS visibility but keep the element in DOM. Use ng-if when the element should not exist at all; ng-show when toggling frequently.', example:'<p ng-if="show">In DOM only when show=true</p><p ng-show="show">Always in DOM</p>' },
    { name:'Custom Element Directive', material:'Custom directives extend HTML with new elements. restrict:"E" creates element directives. Use isolate scope to pass data via attributes. The template property defines the directive HTML.', example:'angular.module("myApp",[]).directive("greetCard", function() { return { restrict: "E", template: "<div><h3>Welcome!</h3></div>" }; });' },
    { name:'Directive with Isolate Scope', material:'Isolate scope prevents a directive from inheriting parent scope. Use = for two-way binding, @ for one-way string, and & for expression/callback. This is the foundation of the statusCard directive in this portal.', example:'.directive("userCard", function() { return { restrict: "E", scope: { name: "=", role: "=" }, template: "<b>{{ name }}</b> - {{ role }}" }; });' }
  ]};

  var unit3 = { id:3, title:'Unit III: Controllers and Scope', hours:8, topics:[
    { name:'Controllers and $scope', material:'Controllers are JS functions registered on the AngularJS module. They populate $scope with data and functions. Each controller gets its own $scope instance. Use DI array notation for minification safety.', example:'angular.module("myApp",[]).controller("MyCtrl", ["$scope", function($scope) { $scope.message = "Hello!"; }]);' },
    { name:'Scope Inheritance', material:'Child controllers inherit from parent scope via prototypal inheritance. A child can read parent properties. Use objects on scope (e.g. $scope.model.value) to avoid primitive shadowing issues.', example:'<div ng-controller="ParentCtrl"><p>{{ parentMsg }}</p><div ng-controller="ChildCtrl"><p>{{ parentMsg }}</p></div></div>' },
    { name:'Event Handling: ng-click, ng-keyup', material:'ng-click binds a function to click events. ng-keyup fires on key release. ng-keydown fires on key press. ng-change fires when an input value changes. All handlers receive $event as an optional parameter.', example:'<button ng-click="increment()">+1</button><input ng-keyup="onKey($event)" ng-model="text" /><p>Count: {{ count }}</p>' },
    { name:'ng-class and ng-style', material:'ng-class dynamically applies CSS classes based on boolean expressions. Pass an object where keys are class names and values are conditions. ng-style applies inline styles dynamically. Both update reactively.', example:'<p ng-class="{highlight: isActive, bold: isBold}">Dynamic</p><p ng-style="{color: textColor}">Styled</p>' },
    { name:'$watch and $apply', material:'$watch registers a listener that fires when a $scope value changes. $apply triggers the digest cycle manually - needed when changes happen outside AngularJS (e.g. setTimeout). Overusing $watch can hurt performance.', example:'$scope.$watch("searchTerm", function(newVal, oldVal) { console.log("Changed:", oldVal, "->", newVal); });' }
  ]};

  var unit4 = { id:4, title:'Unit IV: Forms and Validation', hours:8, topics:[
    { name:'Form States: pristine, dirty, touched', material:'AngularJS tracks form and field state automatically. pristine: never modified. dirty: modified at least once. touched: field has been blurred. valid/invalid reflect validation status.', example:'<form name="myForm"><input name="email" type="email" ng-model="email" required /><p>Pristine: {{ myForm.$pristine }}</p><p>Valid: {{ myForm.$valid }}</p></form>' },
    { name:'Built-in Validators', material:'required marks a field as mandatory. ng-minlength/ng-maxlength enforce string length. ng-pattern validates against a regex. type="email" adds format validation. Errors accessible via field.$error object.', example:'<input name="phone" ng-model="phone" required ng-pattern="/^[0-9]{10}$/" /><span ng-if="f.phone.$error.required">Required!</span>' },
    { name:'ng-invalid CSS Feedback', material:'AngularJS automatically adds ng-invalid/ng-valid and ng-touched CSS classes to form fields. Style these in CSS for visual feedback. Combine ng-invalid with ng-touched to only show errors after user interaction.', example:'input.ng-invalid.ng-touched { border: 2px solid red; } input.ng-valid.ng-dirty { border: 2px solid green; }' },
    { name:'Form Submission and Reset', material:'Use ng-submit on the form or ng-click on the submit button. Disable the button with ng-disabled when form is invalid or pristine. After submission, call form.$setPristine() and form.$setUntouched() to reset state.', example:'<form name="f" novalidate><input ng-model="data.name" required /><button ng-disabled="f.$invalid" ng-click="submit(f)">Submit</button></form>' }
  ]};

  var unit5 = { id:5, title:'Unit V: Routing and HTTP', hours:8, topics:[
    { name:'$routeProvider and SPA Navigation', material:'$routeProvider configures client-side routes. Each route maps a URL path to a templateUrl and controller. ng-view is the outlet where matched templates render. Browser back/forward buttons work via URL hash fragments.', example:'angular.module("myApp",["ngRoute"]).config(["$routeProvider", function($rp) { $rp.when("/home", { templateUrl:"views/home.html", controller:"HomeCtrl" }).otherwise({ redirectTo:"/home" }); }]);' },
    { name:'$http Service', material:'$http is AngularJS built-in HTTP client returning a promise. Use .then() for success and .catch() for errors. Supports GET, POST, PUT, DELETE. Response has .data, .status, .headers properties.', example:'$http.get("data/items.json").then(function(res) { $scope.items = res.data; }).catch(function(err) { $scope.error = "Failed: " + err.status; });' },
    { name:'$q and Promises', material:'$q is AngularJS promise library. Use $q.defer() to create a deferred. Call deferred.resolve(data) on success and deferred.reject(reason) on failure. Return deferred.promise for clean async code.', example:'function asyncTask() { var d = $q.defer(); $timeout(function() { d.resolve("Done!"); }, 1000); return d.promise; } asyncTask().then(function(msg) { $scope.result = msg; });' },
    { name:'AngularJS Services and DI', material:'Services are singletons shared across controllers via Dependency Injection. Use .service() for constructor functions or .factory() for factory functions. Always use DI array notation to survive minification.', example:'angular.module("myApp",[]).service("MathService", function() { this.square = function(n) { return n*n; }; }).controller("MyCtrl",["$scope","MathService", function($scope, MathService) { $scope.result = MathService.square(5); }]);' }
  ]};

  $scope.syllabus = [unit1, unit2, unit3, unit4, unit5];

}]);