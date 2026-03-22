angular.module('learningPortalApp')
.controller('HomeCtrl', ['$scope', function($scope) {
  $scope.semesters = [
    { id: 3, label: 'Semester III', desc: 'Data Structures, OOP, Digital Electronics...' },
    { id: 4, label: 'Semester IV', desc: 'DBMS, Computer Networks, OS...' },
    { id: 5, label: 'Semester V', desc: 'Software Engineering, Web Tech, TOC...' },
    { id: 6, label: 'Semester VI', desc: 'Cloud Computing, AngularJS, AI...' },
    { id: 7, label: 'Semester VII', desc: 'Machine Learning, Big Data, IoT...' },
    { id: 8, label: 'Semester VIII', desc: 'Project, Electives, Internship...' }
  ];
}])

.controller('SemesterCtrl', ['$scope', '$routeParams', function($scope, $routeParams) {
  var semId = parseInt($routeParams.semId);
  $scope.semId = semId;

  var allSubjects = {
    3: [
      { name: 'Data Structures', code: '23UGCE3XX', credits: 4, icon: '🌲', comingSoon: true },
      { name: 'Object Oriented Programming', code: '23UGCE3XX', credits: 4, icon: '🧩', comingSoon: true },
      { name: 'Digital Electronics', code: '23UGCE3XX', credits: 4, icon: '⚡', comingSoon: true },
      { name: 'Discrete Mathematics', code: '23UGCE3XX', credits: 4, icon: '📐', comingSoon: true }
    ],
    4: [
      { name: 'Database Management System', code: '23UGCE4XX', credits: 4, icon: '🗄️', comingSoon: true },
      { name: 'Computer Networks', code: '23UGCE4XX', credits: 4, icon: '🌐', comingSoon: true },
      { name: 'Operating Systems', code: '23UGCE4XX', credits: 4, icon: '💻', comingSoon: true },
      { name: 'Microprocessors', code: '23UGCE4XX', credits: 4, icon: '🔧', comingSoon: true }
    ],
    5: [
      { name: 'Software Engineering', code: '23UGCE5XX', credits: 4, icon: '🛠️', comingSoon: true },
      { name: 'Web Technologies', code: '23UGCE5XX', credits: 4, icon: '🌍', comingSoon: true },
      { name: 'Theory of Computation', code: '23UGCE5XX', credits: 4, icon: '🔣', comingSoon: true },
      { name: 'Computer Graphics', code: '23UGCE5XX', credits: 4, icon: '🎨', comingSoon: true }
    ],
    6: [
      { name: 'AngularJS', code: '23UGCE6XX', credits: 4, icon: '🅰️',
        links: { syllabus: '#!/overview', lab: '#!/practicals', references: '#!/references' } },
      { name: 'Cloud Computing', code: '23UGCE610', credits: 4, icon: '☁️',
        links: { syllabus: '#!/cc-overview', lab: '#!/cc-practicals' } },
      { name: 'Artificial Intelligence', code: '23UGCE6XX', credits: 4, icon: '🤖', comingSoon: true },
      { name: 'Information Security', code: '23UGCE6XX', credits: 4, icon: '🔒', comingSoon: true }
    ],
    7: [
      { name: 'Machine Learning', code: '23UGCE7XX', credits: 4, icon: '🧠', comingSoon: true },
      { name: 'Big Data Analytics', code: '23UGCE7XX', credits: 4, icon: '📊', comingSoon: true },
      { name: 'Internet of Things', code: '23UGCE7XX', credits: 4, icon: '📡', comingSoon: true },
      { name: 'Mobile Application Development', code: '23UGCE7XX', credits: 4, icon: '📱', comingSoon: true }
    ],
    8: [
      { name: 'Project Work', code: '23UGCE8XX', credits: 8, icon: '🚀', comingSoon: true },
      { name: 'Elective I', code: '23UGCE8XX', credits: 4, icon: '📚', comingSoon: true },
      { name: 'Elective II', code: '23UGCE8XX', credits: 4, icon: '📖', comingSoon: true },
      { name: 'Internship', code: '23UGCE8XX', credits: 4, icon: '🏢', comingSoon: true }
    ]
  };

  $scope.subjects = allSubjects[semId] || [];
  $scope.semLabel = 'Semester ' + (semId === 3 ? 'III' : semId === 4 ? 'IV' : semId === 5 ? 'V' : semId === 6 ? 'VI' : semId === 7 ? 'VII' : 'VIII');
}]);
