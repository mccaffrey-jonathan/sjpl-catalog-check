
var phonecatApp = angular.module('sjplCatalogChecker', []);

phonecatApp.controller('sjplCatalogCtrl', function ($scope) {
      $scope.request = {'bookTitle': 'Existence'};
      $scope.results = {'items': [
          {'title' : 'Germanic Theology',
           'url': 'wherever',
           'author': 'Eckhart',
           'desc': 'a perennial book',
           'year': '1957'},
          {'title' : 'Tao te ching',
           'url': 'wherever',
           'author': 'Lao Tzu',
           'desc': 'a perennial book',
           'year': '1000bc'}
          ]};
});
