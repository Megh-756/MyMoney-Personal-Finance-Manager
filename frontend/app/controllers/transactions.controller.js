angular.module('myMoneyApp')

.controller('TransactionsController', ['$scope', '$state', 'TransactionService', 'AuthService', function($scope, $state, TransactionService, AuthService) {
  $scope.transactions = [];
  $scope.currency = AuthService.getCurrency();
  $scope.loading = true;
  $scope.filter = 'all';

  function load() {
    TransactionService.getAll(100).then(function(res) {
      $scope.allTransactions = res.data;
      applyFilter();
      $scope.loading = false;
    });
  }
  load();

  function applyFilter() {
    if ($scope.filter === 'all') $scope.transactions = $scope.allTransactions;
    else $scope.transactions = $scope.allTransactions.filter(function(t) { return t.type === $scope.filter; });
  }

  $scope.setFilter = function(f) { $scope.filter = f; applyFilter(); };

  $scope.getDescription = function(t) {
    if (t.type === 'expense') return (t.category ? t.category.name : 'Expense') + ' from ' + (t.account ? t.account.name : '');
    if (t.type === 'income') return (t.category ? t.category.name : 'Income') + ' into ' + (t.account ? t.account.name : '');
    return 'Transfer: ' + (t.account ? t.account.name : '') + ' → ' + (t.transfer_to_account ? t.transfer_to_account.name : '');
  };

  $scope.getIcon = function(t) {
    if (t.type === 'transfer') return 'swap_horiz';
    return t.category ? t.category.icon_name : (t.type === 'income' ? 'attach_money' : 'money_off');
  };

  $scope.delete = function(id) {
    if (!confirm('Delete this transaction?')) return;
    TransactionService.delete(id).then(load);
  };
}])

.controller('AddTransactionController', ['$scope', '$state', '$stateParams', 'TransactionService', 'AccountService', 'CategoryService', 'AuthService',
function($scope, $state, $stateParams, TransactionService, AccountService, CategoryService, AuthService) {
  $scope.isEdit = !!$stateParams.id;
  $scope.error = '';
  $scope.loading = false;
  $scope.accounts = [];
  $scope.categories = [];
  $scope.filteredCategories = [];
  $scope.currency = AuthService.getCurrency();

  $scope.formData = {
    type: 'expense',
    account: '',
    transfer_to_account: '',
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    remarks: ''
  };

  // Load accounts and categories
  AccountService.getAll().then(function(res) { $scope.accounts = res.data; });
  CategoryService.getAll().then(function(res) {
    $scope.allCategories = res.data;
    filterCategories();
  });

  function filterCategories() {
    if (!$scope.allCategories) return;
    $scope.filteredCategories = $scope.allCategories.filter(function(c) {
      return c.type === $scope.formData.type;
    });
  }

  $scope.onTypeChange = function() {
    $scope.formData.category = '';
    $scope.formData.transfer_to_account = '';
    filterCategories();
  };

  if ($scope.isEdit) {
    TransactionService.getAll(200).then(function(res) {
      var tx = res.data.find(function(t) { return t._id === $stateParams.id; });
      if (tx) {
        $scope.formData = {
          type: tx.type,
          account: tx.account ? tx.account._id : '',
          transfer_to_account: tx.transfer_to_account ? tx.transfer_to_account._id : '',
          category: tx.category ? tx.category._id : '',
          amount: tx.amount,
          date: new Date(tx.date).toISOString().split('T')[0],
          remarks: tx.remarks
        };
        filterCategories();
      }
    });
  }

  $scope.save = function() {
    $scope.error = '';
    $scope.loading = true;
    var data = angular.copy($scope.formData);
    if (!data.category) delete data.category;
    if (!data.transfer_to_account) delete data.transfer_to_account;

    var promise = $scope.isEdit
      ? TransactionService.update($stateParams.id, data)
      : TransactionService.create(data);

    promise.then(function() {
      $state.go('app.transactions');
    }).catch(function(err) {
      $scope.error = (err.data && err.data.message) || 'Error saving transaction';
    }).finally(function() { $scope.loading = false; });
  };
}]);
