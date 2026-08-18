angular.module('myMoneyApp')

.controller('CategoriesController', ['$scope', 'CategoryService', function($scope, CategoryService) {
  $scope.categories = [];
  $scope.incomeCategories = [];
  $scope.expenseCategories = [];

  function load() {
    CategoryService.getAll().then(function(res) {
      $scope.categories = res.data;
      $scope.incomeCategories = res.data.filter(function(c) { return c.type === 'income'; });
      $scope.expenseCategories = res.data.filter(function(c) { return c.type === 'expense'; });
    });
  }
  load();

  $scope.delete = function(id) {
    if (!confirm('Delete this category?')) return;
    CategoryService.delete(id).then(load).catch(function(err) { alert(err.data.message || 'Error deleting'); });
  };
}])

.controller('AddCategoryController', ['$scope', '$state', '$stateParams', 'CategoryService', function($scope, $state, $stateParams, CategoryService) {
  $scope.isEdit = !!$stateParams.id;
  $scope.error = '';
  $scope.formData = { name: '', type: 'expense', icon_name: 'label' };

  $scope.icons = [
    { name: 'restaurant', label: 'Food' }, { name: 'local_hospital', label: 'Medical' },
    { name: 'directions_car', label: 'Transport' }, { name: 'shopping_cart', label: 'Shopping' },
    { name: 'home', label: 'Home' }, { name: 'school', label: 'Education' },
    { name: 'sports_esports', label: 'Entertainment' }, { name: 'flight', label: 'Travel' },
    { name: 'attach_money', label: 'Salary' }, { name: 'business_center', label: 'Business' },
    { name: 'card_giftcard', label: 'Gift' }, { name: 'fitness_center', label: 'Fitness' },
    { name: 'phone', label: 'Utilities' }, { name: 'label', label: 'General' },
    { name: 'local_grocery_store', label: 'Groceries' }, { name: 'coffee', label: 'Coffee' },
    { name: 'movie', label: 'Movies' }, { name: 'book', label: 'Books' }
  ];

  if ($scope.isEdit) {
    CategoryService.getAll().then(function(res) {
      var cat = res.data.find(function(c) { return c._id === $stateParams.id; });
      if (cat) $scope.formData = { name: cat.name, type: cat.type, icon_name: cat.icon_name };
    });
  }

  $scope.save = function() {
    $scope.error = '';
    var promise = $scope.isEdit
      ? CategoryService.update($stateParams.id, $scope.formData)
      : CategoryService.create($scope.formData);

    promise.then(function() {
      $state.go('app.categories');
    }).catch(function(err) {
      $scope.error = err.data.message || 'Error saving';
    });
  };
}]);
