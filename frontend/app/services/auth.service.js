angular.module('myMoneyApp')
.service('AuthService', ['$http', function($http) {
  var API = '/api/auth';

  this.signup = function(data) { return $http.post(API + '/signup', data); };
  this.login = function(data) { return $http.post(API + '/login', data); };
  this.getProfile = function() { return $http.get(API + '/profile'); };
  this.updateProfile = function(data) { return $http.put(API + '/profile', data); };

  this.saveSession = function(token, user) {
    localStorage.setItem('mm_token', token);
    localStorage.setItem('mm_user', JSON.stringify(user));
  };
  this.logout = function() {
    localStorage.removeItem('mm_token');
    localStorage.removeItem('mm_user');
  };
  this.getToken = function() { return localStorage.getItem('mm_token'); };
  this.getUser = function() {
    var u = localStorage.getItem('mm_user');
    return u ? JSON.parse(u) : null;
  };
  this.isLoggedIn = function() { return !!this.getToken(); };
  this.getCurrency = function() {
    var u = this.getUser();
    return u ? (u.currency || '₹') : '₹';
  };
}]);
