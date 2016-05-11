'use strict';

angular.module('gpConnect')
  .controller('ProblemListCtrl', function ($scope, $state, $stateParams, $location, $sce, $modal, usSpinnerService, PatientService, Problem) {

    $scope.currentPage = 1;

    $scope.pageChangeHandler = function (newPage) {
      $scope.currentPage = newPage;
    };

    if ($stateParams.page) {
      $scope.currentPage = $stateParams.page;
    }

    $scope.search = function (row) {
      return (
        angular.lowercase(row.problem).indexOf(angular.lowercase($scope.query) || '') !== -1 ||
        angular.lowercase(row.dateOfOnset).indexOf(angular.lowercase($scope.query) || '') !== -1 ||
        angular.lowercase(row.source).indexOf(angular.lowercase($scope.query) || '') !== -1
      );
    };

    if ($stateParams.filter) {
      $scope.query = $stateParams.filter;
    }

    PatientService.findDetails($stateParams.patientId).then(function (patient) {
      $scope.patient = patient.data;
    });

    Problem.findAllHTMLTables($stateParams.patientId).then(function (result) {
      if (result.data.length == 0) {
        var text = '[{"sourceId":"1","source":"Legacy","provider":"No Data","html":"No problems data available for this patient."}]';
        $scope.problemTables = JSON.parse(text);
      } else {
        $scope.problemTables = result.data;
      }

      for (var i = 0; i < $scope.problemTables.length; i++) {
        $scope.problemTables[i].html = $sce.trustAsHtml($scope.problemTables[i].html);
      }
      usSpinnerService.stop('problemSummary-spinner');
    });

    $scope.go = function (id, problemSource) {
      $state.go('problem-detail', {
        patientId: $scope.patient.id,
        problemIndex: id,
        filter: $scope.query,
        page: $scope.currentPage,
        reportType: $stateParams.reportType,
        searchString: $stateParams.searchString,
        queryType: $stateParams.queryType,
        source: problemSource
      });
    };

    $scope.selected = function (problemIndex) {
      return problemIndex === $stateParams.problemIndex;
    };

    $scope.create = function () {
      var modalInstance = $modal.open({
        templateUrl: 'views/problem/problem-modal.html',
        size: 'lg',
        controller: 'ProblemModalCtrl',
        resolve: {
          modal: function () {
            return {
              title: 'Create Problem'
            };
          },
          problem: function () {
            return {};
          },
          patient: function () {
            return $scope.patient;
          }
        }
      });

      modalInstance.result.then(function (problem) {
        problem.dateOfOnset = new Date(problem.dateOfOnset);

        var toAdd = {
          code: problem.code,
          dateOfOnset: problem.dateOfOnset,
          description: problem.description,
          problem: problem.problem,
          terminology: problem.terminology
        };

        Problem.create($scope.patient.id, toAdd).then(function () {
          setTimeout(function () {
            $state.go('problem-list', {
              patientId: $scope.patient.id,
              filter: $scope.query,
              page: $scope.currentPage
               }, {
              reload: true
            });
          }, 2000);

        });
      });
    };

  });
