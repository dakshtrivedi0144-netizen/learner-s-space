angular.module('learningPortalApp')
  .directive('statusCard', function() {
    return {
      restrict: 'E',
      scope: {
        practical: '=',
        onToggle: '&'
      },
      template:
        '<div class="status-card" ng-class="{completed: practical.completed}">' +
          '<div class="card-header">' +
            '<span class="practical-id">{{ practical.id }}.</span>' +
            '<span class="practical-title">{{ practical.title }}</span>' +
            '<span class="status-badge" ng-class="practical.completed ? \'badge-done\' : \'badge-pending\'">' +
              '{{ practical.completed ? "Done" : "Pending" }}' +
            '</span>' +
          '</div>' +
          '<div class="card-body">' +
            '<button class="toggle-btn" ng-click="onToggle()">' +
              '{{ practical.completed ? "Mark Pending" : "Mark Done" }}' +
            '</button>' +
            '<input class="notes-input" type="text" placeholder="Add notes..." ng-model="practical.notes" />' +
          '</div>' +
        '</div>'
    };
  });
