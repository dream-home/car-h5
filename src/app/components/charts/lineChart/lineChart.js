import angular from 'angular';
import uiRouter from 'angular-ui-router';
import lineChartDirective from './lineChart.directive';

let lineChartModule = angular.module('lineChart', [
  uiRouter
])

.directive('lineChart', () => new lineChartDirective);

export default lineChartModule;
