angular.module('myMoneyApp', ['ui.router'])

.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {

  // JWT interceptor - attach token to every request
  $httpProvider.interceptors.push(['$injector', function($injector) {
    return {
      request: function(config) {
        var AuthService = $injector.get('AuthService');
        var token = AuthService.getToken();
        if (token) config.headers['Authorization'] = 'Bearer ' + token;
        return config;
      },
      responseError: function(rejection) {
        if (rejection.status === 401) {
          var $state = $injector.get('$state');
          var AuthService = $injector.get('AuthService');
          AuthService.logout();
          $state.go('login');
        }
        return $injector.get('$q').reject(rejection);
      }
    };
  }]);

  $urlRouterProvider.otherwise('/login');

  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'app/views/login.html',
      controller: 'AuthController',
      data: { public: true }
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'app/views/signup.html',
      controller: 'AuthController',
      data: { public: true }
    })
    .state('app', {
      abstract: true,
      templateUrl: 'app/views/layout.html',
      controller: 'AppController'
    })
    .state('app.dashboard', {
      url: '/dashboard',
      templateUrl: 'app/views/dashboard.html',
      controller: 'DashboardController'
    })
    .state('app.transactions', {
      url: '/transactions',
      templateUrl: 'app/views/transactions.html',
      controller: 'TransactionsController'
    })
    .state('app.add-transaction', {
      url: '/transactions/add',
      templateUrl: 'app/views/add-transaction.html',
      controller: 'AddTransactionController'
    })
    .state('app.edit-transaction', {
      url: '/transactions/edit/:id',
      templateUrl: 'app/views/add-transaction.html',
      controller: 'AddTransactionController'
    })
    .state('app.accounts', {
      url: '/accounts',
      templateUrl: 'app/views/accounts.html',
      controller: 'AccountsController'
    })
    .state('app.add-account', {
      url: '/accounts/add',
      templateUrl: 'app/views/add-account.html',
      controller: 'AddAccountController'
    })
    .state('app.edit-account', {
      url: '/accounts/edit/:id',
      templateUrl: 'app/views/add-account.html',
      controller: 'AddAccountController'
    })
    .state('app.categories', {
      url: '/categories',
      templateUrl: 'app/views/categories.html',
      controller: 'CategoriesController'
    })
    .state('app.add-category', {
      url: '/categories/add',
      templateUrl: 'app/views/add-category.html',
      controller: 'AddCategoryController'
    })
    .state('app.edit-category', {
      url: '/categories/edit/:id',
      templateUrl: 'app/views/add-category.html',
      controller: 'AddCategoryController'
    })
    .state('app.analysis', {
      url: '/analysis',
      templateUrl: 'app/views/analysis.html',
      controller: 'AnalysisController'
    })
    .state('app.profile', {
      url: '/profile',
      templateUrl: 'app/views/profile.html',
      controller: 'ProfileController'
    });
}])

.run(['$rootScope', '$state', 'AuthService', function($rootScope, $state, AuthService) {
  $rootScope.$on('$stateChangeStart', function(event, toState) {
    var isPublic = toState.data && toState.data.public;
    var isLoggedIn = AuthService.isLoggedIn();
    if (!isPublic && !isLoggedIn) {
      event.preventDefault();
      $state.go('login');
    }
    if (isPublic && isLoggedIn) {
      event.preventDefault();
      $state.go('app.dashboard');
    }
  });
}])

.controller('AppController', ['$scope', 'AuthService', '$state', function($scope, AuthService, $state) {
  $scope.currentUser = AuthService.getUser();
  $scope.logout = function() {
    AuthService.logout();
    $state.go('login');
  };
  $scope.currentState = function() { return $state.current.name; };
}]);
