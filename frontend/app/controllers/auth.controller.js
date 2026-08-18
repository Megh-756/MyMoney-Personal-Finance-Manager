angular.module('myMoneyApp')
.controller('AuthController', ['$scope', '$state', 'AuthService', function($scope, $state, AuthService) {
  $scope.formData = {};
  $scope.error = '';
  $scope.loading = false;
  $scope.isLogin = $state.current.name === 'login';

  $scope.login = function() {
    $scope.error = '';
    $scope.loading = true;
    AuthService.login($scope.formData).then(function(res) {
      AuthService.saveSession(res.data.token, res.data.user);
      $state.go('app.dashboard');
    }).catch(function(err) {
      $scope.error = err.data.message || 'Login failed';
    }).finally(function() { $scope.loading = false; });
  };

  $scope.signup = function() {
    $scope.error = '';
    if ($scope.formData.password !== $scope.formData.confirm_password) {
      $scope.error = 'Passwords do not match'; return;
    }
    $scope.loading = true;
    AuthService.signup($scope.formData).then(function(res) {
      AuthService.saveSession(res.data.token, res.data.user);
      $state.go('app.dashboard');
    }).catch(function(err) {
      $scope.error = err.data.message || 'Signup failed';
    }).finally(function() { $scope.loading = false; });
  };
}]);
