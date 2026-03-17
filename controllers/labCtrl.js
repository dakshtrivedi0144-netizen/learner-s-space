angular.module('learningPortalApp')
  .controller('LabCtrl', ['$scope', function($scope) {

    var practicalData = [
      {
        title: 'Hello World in AngularJS',
        aim: 'Create a basic AngularJS application that displays Hello World.',
        code: '<!DOCTYPE html>\n<html ng-app>\n<head>\n  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.3/angular.min.js"></script>\n</head>\n<body>\n  <h1>{{ "Hello, World!" }}</h1>\n</body>\n</html>'
      },
      {
        title: 'Two-way Data Binding with ng-model',
        aim: 'Demonstrate two-way data binding using ng-model.',
        code: '<div ng-app ng-controller="MyCtrl">\n  <input type="text" ng-model="name" placeholder="Enter name" />\n  <p>Hello, {{ name }}!</p>\n</div>\n\n<script>\nfunction MyCtrl($scope) {\n  $scope.name = "";\n}\n</script>'
      },
      {
        title: 'Using ng-bind and Expressions',
        aim: 'Use ng-bind and AngularJS expressions to display data.',
        code: '<div ng-app ng-controller="MyCtrl">\n  <p ng-bind="message"></p>\n  <p>Sum: {{ 10 + 20 }}</p>\n</div>\n\n<script>\nfunction MyCtrl($scope) {\n  $scope.message = "Welcome to AngularJS!";\n}\n</script>'
      },
      {
        title: 'Applying Built-in Filters: lowercase, uppercase',
        aim: 'Apply lowercase and uppercase filters to strings.',
        code: '<div ng-app>\n  <p>{{ "Hello World" | lowercase }}</p>\n  <p>{{ "Hello World" | uppercase }}</p>\n  <p>{{ "AngularJS" | uppercase }}</p>\n</div>'
      },
      {
        title: 'Applying the currency and date Filters',
        aim: 'Format numbers as currency and dates using built-in filters.',
        code: '<div ng-app ng-controller="MyCtrl">\n  <p>Price: {{ price | currency }}</p>\n  <p>Price (INR): {{ price | currency:"₹" }}</p>\n  <p>Today: {{ today | date:"dd/MM/yyyy" }}</p>\n</div>\n\n<script>\nfunction MyCtrl($scope) {\n  $scope.price = 1999.99;\n  $scope.today = new Date();\n}\n</script>'
      },
      {
        title: 'Using the orderBy Filter',
        aim: 'Sort a list of objects using the orderBy filter.',
        code: '<div ng-app ng-controller="MyCtrl">\n  <ul>\n    <li ng-repeat="s in students | orderBy:\'marks\'">\n      {{ s.name }} - {{ s.marks }}\n    </li>\n  </ul>\n</div>\n\n<script>\nfunction MyCtrl($scope) {\n  $scope.students = [\n    { name: "Alice", marks: 85 },\n    { name: "Bob",   marks: 72 },\n    { name: "Carol", marks: 91 }\n  ];\n}\n</script>'
      },
      {
        title: 'Using the filter Filter for Search',
        aim: 'Filter a list dynamically using the filter filter with ng-model.',
        code: '<div ng-app ng-controller="MyCtrl">\n  <input ng-model="search" placeholder="Search..." />\n  <ul>\n    <li ng-repeat="item in items | filter:search">{{ item }}</li>\n  </ul>\n</div>\n\n<script>\nfunction MyCtrl($scope) {\n  $scope.items = ["Apple","Banana","Cherry","Date","Elderberry"];\n}\n</script>'
      },
      {
        title: 'ng-repeat with Arrays',
        aim: 'Render a list of array items using ng-repeat.',
        code: '<div ng-app ng-controller="MyCtrl">\n  <ul>\n    <li ng-repeat="lang in languages">{{ lang }}</li>\n  </ul>\n</div>\n\n<script>\nfunction MyCtrl($scope) {\n  $scope.languages = ["JavaScript","Python","Java","C++","AngularJS"];\n}\n</script>'
      },
      {
        title: 'ng-repeat with Objects',
        aim: 'Iterate over object key-value pairs using ng-repeat.',
        code: '<div ng-app ng-controller="MyCtrl">\n  <p ng-repeat="(key, val) in student">\n    <strong>{{ key }}:</strong> {{ val }}\n  </p>\n</div>\n\n<script>\nfunction MyCtrl($scope) {\n  $scope.student = { name: "Alice", roll: "101", branch: "CE" };\n}\n</script>'
      },
      {
        title: 'ng-if, ng-show and ng-hide Directives',
        aim: 'Conditionally show/hide elements using ng-if, ng-show, ng-hide.',
        code: '<div ng-app ng-controller="MyCtrl">\n  <button ng-click="show = !show">Toggle</button>\n  <p ng-if="show">ng-if: I am in the DOM only when show=true</p>\n  <p ng-show="show">ng-show: I am always in DOM but hidden</p>\n  <p ng-hide="show">ng-hide: Visible when show=false</p>\n</div>\n\n<script>\nfunction MyCtrl($scope) { $scope.show = false; }\n</script>'
      },
      {
        title: 'ng-class and ng-style Directives',
        aim: 'Dynamically apply CSS classes and styles using ng-class and ng-style.',
        code: '<style>\n  .highlight { background: yellow; }\n  .bold { font-weight: bold; }\n</style>\n\n<div ng-app ng-controller="MyCtrl">\n  <p ng-class="{highlight: isHighlighted, bold: isBold}">\n    Dynamic Classes\n  </p>\n  <p ng-style="{color: textColor, fontSize: fontSize}">Dynamic Style</p>\n  <button ng-click="isHighlighted = !isHighlighted">Toggle Highlight</button>\n</div>\n\n<script>\nfunction MyCtrl($scope) {\n  $scope.isHighlighted = false;\n  $scope.isBold = true;\n  $scope.textColor = "blue";\n  $scope.fontSize = "20px";\n}\n</script>'
      },
      {
        title: 'Creating a Custom Element Directive',
        aim: 'Create a custom element directive that renders a greeting card.',
        code: '<div ng-app="myApp">\n  <greeting-card></greeting-card>\n</div>\n\n<script>\nangular.module("myApp", [])\n  .directive("greetingCard", function() {\n    return {\n      restrict: "E",\n      template: "<div style=\'border:1px solid #ccc;padding:10px\'>" +\n                "<h3>Welcome!</h3><p>This is a custom element directive.</p></div>"\n    };\n  });\n</script>'
      },
      {
        title: 'Creating a Custom Attribute Directive',
        aim: 'Create a custom attribute directive that highlights an element.',
        code: '<div ng-app="myApp">\n  <p highlight-text>This text is highlighted by a custom attribute directive.</p>\n</div>\n\n<script>\nangular.module("myApp", [])\n  .directive("highlightText", function() {\n    return {\n      restrict: "A",\n      link: function(scope, element) {\n        element.css({ background: "yellow", padding: "4px" });\n      }\n    };\n  });\n</script>'
      },
      {
        title: 'Directive with Isolate Scope',
        aim: 'Create a directive with isolate scope to pass data via attributes.',
        code: '<div ng-app="myApp" ng-controller="MyCtrl">\n  <user-card name="username" role="userrole"></user-card>\n</div>\n\n<script>\nangular.module("myApp", [])\n  .controller("MyCtrl", function($scope) {\n    $scope.username = "Alice";\n    $scope.userrole = "Admin";\n  })\n  .directive("userCard", function() {\n    return {\n      restrict: "E",\n      scope: { name: "=", role: "=" },\n      template: "<div><b>{{ name }}</b> — {{ role }}</div>"\n    };\n  });\n</script>'
      },
      {
        title: 'Directive with Transclusion',
        aim: 'Use ng-transclude to wrap content inside a custom directive.',
        code: '<div ng-app="myApp">\n  <panel-box>\n    <p>This content is transcluded inside the panel.</p>\n  </panel-box>\n</div>\n\n<script>\nangular.module("myApp", [])\n  .directive("panelBox", function() {\n    return {\n      restrict: "E",\n      transclude: true,\n      template: "<div style=\'border:2px solid #c0392b;padding:12px\'>" +\n                "<h4>Panel</h4><ng-transclude></ng-transclude></div>"\n    };\n  });\n</script>'
      },
      {
        title: 'Event Handling: ng-click',
        aim: 'Handle button click events using ng-click.',
        code: '<div ng-app ng-controller="MyCtrl">\n  <p>Count: {{ count }}</p>\n  <button ng-click="increment()">Increment</button>\n  <button ng-click="reset()">Reset</button>\n</div>\n\n<script>\nfunction MyCtrl($scope) {\n  $scope.count = 0;\n  $scope.increment = function() { $scope.count++; };\n  $scope.reset    = function() { $scope.count = 0; };\n}\n</script>'
      },
      {
        title: 'Event Handling: ng-keyup and ng-keydown',
        aim: 'Capture keyboard events using ng-keyup and ng-keydown.',
        code: '<div ng-app ng-controller="MyCtrl">\n  <input type="text" ng-model="text"\n         ng-keyup="onKeyUp($event)"\n         ng-keydown="onKeyDown($event)"\n         placeholder="Type something..." />\n  <p>Last key up: {{ lastKey }}</p>\n  <p>Character count: {{ text.length }}</p>\n</div>\n\n<script>\nfunction MyCtrl($scope) {\n  $scope.text = "";\n  $scope.lastKey = "";\n  $scope.onKeyUp   = function(e) { $scope.lastKey = e.key; };\n  $scope.onKeyDown = function(e) { console.log("Down:", e.key); };\n}\n</script>'
      },
      {
        title: 'Parent and Child Controllers with Scope Inheritance',
        aim: 'Demonstrate scope inheritance between parent and child controllers.',
        code: '<div ng-app ng-controller="ParentCtrl">\n  <p>Parent: {{ parentMsg }}</p>\n  <div ng-controller="ChildCtrl">\n    <p>Child sees parent: {{ parentMsg }}</p>\n    <p>Child own: {{ childMsg }}</p>\n  </div>\n</div>\n\n<script>\nfunction ParentCtrl($scope) {\n  $scope.parentMsg = "I am the parent";\n}\nfunction ChildCtrl($scope) {\n  $scope.childMsg = "I am the child";\n}\n</script>'
      },
      {
        title: 'AngularJS Form: pristine, dirty, touched States',
        aim: 'Track form state using $pristine, $dirty, and $touched.',
        code: '<div ng-app ng-controller="MyCtrl">\n  <form name="myForm">\n    <input name="email" type="email" ng-model="email" required />\n    <p>Pristine: {{ myForm.$pristine }}</p>\n    <p>Dirty:    {{ myForm.$dirty }}</p>\n    <p>Valid:    {{ myForm.$valid }}</p>\n    <p>Touched:  {{ myForm.email.$touched }}</p>\n  </form>\n</div>\n\n<script>\nfunction MyCtrl($scope) { $scope.email = ""; }\n</script>'
      },
      {
        title: 'Form Validation with required and ng-minlength',
        aim: 'Validate form fields using required and ng-minlength.',
        code: '<div ng-app ng-controller="MyCtrl">\n  <form name="myForm" novalidate>\n    <input name="username" ng-model="username"\n           required ng-minlength="3" />\n    <span ng-if="myForm.username.$error.required">Required!</span>\n    <span ng-if="myForm.username.$error.minlength">Min 3 chars!</span>\n    <button ng-disabled="myForm.$invalid">Submit</button>\n  </form>\n</div>\n\n<script>\nfunction MyCtrl($scope) { $scope.username = ""; }\n</script>'
      },
      {
        title: 'Form Validation with ng-pattern',
        aim: 'Validate input using a regular expression with ng-pattern.',
        code: '<div ng-app ng-controller="MyCtrl">\n  <form name="myForm" novalidate>\n    <input name="phone" ng-model="phone"\n           required ng-pattern="/^[0-9]{10}$/" />\n    <span ng-if="myForm.phone.$error.pattern">\n      Enter a valid 10-digit phone number.\n    </span>\n    <button ng-disabled="myForm.$invalid">Submit</button>\n  </form>\n</div>\n\n<script>\nfunction MyCtrl($scope) { $scope.phone = ""; }\n</script>'
      },
      {
        title: 'ng-invalid and ng-valid CSS Feedback',
        aim: 'Use ng-invalid and ng-valid CSS classes for visual feedback.',
        code: '<style>\n  input.ng-invalid.ng-touched { border: 2px solid red; }\n  input.ng-valid.ng-dirty     { border: 2px solid green; }\n</style>\n\n<div ng-app ng-controller="MyCtrl">\n  <form name="myForm" novalidate>\n    <input name="email" type="email" ng-model="email" required />\n    <p ng-if="myForm.email.$invalid && myForm.email.$touched"\n       style="color:red">Invalid email!</p>\n  </form>\n</div>\n\n<script>\nfunction MyCtrl($scope) { $scope.email = ""; }\n</script>'
      },
      {
        title: 'Custom Form Validator',
        aim: 'Create a custom validator directive for form fields.',
        code: '<div ng-app="myApp" ng-controller="MyCtrl">\n  <form name="myForm" novalidate>\n    <input name="code" ng-model="code" no-spaces required />\n    <span ng-if="myForm.code.$error.noSpaces">No spaces allowed!</span>\n    <button ng-disabled="myForm.$invalid">Submit</button>\n  </form>\n</div>\n\n<script>\nangular.module("myApp", [])\n  .directive("noSpaces", function() {\n    return {\n      require: "ngModel",\n      link: function(scope, el, attrs, ctrl) {\n        ctrl.$validators.noSpaces = function(val) {\n          return val ? val.indexOf(" ") === -1 : true;\n        };\n      }\n    };\n  })\n  .controller("MyCtrl", function($scope) { $scope.code = ""; });\n</script>'
      },
      {
        title: 'Configuring $routeProvider for SPA',
        aim: 'Configure client-side routing using $routeProvider.',
        code: 'angular.module("myApp", ["ngRoute"])\n  .config(["$routeProvider", function($routeProvider) {\n    $routeProvider\n      .when("/home", {\n        template: "<h2>Home Page</h2>",\n        controller: "HomeCtrl"\n      })\n      .when("/about", {\n        template: "<h2>About Page</h2>"\n      })\n      .otherwise({ redirectTo: "/home" });\n  }])\n  .controller("HomeCtrl", function($scope) {\n    $scope.msg = "Welcome Home!";\n  });\n\n// In HTML:\n// <a href="#!/home">Home</a>\n// <a href="#!/about">About</a>\n// <div ng-view></div>'
      },
      {
        title: 'Creating Multiple Views with ng-view',
        aim: 'Use ng-view as the outlet for SPA route templates.',
        code: '<!-- index.html -->\n<html ng-app="myApp">\n<body>\n  <nav>\n    <a href="#!/dashboard">Dashboard</a>\n    <a href="#!/profile">Profile</a>\n  </nav>\n  <div ng-view></div>\n  <script src="angular.min.js"></script>\n  <script src="angular-route.min.js"></script>\n  <script src="app.js"></script>\n</body>\n</html>\n\n// app.js\nangular.module("myApp", ["ngRoute"])\n  .config(["$routeProvider", function($rp) {\n    $rp.when("/dashboard", { template: "<h2>Dashboard</h2>" })\n       .when("/profile",   { template: "<h2>Profile</h2>" })\n       .otherwise({ redirectTo: "/dashboard" });\n  }]);'
      },
      {
        title: 'Using $http to Fetch JSON Data',
        aim: 'Fetch data from a JSON file using the $http service.',
        code: 'angular.module("myApp", [])\n  .controller("MyCtrl", ["$scope", "$http", function($scope, $http) {\n    $scope.users = [];\n    $http.get("data/users.json")\n      .then(function(response) {\n        $scope.users = response.data;\n      });\n  }]);\n\n// data/users.json\n// [{"name":"Alice"},{"name":"Bob"}]\n\n// HTML:\n// <li ng-repeat="u in users">{{ u.name }}</li>'
      },
      {
        title: 'Handling $http Errors',
        aim: 'Handle HTTP errors gracefully using .catch().',
        code: 'angular.module("myApp", [])\n  .controller("MyCtrl", ["$scope", "$http", function($scope, $http) {\n    $scope.data  = null;\n    $scope.error = "";\n\n    $http.get("data/items.json")\n      .then(function(res) {\n        $scope.data = res.data;\n      })\n      .catch(function(err) {\n        $scope.error = "Failed to load data. Status: " + err.status;\n      });\n  }]);\n\n// HTML:\n// <p ng-if="error" style="color:red">{{ error }}</p>\n// <ul><li ng-repeat="item in data">{{ item }}</li></ul>'
      },
      {
        title: 'Using $q and Promises',
        aim: 'Use $q to create and chain promises for async operations.',
        code: 'angular.module("myApp", [])\n  .controller("MyCtrl", ["$scope", "$q", "$timeout",\n  function($scope, $q, $timeout) {\n    $scope.result = "Waiting...";\n\n    function asyncTask() {\n      var deferred = $q.defer();\n      $timeout(function() {\n        deferred.resolve("Data loaded successfully!");\n      }, 1500);\n      return deferred.promise;\n    }\n\n    asyncTask().then(function(msg) {\n      $scope.result = msg;\n    });\n  }]);\n\n// HTML: <p>{{ result }}</p>'
      },
      {
        title: 'Creating a Reusable AngularJS Service',
        aim: 'Create a reusable service and inject it into a controller.',
        code: 'angular.module("myApp", [])\n  .service("MathService", function() {\n    this.square = function(n) { return n * n; };\n    this.cube   = function(n) { return n * n * n; };\n  })\n  .controller("MyCtrl", ["$scope", "MathService",\n  function($scope, MathService) {\n    $scope.num    = 4;\n    $scope.square = MathService.square($scope.num);\n    $scope.cube   = MathService.cube($scope.num);\n  }]);\n\n// HTML:\n// <p>Square: {{ square }}</p>\n// <p>Cube:   {{ cube }}</p>'
      },
      {
        title: 'Dependency Injection in Controllers and Services',
        aim: 'Demonstrate explicit Dependency Injection using array notation.',
        code: 'angular.module("myApp", [])\n  .service("GreetService", function() {\n    this.greet = function(name) {\n      return "Hello, " + name + "!";\n    };\n  })\n  .controller("MyCtrl",\n    ["$scope", "GreetService",\n    function($scope,  GreetService) {\n      $scope.message = GreetService.greet("BTech Student");\n    }\n  ]);\n\n// Array notation ensures DI works even after minification.\n// HTML: <p>{{ message }}</p>'
      }
    ];

    var STORAGE_KEY = 'ulp_practicals';

    function loadSaved() {
      try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
      catch(e) { return {}; }
    }

    function save() {
      var data = {};
      $scope.practicals.forEach(function(p) {
        data[p.id] = { completed: p.completed, notes: p.notes };
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    var saved = loadSaved();

    $scope.practicals = practicalData.map(function(p, i) {
      var id = i + 1;
      var s = saved[id] || {};
      return {
        id: id,
        title: p.title,
        aim: p.aim,
        code: p.code,
        completed: s.completed || false,
        notes: s.notes || '',
        showCode: false
      };
    });

    $scope.toggleComplete = function(practical) {
      practical.completed = !practical.completed;
      save();
    };

    $scope.toggleCode = function(practical) {
      practical.showCode = !practical.showCode;
    };

    $scope.saveNotes = function() {
      save();
    };

    $scope.completedCount = function() {
      return $scope.practicals.filter(function(p) { return p.completed; }).length;
    };
  }]);
