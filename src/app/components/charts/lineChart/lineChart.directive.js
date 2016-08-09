import template from './lineChart.html';
import echarts from 'echarts';
class lineChartDirective {
    constructor () {
        this.restrict = 'E'
        this.template = template
        this.scope = {
            chartOpt: '='
        }
        this.controller = function() {
            console.log('linechart directive controller...')
        }
        //console.log(this.vm.chartOpts);
        //this.scope = {}
    }

    

    link(scope, element, attrs) {
        console.log(arguments)
        console.log(element[0].style);
        const ele = element[0]
        const lc = ele.querySelector('#line-chart');
        
        var myChart = echarts.init(lc);
        myChart.setOption(scope.chartOpt);
        // setTimeout(function() {
            
        // }, 100);
        // window.onresize = function() {
        //     myChart.setOption(scope.chartOpt);
        // }
        
    }
}

export default lineChartDirective