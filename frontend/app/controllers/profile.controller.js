angular.module('myMoneyApp')
.controller('ProfileController', ['$scope', 'AuthService', function($scope, AuthService) {
  $scope.success = '';
  $scope.error = '';
  $scope.loading = false;
  $scope.formData = {};

  $scope.currencies = ['₹', '$', '€', '£', '¥', '₩', '฿', 'AED'];
  $scope.countries = ['India', 'USA', 'UK', 'Germany', 'France', 'Japan', 'China', 'Australia', 'Canada', 'Other'];

  AuthService.getProfile().then(function(res) {
    var u = res.data;
    $scope.formData = { name: u.name, email: u.email, country: u.country, currency: u.currency };
  });

  $scope.save = function() {
    $scope.error = ''; $scope.success = '';
    $scope.loading = true;
    var data = { name: $scope.formData.name, country: $scope.formData.country, currency: $scope.formData.currency };
    if ($scope.formData.new_password) {
      if ($scope.formData.new_password !== $scope.formData.confirm_password) {
        $scope.error = 'Passwords do not match'; $scope.loading = false; return;
      }
      data.password = $scope.formData.new_password;
    }
    AuthService.updateProfile(data).then(function(res) {
      // Update stored user
      var stored = AuthService.getUser();
      stored.name = res.data.user.name;
      stored.currency = res.data.user.currency;
      localStorage.setItem('mm_user', JSON.stringify(stored));
      $scope.success = 'Profile updated successfully!';
      $scope.formData.new_password = '';
      $scope.formData.confirm_password = '';
    }).catch(function(err) {
      $scope.error = (err.data && err.data.message) || 'Error updating profile';
    }).finally(function() { $scope.loading = false; });
  };
}]);
