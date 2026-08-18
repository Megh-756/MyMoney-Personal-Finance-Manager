angular.module('myMoneyApp')
.controller('AnalysisController', ['$scope', '$timeout', 'AnalysisService', 'AuthService', function($scope, $timeout, AnalysisService, AuthService) {
  $scope.currency = AuthService.getCurrency();
  $scope.currentMonth = new Date().toISOString().slice(0, 7);
  $scope.displayMonth = '';
  $scope.data = null;
  $scope.loading = false;
  var expenseChart = null, incomeChart = null;

  function formatMonth(ym) {
    var parts = ym.split('-');
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return months[parseInt(parts[1]) - 1] + ' ' + parts[0];
  }

  function load() {
    $scope.displayMonth = formatMonth($scope.currentMonth);
    $scope.data = null;
    $scope.loading = true;
    AnalysisService.getMonthly($scope.currentMonth).then(function(res) {
      $scope.data = res.data;
      $scope.loading = false;
      // Use $timeout to wait for ng-if to render canvas elements into DOM
      $timeout(function() { renderCharts(); }, 50);
    }).catch(function() {
      $scope.loading = false;
    });
  }
  load();

  $scope.prevMonth = function() {
    var d = new Date($scope.currentMonth + '-01');
    d.setMonth(d.getMonth() - 1);
    $scope.currentMonth = d.toISOString().slice(0, 7);
    load();
  };

  $scope.nextMonth = function() {
    var d = new Date($scope.currentMonth + '-01');
    d.setMonth(d.getMonth() + 1);
    $scope.currentMonth = d.toISOString().slice(0, 7);
    load();
  };

  function renderCharts() {
    if (!$scope.data) return;

    var palette = ['#3DDC84','#2ECC71','#27ae60','#1abc9c','#16a085','#f39c12','#e67e22','#e74c3c','#9b59b6','#3498db'];

    // Expense Doughnut Chart
    var expCtx = document.getElementById('expenseChart');
    if (expCtx && $scope.data.expense_breakdown && $scope.data.expense_breakdown.length) {
      if (expenseChart) { expenseChart.destroy(); expenseChart = null; }
      expenseChart = new Chart(expCtx, {
        type: 'doughnut',
        data: {
          labels: $scope.data.expense_breakdown.map(function(d) { return d.name; }),
          datasets: [{ data: $scope.data.expense_breakdown.map(function(d) { return d.total; }), backgroundColor: palette, borderWidth: 0 }]
        },
        options: { plugins: { legend: { position: 'bottom', labels: { color: '#fff', padding: 15 } } }, cutout: '65%' }
      });
    }

    // Income Doughnut Chart
    var incCtx = document.getElementById('incomeChart');
    if (incCtx && $scope.data.income_breakdown && $scope.data.income_breakdown.length) {
      if (incomeChart) { incomeChart.destroy(); incomeChart = null; }
      incomeChart = new Chart(incCtx, {
        type: 'doughnut',
        data: {
          labels: $scope.data.income_breakdown.map(function(d) { return d.name; }),
          datasets: [{ data: $scope.data.income_breakdown.map(function(d) { return d.total; }), backgroundColor: palette, borderWidth: 0 }]
        },
        options: { plugins: { legend: { position: 'bottom', labels: { color: '#fff', padding: 15 } } }, cutout: '65%' }
      });
    }
  }

  // Destroy charts when controller is destroyed (prevent canvas reuse errors on re-navigation)
  $scope.$on('$destroy', function() {
    if (expenseChart) { expenseChart.destroy(); expenseChart = null; }
    if (incomeChart)  { incomeChart.destroy();  incomeChart = null; }
  });
}]);
