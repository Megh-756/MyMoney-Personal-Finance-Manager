angular.module('myMoneyApp')
.controller('DashboardController', ['$scope', 'AccountService', 'TransactionService', 'AuthService', function($scope, AccountService, TransactionService, AuthService) {
  $scope.accounts = [];
  $scope.transactions = [];
  $scope.totalBalance = 0;
  $scope.currency = AuthService.getCurrency();
  $scope.user = AuthService.getUser();
  $scope.loading = true;

  function load() {
    AccountService.getAll().then(function(res) {
      $scope.accounts = res.data;
      $scope.totalBalance = res.data.reduce(function(sum, a) { return sum + a.balance; }, 0);
    });
    TransactionService.getAll(5).then(function(res) {
      $scope.transactions = res.data;
      $scope.loading = false;
    });
  }
  load();

  $scope.getTransactionDescription = function(t) {
    if (t.type === 'expense') return (t.category ? t.category.name : 'Expense') + ' from ' + (t.account ? t.account.name : '');
    if (t.type === 'income') return (t.category ? t.category.name : 'Income') + ' into ' + (t.account ? t.account.name : '');
    return 'Transfer from ' + (t.account ? t.account.name : '') + ' to ' + (t.transfer_to_account ? t.transfer_to_account.name : '');
  };

  $scope.getTransactionIcon = function(t) {
    if (t.type === 'transfer') return 'swap_horiz';
    return t.category ? t.category.icon_name : (t.type === 'income' ? 'attach_money' : 'money_off');
  };

  $scope.deleteAccount = function(id) {
    if (!confirm('Delete this account? Only accounts with zero balance and no transactions can be deleted.')) return;
    AccountService.delete(id).then(function() { load(); }).catch(function(err) { alert(err.data.message); });
  };
}]);
