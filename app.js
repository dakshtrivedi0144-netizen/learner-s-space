angular.module('learningPortalApp', ['ngRoute'])

.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

  $locationProvider.hashPrefix('!');

  $routeProvider
    .when('/login', {
      templateUrl: 'views/login.html',
      controller: 'AuthCtrl'
    })
    .when('/admin', {
      templateUrl: 'views/admin.html',
      controller: 'AdminCtrl'
    })
    .when('/faculty', {
      templateUrl: 'views/faculty.html',
      controller: 'FacultyCtrl'
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
    .when('/lab-manual/:subjectId', {
      templateUrl: 'views/lab-manual.html',
      controller: 'LabManualCtrl'
    })
    .when('/change-password', {
      templateUrl: 'views/change-password.html',
      controller: 'ChangePasswordCtrl'
    })
    .otherwise({ redirectTo: '/login' });
}])

.run(['$rootScope', '$location', function($rootScope, $location) {
  var SESSION_KEY = 'ulp_session';
  var USERS_KEY   = 'ulp_users';
  var SYLLABUS_KEY = 'ulp_syllabus';

  // ── Seed demo accounts ────────────────────────────────
  var users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
  if (!users['ADMIN001']) {
    users['ADMIN001'] = { name:'Admin User', regNo:'ADMIN001', faculty:'Faculty of Engineering & Technology', branch:'Computer Engineering', semester:'6', role:'admin', password:'Admin@123', createdAt: new Date().toISOString() };
  }
  if (!users['FAC001']) {
    users['FAC001'] = { name:'Prof. Sharma', regNo:'FAC001', faculty:'Faculty of Engineering & Technology', branch:'Computer Engineering', semester:'6', role:'faculty', password:'Faculty@123', createdAt: new Date().toISOString() };
  }
  if (!users['STU001']) {
    users['STU001'] = { name:'Daksh Trivedi', regNo:'STU001', faculty:'Faculty of Engineering & Technology', branch:'Computer Engineering', semester:'6', role:'student', password:'Student@123', createdAt: new Date().toISOString() };
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  // ── Seed theory syllabus (only if not already saved) ──
  var syllabus = JSON.parse(localStorage.getItem(SYLLABUS_KEY) || '{}');
  if (!syllabus['angularjs']) {
    syllabus['angularjs'] = { units: [
      { id:1, title:'Unit I: Introduction to AngularJS', hours:8, topics:[{name:'MVC Architecture'},{name:'Introduction to AngularJS'},{name:'Setting up AngularJS via CDN'},{name:'Two-way Data Binding'},{name:'ng-model directive'},{name:'Expressions and Interpolation'}] },
      { id:2, title:'Unit II: Filters and Directives', hours:10, topics:[{name:'Built-in Filters'},{name:'orderBy Filter'},{name:'filter Filter'},{name:'ng-repeat Directive'},{name:'ng-if, ng-show, ng-hide'},{name:'Custom Element Directive'},{name:'Directive with Isolate Scope'}] },
      { id:3, title:'Unit III: Controllers and Scope', hours:8, topics:[{name:'Controllers and $scope'},{name:'Scope Inheritance'},{name:'Event Handling: ng-click, ng-keyup'},{name:'ng-class and ng-style'},{name:'$watch and $apply'}] },
      { id:4, title:'Unit IV: Forms and Validation', hours:8, topics:[{name:'Form States: pristine, dirty, touched'},{name:'Built-in Validators'},{name:'ng-invalid CSS Feedback'},{name:'Form Submission and Reset'}] },
      { id:5, title:'Unit V: Routing and HTTP', hours:8, topics:[{name:'$routeProvider and SPA Navigation'},{name:'$http Service'},{name:'$q and Promises'},{name:'AngularJS Services and DI'}] }
    ]};
  }
  if (!syllabus['cloud-computing']) {
    syllabus['cloud-computing'] = { units: [
      { id:1, title:'Unit I: Fundamentals of Cluster, Grid and Cloud Computing', hours:10, topics:[{name:'Introduction to Cloud Computing'},{name:'Benefits and Limitations'},{name:'Cluster Computing'},{name:'Grid Computing'},{name:'Service Models (IaaS, PaaS, SaaS)'},{name:'Deployment Models'},{name:'Cloud Ecosystem'}] },
      { id:2, title:'Unit II: Cloud Technologies', hours:8, topics:[{name:'Cloud Layers and Architecture'},{name:'Hypervisors and Types'},{name:'Machine Imaging'},{name:'Virtualization and Types'},{name:'Load Balancer and Types'},{name:'Comparison of Cloud Providers'}] },
      { id:3, title:'Unit III: Management, Monitoring and MapReduce', hours:9, topics:[{name:'Identity Management and Access Control'},{name:'Accounts Monitoring'},{name:'Introduction to MapReduce'},{name:'MapReduce Programming Model'},{name:'Hadoop and HDFS'}] },
      { id:4, title:'Unit IV: Cloud Security and Disaster Recovery', hours:9, topics:[{name:'Security Aspects in Cloud'},{name:'Challenges and Risks'},{name:'Data Security Methods and Tools'},{name:'Application Security'},{name:'Disaster Recovery Plans'}] },
      { id:5, title:'Unit V: Edge Computing and Case Studies', hours:9, topics:[{name:'Introduction to AWS'},{name:'AWS Different Services'},{name:'Edge Computing'},{name:'Eucalyptus'},{name:'Windows Azure'},{name:'Google App Engine'},{name:'Aneka'}] }
    ]};
  }
  if (!syllabus['dm-dw']) {
    syllabus['dm-dw'] = { units: [
      { id:1, title:'Unit I: Fundamentals of DM & DW', hours:9, topics:[{name:'Importance and Applications'},{name:'Major Issues in Mining and Warehousing'},{name:'Structured and Unstructured Data'},{name:'OLAP vs OLTP'},{name:'OLAP Operations'},{name:'Data Warehouse Schemas'},{name:'Business Analytics'}] },
      { id:2, title:'Unit II: Architecture and Processes', hours:9, topics:[{name:'Three-tier Architecture of DW'},{name:'Architecture of DM Systems'},{name:'ETL Process'},{name:'Classification of DM Systems'},{name:'KDD Process'},{name:'Enterprise Data Management'}] },
      { id:3, title:'Unit III: Data Preprocessing', hours:10, topics:[{name:'Need for Preprocessing'},{name:'Data Cleaning: Missing Values'},{name:'Data Cleaning: Outliers and Noisy Data'},{name:'Data Summarization and Integration'},{name:'Data Transformation and Reduction'},{name:'Data Discretization and Hierarchy'}] },
      { id:4, title:'Unit IV: Association Rule Mining', hours:8, topics:[{name:'Concept Descriptions and Attribute Relevance'},{name:'Association Rule Mining'},{name:'Frequent Itemset Generation'},{name:'Apriori Algorithm'},{name:'Evaluation of Association Rules'},{name:'Market Basket Analysis'}] },
      { id:5, title:'Unit V: Classification & Clustering', hours:9, topics:[{name:'Overview of Classification and Clustering'},{name:'Decision Trees'},{name:'Naïve Bayes and Bayes Theorem'},{name:'K-Means and K-Medoids Clustering'},{name:'Hierarchical Clustering'},{name:'Support Vector Machines'}] }
    ]};
  }
  localStorage.setItem(SYLLABUS_KEY, JSON.stringify(syllabus));

  // ── Seed default practicals (only if not already saved by faculty) ──
  var PRACTICALS_KEY = 'ulp_practicals';
  var SEED_VERSION   = 'ulp_seed_v2';
  var practicals = JSON.parse(localStorage.getItem(PRACTICALS_KEY) || '{}');
  var alreadySeeded = localStorage.getItem(SEED_VERSION);

  if (!alreadySeeded || !practicals['angularjs'] || !practicals['angularjs'].length) {
    practicals['angularjs'] = [
      { title:'Hello World in AngularJS', aim:'Create a basic AngularJS application that displays Hello World.', code:'<!DOCTYPE html>\n<html ng-app>\n<head>\n  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.3/angular.min.js"></script>\n</head>\n<body>\n  <h1>{{ "Hello, World!" }}</h1>\n</body>\n</html>' },
      { title:'Two-way Data Binding with ng-model', aim:'Demonstrate two-way data binding using ng-model.', code:'<div ng-app ng-controller="MyCtrl">\n  <input type="text" ng-model="name" placeholder="Enter name" />\n  <p>Hello, {{ name }}!</p>\n</div>' },
      { title:'Using ng-bind and Expressions', aim:'Use ng-bind and AngularJS expressions to display data.', code:'<div ng-app ng-controller="MyCtrl">\n  <p ng-bind="message"></p>\n  <p>Sum: {{ 10 + 20 }}</p>\n</div>' },
      { title:'Applying Built-in Filters: lowercase, uppercase', aim:'Apply lowercase and uppercase filters to strings.', code:'<div ng-app>\n  <p>{{ "Hello World" | lowercase }}</p>\n  <p>{{ "Hello World" | uppercase }}</p>\n</div>' },
      { title:'Applying the currency and date Filters', aim:'Format numbers as currency and dates using built-in filters.', code:'<div ng-app ng-controller="MyCtrl">\n  <p>Price: {{ price | currency:"₹" }}</p>\n  <p>Today: {{ today | date:"dd/MM/yyyy" }}</p>\n</div>' },
      { title:'Using the orderBy Filter', aim:'Sort a list of objects using the orderBy filter.', code:'<li ng-repeat="s in students | orderBy:\'marks\'">{{ s.name }} - {{ s.marks }}</li>' },
      { title:'Using the filter Filter for Search', aim:'Filter a list dynamically using the filter filter with ng-model.', code:'<input ng-model="search" />\n<li ng-repeat="item in items | filter:search">{{ item }}</li>' },
      { title:'ng-repeat with Arrays', aim:'Render a list of array items using ng-repeat.', code:'<li ng-repeat="lang in languages">{{ lang }}</li>' },
      { title:'ng-repeat with Objects', aim:'Iterate over object key-value pairs using ng-repeat.', code:'<p ng-repeat="(key, val) in student"><strong>{{ key }}:</strong> {{ val }}</p>' },
      { title:'ng-if, ng-show and ng-hide Directives', aim:'Conditionally show/hide elements using ng-if, ng-show, ng-hide.', code:'<p ng-if="show">ng-if: in DOM only when true</p>\n<p ng-show="show">ng-show: always in DOM</p>' },
      { title:'ng-class and ng-style Directives', aim:'Dynamically apply CSS classes and styles.', code:'<p ng-class="{highlight: isHighlighted}">Dynamic Classes</p>\n<p ng-style="{color: textColor}">Dynamic Style</p>' },
      { title:'Creating a Custom Element Directive', aim:'Create a custom element directive that renders a greeting card.', code:'angular.module("myApp",[])\n  .directive("greetingCard", function() {\n    return { restrict:"E", template:"<div><h3>Welcome!</h3></div>" };\n  });' },
      { title:'Creating a Custom Attribute Directive', aim:'Create a custom attribute directive that highlights an element.', code:'angular.module("myApp",[])\n  .directive("highlightText", function() {\n    return { restrict:"A", link: function(scope, el) { el.css({background:"yellow"}); } };\n  });' },
      { title:'Directive with Isolate Scope', aim:'Create a directive with isolate scope to pass data via attributes.', code:'.directive("userCard", function() {\n  return { restrict:"E", scope:{name:"=",role:"="}, template:"<div><b>{{ name }}</b> — {{ role }}</div>" };\n});' },
      { title:'Directive with Transclusion', aim:'Use ng-transclude to wrap content inside a custom directive.', code:'.directive("panelBox", function() {\n  return { restrict:"E", transclude:true, template:"<div><ng-transclude></ng-transclude></div>" };\n});' },
      { title:'Event Handling: ng-click', aim:'Handle button click events using ng-click.', code:'<p>Count: {{ count }}</p>\n<button ng-click="increment()">Increment</button>\n<button ng-click="reset()">Reset</button>' },
      { title:'Event Handling: ng-keyup and ng-keydown', aim:'Capture keyboard events using ng-keyup and ng-keydown.', code:'<input ng-model="text" ng-keyup="onKeyUp($event)" />\n<p>Last key: {{ lastKey }}</p>' },
      { title:'Parent and Child Controllers with Scope Inheritance', aim:'Demonstrate scope inheritance between parent and child controllers.', code:'<div ng-controller="ParentCtrl">\n  <p>{{ parentMsg }}</p>\n  <div ng-controller="ChildCtrl"><p>{{ childMsg }}</p></div>\n</div>' },
      { title:'AngularJS Form: pristine, dirty, touched States', aim:'Track form state using $pristine, $dirty, and $touched.', code:'<form name="myForm">\n  <input name="email" type="email" ng-model="email" required />\n  <p>Pristine: {{ myForm.$pristine }} | Valid: {{ myForm.$valid }}</p>\n</form>' },
      { title:'Form Validation with required and ng-minlength', aim:'Validate form fields using required and ng-minlength.', code:'<input name="username" ng-model="username" required ng-minlength="3" />\n<span ng-if="myForm.username.$error.required">Required!</span>' },
      { title:'Form Validation with ng-pattern', aim:'Validate input using a regular expression with ng-pattern.', code:'<input name="phone" ng-model="phone" required ng-pattern="/^[0-9]{10}$/" />\n<span ng-if="myForm.phone.$error.pattern">Enter valid 10-digit number.</span>' },
      { title:'ng-invalid and ng-valid CSS Feedback', aim:'Use ng-invalid and ng-valid CSS classes for visual feedback.', code:'input.ng-invalid.ng-touched { border: 2px solid red; }\ninput.ng-valid.ng-dirty { border: 2px solid green; }' },
      { title:'Custom Form Validator', aim:'Create a custom validator directive for form fields.', code:'.directive("noSpaces", function() {\n  return { require:"ngModel", link: function(scope,el,attrs,ctrl) {\n    ctrl.$validators.noSpaces = function(val) { return val ? val.indexOf(" ")===-1 : true; };\n  }};\n});' },
      { title:'Configuring $routeProvider for SPA', aim:'Configure client-side routing using $routeProvider.', code:'angular.module("myApp",["ngRoute"])\n  .config(["$routeProvider", function($rp) {\n    $rp.when("/home", { template:"<h2>Home</h2>" }).otherwise({ redirectTo:"/home" });\n  }]);' },
      { title:'Creating Multiple Views with ng-view', aim:'Use ng-view as the outlet for SPA route templates.', code:'<a href="#!/dashboard">Dashboard</a>\n<a href="#!/profile">Profile</a>\n<div ng-view></div>' },
      { title:'Using $http to Fetch JSON Data', aim:'Fetch data from a JSON file using the $http service.', code:'$http.get("data/users.json").then(function(res){ $scope.users=res.data; });' },
      { title:'Handling $http Errors', aim:'Handle HTTP errors gracefully using .catch().', code:'$http.get("data/items.json")\n  .then(function(res){ $scope.data=res.data; })\n  .catch(function(err){ $scope.error="Failed: "+err.status; });' },
      { title:'Using $q and Promises', aim:'Use $q to create and chain promises for async operations.', code:'function asyncTask(){\n  var d=$q.defer();\n  $timeout(function(){ d.resolve("Done!"); },1500);\n  return d.promise;\n}\nasyncTask().then(function(msg){ $scope.result=msg; });' },
      { title:'Creating a Reusable AngularJS Service', aim:'Create a reusable service and inject it into a controller.', code:'angular.module("myApp",[])\n  .service("MathService", function(){\n    this.square=function(n){return n*n;};\n  })\n  .controller("MyCtrl",["$scope","MathService",function($scope,MathService){\n    $scope.square=MathService.square(4);\n  }]);' },
      { title:'Dependency Injection in Controllers and Services', aim:'Demonstrate explicit Dependency Injection using array notation.', code:'.controller("MyCtrl",["$scope","GreetService",function($scope,GreetService){\n  $scope.message=GreetService.greet("BTech Student");\n}]);' }
    ];
  }

  if (!alreadySeeded || !practicals['cloud-computing'] || !practicals['cloud-computing'].length) {
    practicals['cloud-computing'] = [
      { title:'Cloud Service Models with Real-time Examples', aim:'Describe and discuss cloud service models (IaaS, PaaS, SaaS) with real-time examples.', code:'// IaaS: AWS EC2, PaaS: Google App Engine, SaaS: Gmail' },
      { title:'Create EC2 Instance for Windows on AWS', aim:'Apply the AWS console to create an EC2 instance for Windows.', code:'// EC2 → Launch Instance → Windows Server 2022 → t2.micro → Launch' },
      { title:'Create S3 Bucket and Store Image File', aim:'Demonstrate the creation of an S3 Bucket, store an image file, and use the generated URL to open it.', code:'// S3 → Create Bucket → Upload image.jpg → Get Object URL' },
      { title:'S3 Versioning', aim:'Analyze S3 versioning by creating an S3 bucket, enabling versioning, and showing different versions.', code:'// Bucket → Properties → Versioning → Enable → Upload same file multiple times' },
      { title:'Create EBS Volume and Attach to EC2', aim:'Demonstrate the creation of an EBS volume, attach it to an EC2 instance, store a file on the volume.', code:'// EC2 → Volumes → Create → Attach → sudo mount /dev/xvdf /mydata' },
      { title:'Create EC2 Instance for Ubuntu on AWS', aim:'Apply the AWS console to create an EC2 instance for Ubuntu.', code:'// EC2 → Ubuntu 22.04 LTS → t2.micro → SSH connect' },
      { title:'AWS Pricing Calculator', aim:'Outline the functionality of the AWS Pricing Calculator.', code:'// calculator.aws → Add EC2, S3, RDS → View monthly estimate' },
      { title:'Different Services of AWS', aim:'Illustrate and explain different services of AWS.', code:'// Compute: EC2, Lambda | Storage: S3, EBS | DB: RDS, DynamoDB | Network: VPC, Route53' },
      { title:'Deploy IIS on EC2 Ubuntu Server', aim:'Design a strategy to deploy IIS on an EC2 Ubuntu server.', code:'// sudo apt install apache2 -y && sudo systemctl start apache2' },
      { title:'Aneka/Eucalyptus Architecture', aim:'Sketch and analyze Aneka/Eucalyptus architecture.', code:'// Eucalyptus: CLC → CC → NC | Aneka: Master → Workers → Programming Models' },
      { title:'Microsoft Windows Azure Architecture', aim:'Sketch out and examine the architecture of Microsoft Windows Azure.', code:'// Fabric Controller → Compute/Storage/Networking → ARM → Resources' },
      { title:'Host Static Website on S3', aim:'Implement and use S3 to host a static website.', code:'// S3 → Static Website Hosting → Enable → Upload index.html → Public policy' },
      { title:'Auto Scaling using EC2 Windows', aim:'Implement auto scaling using EC2 Windows.', code:'// Launch Template → Auto Scaling Group → Target Tracking Policy (CPU 70%)' },
      { title:'Host Static Website on Ubuntu Server', aim:'Implement and use an Ubuntu server to host a static website.', code:'// sudo apt install nginx -y → /var/www/html/index.html → http://<public-ip>' },
      { title:'Deploy IIS Windows Server using EC2', aim:'Demonstrate and make publicly available an IIS Windows Server using an EC2 instance.', code:'// Windows EC2 → RDP → Server Manager → Add Roles → Web Server (IIS) → Install' }
    ];
  }

  if (!alreadySeeded || !practicals['dm-dw'] || !practicals['dm-dw'].length) {
    practicals['dm-dw'] = [
      { title:'Compare DM & DW Tools', aim:'Identify and compare features of popular Data Mining and Data Warehousing tools.', code:'// DM: WEKA, RapidMiner, scikit-learn | DW: Redshift, BigQuery, Snowflake' },
      { title:'Data Cube - Snowflake Schema (Airport)', aim:'Design and create a data cube using a snowflake schema for an Airport Authority dataset.', code:'CREATE TABLE Flight_Fact (flight_id INT, date_id INT, airport_id INT, airline_id INT, passengers INT, revenue DECIMAL(10,2));' },
      { title:'Data Cube - Fact Constellation (Cricket)', aim:'Design and create a data cube using a Fact constellation schema for a Cricket Team dataset.', code:'CREATE TABLE Batting_Fact (player_id INT, match_id INT, runs_scored INT);\nCREATE TABLE Bowling_Fact (player_id INT, match_id INT, wickets INT);' },
      { title:'OLAP Operations - Courier Company', aim:'Perform OLAP operations: slice, dice, roll-up, drill-down on a courier company cube.', code:'-- SLICE: WHERE service_type="Express"\n-- DICE: WHERE region IN ("North","South")\n-- ROLL-UP: GROUP BY YEAR(date)\n-- DRILL-DOWN: GROUP BY YEAR, MONTH' },
      { title:'Attribute Relevance - Weather Data', aim:'Analyze attribute relevance using a weather data warehouse.', code:'from sklearn.feature_selection import mutual_info_classif\nscores = mutual_info_classif(X, y)\nfor f, s in zip(X.columns, scores): print(f"{f}: {s:.4f}")' },
      { title:'Hadoop Framework for Distributed Processing', aim:'Demonstrate the use of Hadoop Framework for distributed data processing.', code:'# mapper.py: emit (word, 1) for each word\n# reducer.py: sum counts per word\n# hadoop jar streaming.jar -mapper mapper.py -reducer reducer.py' },
      { title:'Social Media Data Mining', aim:'Explore and analyze patterns from social media data.', code:'import re; from collections import Counter\nall_tags = [t for text in df.text for t in re.findall(r"#\\w+", text)]\nprint(Counter(all_tags).most_common(5))' },
      { title:'Naïve Bayes Classification', aim:'Implement Naïve Bayes algorithm to generate classification rules.', code:'from sklearn.naive_bayes import CategoricalNB\nmodel = CategoricalNB(); model.fit(X, y)\nprint("Accuracy:", (model.predict(X)==y).mean())' },
      { title:'Data Preprocessing Techniques', aim:'Apply preprocessing: handling missing values, sampling, and binning.', code:'df["age"].fillna(df["age"].median(), inplace=True)\ndf["age_group"] = pd.cut(df["age"], bins=[0,30,40,60], labels=["Young","Middle","Senior"])' },
      { title:'Apriori Algorithm', aim:'Implement the Apriori algorithm to discover frequent itemsets and generate association rules.', code:'from mlxtend.frequent_patterns import apriori, association_rules\nfreq = apriori(df, min_support=0.375, use_colnames=True)\nrules = association_rules(freq, metric="confidence", min_threshold=0.6)' },
      { title:'K-Means and K-Medoids Clustering', aim:'Perform clustering using K-Means and K-Medoids.', code:'from sklearn.cluster import KMeans\nkm = KMeans(n_clusters=3, random_state=42, n_init=10)\nkm.fit(X)\nprint("Inertia:", km.inertia_)' },
      { title:'Regression using WEKA', aim:'Evaluate regression techniques using WEKA.', code:'// WEKA: Preprocess → housing.arff → Classify → LinearRegression → 10-fold CV → Start' },
      { title:'Binning and Histogram Analysis', aim:'Implement binning and histogram analysis.', code:'df["ew_bin"] = pd.cut(df["age"], bins=5)\ndf["ef_bin"] = pd.qcut(df["age"], q=5, duplicates="drop")\nplt.hist(ages, bins=10); plt.savefig("histogram.png")' },
      { title:'Classification Process on Given Data', aim:'Demonstrate classification process on given data.', code:'from sklearn.tree import DecisionTreeClassifier\ndt = DecisionTreeClassifier(max_depth=3)\ndt.fit(X_train, y_train)\nprint("Accuracy:", accuracy_score(y_test, dt.predict(X_test)))' },
      { title:'Compare Classifiers using Confusion Matrix', aim:'Compare classification algorithm accuracies using a confusion matrix.', code:'for name, clf in clfs.items():\n  clf.fit(X_tr, y_tr)\n  print(f"{name}: {accuracy_score(y_te, clf.predict(X_te)):.4f}")' }
    ];
  }

  localStorage.setItem(PRACTICALS_KEY, JSON.stringify(practicals));
  localStorage.setItem(SEED_VERSION, '1');

  // ── Route guard ───────────────────────────────────────
  $rootScope.$on('$routeChangeStart', function(event, next) {
    var isLogin = next.originalPath === '/login';
    var session = localStorage.getItem(SESSION_KEY);

    // If already logged in and trying to access login page, redirect to dashboard
    if (isLogin && session) {
      var loggedIn = JSON.parse(session);
      if (loggedIn) {
        if (loggedIn.role === 'admin') { $location.path('/admin'); }
        else if (loggedIn.role === 'faculty') { $location.path('/faculty'); }
        else { $location.path('/home'); }
        return;
      }
    }

    if (!isLogin && !session) {
      $location.path('/login');
    }
    // Block non-admin from /admin
    if (next.originalPath === '/admin') {
      var u = JSON.parse(session || 'null');
      if (!u || u.role !== 'admin') { $location.path('/home'); }
    }
    // Block non-faculty/admin from /faculty
    if (next.originalPath === '/faculty') {
      var u2 = JSON.parse(session || 'null');
      if (!u2 || (u2.role !== 'faculty' && u2.role !== 'admin')) { $location.path('/home'); }
    }
    // Block non-students from student content pages
    var studentOnlyRoutes = ['/overview', '/practicals', '/cc-overview', '/cc-practicals', '/dm-overview', '/dm-practicals', '/references', '/home', '/semester/:semId', '/lab-manual/:subjectId'];
    var isStudentRoute = studentOnlyRoutes.some(function(r) { return next.originalPath === r; });
    if (isStudentRoute && session) {
      var u3 = JSON.parse(session);
      if (u3 && u3.role === 'admin') { $location.path('/admin'); }
      else if (u3 && u3.role === 'faculty') { $location.path('/faculty'); }
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

  // ── Dark Mode ─────────────────────────────────────────
  $rootScope.darkMode = localStorage.getItem('ulp_darkmode') === '1';
  if ($rootScope.darkMode) document.body.classList.add('dark');
  $rootScope.toggleDark = function() {
    $rootScope.darkMode = !$rootScope.darkMode;
    localStorage.setItem('ulp_darkmode', $rootScope.darkMode ? '1' : '0');
    document.body.classList.toggle('dark', $rootScope.darkMode);
  };

  // ── Session Timeout (30 min inactivity) ──────────────
  var TIMEOUT_MS = 30 * 60 * 1000;
  var lastActivity = Date.now();
  var timeoutTimer;

  function resetTimer() {
    lastActivity = Date.now();
    clearTimeout(timeoutTimer);
    timeoutTimer = setTimeout(function() {
      var session = localStorage.getItem(SESSION_KEY);
      if (session) {
        localStorage.removeItem(SESSION_KEY);
        $rootScope.$apply(function() { $location.path('/login'); });
        alert('Session expired due to inactivity. Please log in again.');
      }
    }, TIMEOUT_MS);
  }

  document.addEventListener('click', resetTimer);
  document.addEventListener('keypress', resetTimer);
  document.addEventListener('mousemove', resetTimer);
  resetTimer();
}]);
