import template from './home.html';
import controller from './home.controller';
require("!style!css!sass!./home.scss");

let homeComponent = {
  restrict: 'E',
  bindings: {},
  template,
  controller,
  controllerAs: 'vm'
};

export default homeComponent;
