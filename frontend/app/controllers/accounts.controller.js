angular.module('myMoneyApp')

.controller('AccountsController', ['$scope', 'AccountService', 'AuthService', function($scope, AccountService, AuthService) {
  $scope.accounts = [];
  $scope.currency = AuthService.getCurrency();
  $scope.totalBalance = 0;

  function load() {
    AccountService.getAll().then(function(res) {
      $scope.accounts = res.data;
      $scope.totalBalance = res.data.reduce(function(s, a) { return s + a.balance; }, 0);
    });
  }
  load();

  $scope.delete = function(id) {
    if (!confirm('Delete this account?')) return;
    AccountService.delete(id).then(load).catch(function(err) { alert(err.data.message); });
  };
}])

.controller('AddAccountController', ['$scope', '$state', '$stateParams', 'AccountService', function($scope, $state, $stateParams, AccountService) {
  $scope.isEdit = !!$stateParams.id;
  $scope.error = '';
  $scope.loading = false;
  $scope.formData = { name: '', balance: 0, icon_name: 'account_balance_wallet', account_type: 'Bank' };

  $scope.accountTypes = ['Bank', 'Cash', 'Credit Card', 'Investment', 'Other'];
  $scope.icons = [
    { name: 'account_balance_wallet', label: 'Wallet' },
    { name: 'account_balance', label: 'Bank' },
    { name: 'credit_card', label: 'Credit Card' },
    { name: 'savings', label: 'Savings' },
    { name: 'payments', label: 'Cash' },
    { name: 'trending_up', label: 'Investment' },
    { name: 'business', label: 'Business' }
  ];

  if ($scope.isEdit) {
    AccountService.getAll().then(function(res) {
      var acc = res.data.find(function(a) { return a._id === $stateParams.id; });
      if (acc) { $scope.formData = { name: acc.name, balance: acc.balance, icon_name: acc.icon_name, account_type: acc.account_type }; }
    });
  }

  $scope.save = function() {
    $scope.error = '';
    $scope.loading = true;
    var promise = $scope.isEdit
      ? AccountService.update($stateParams.id, $scope.formData)
      : AccountService.create($scope.formData);

    promise.then(function() {
      $state.go('app.accounts');
    }).catch(function(err) {
      $scope.error = err.data.message || 'Error saving account';
    }).finally(function() { $scope.loading = false; });
  };
}]);
