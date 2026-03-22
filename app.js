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

  // ── Route guard ───────────────────────────────────────
  $rootScope.$on('$routeChangeStart', function(event, next) {
    var isLogin = next.originalPath === '/login';
    var session = localStorage.getItem(SESSION_KEY);
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
