angular.module('myMoneyApp')

.service('AccountService', ['$http', function($http) {
  var API = '/api/accounts';
  this.getAll = function() { return $http.get(API); };
  this.create = function(data) { return $http.post(API, data); };
  this.update = function(id, data) { return $http.put(API + '/' + id, data); };
  this.delete = function(id) { return $http.delete(API + '/' + id); };
}])

.service('CategoryService', ['$http', function($http) {
  var API = '/api/categories';
  this.getAll = function() { return $http.get(API); };
  this.create = function(data) { return $http.post(API, data); };
  this.update = function(id, data) { return $http.put(API + '/' + id, data); };
  this.delete = function(id) { return $http.delete(API + '/' + id); };
}])

.service('TransactionService', ['$http', function($http) {
  var API = '/api/transactions';
  this.getAll = function(limit) { return $http.get(API + '?limit=' + (limit || 50)); };
  this.create = function(data) { return $http.post(API, data); };
  this.update = function(id, data) { return $http.put(API + '/' + id, data); };
  this.delete = function(id) { return $http.delete(API + '/' + id); };
}])

.service('AnalysisService', ['$http', function($http) {
  this.getMonthly = function(month) { return $http.get('/api/analysis/monthly?month=' + month); };
}]);
