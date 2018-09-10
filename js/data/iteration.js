class Iteration {
    getColor(idx) {
        return this.colors[idx];
    }
    init(dataset, algorithm, k){
        this.parameters = {};
        this.parameters['dataset'] = dataset;
        this.parameters['algorithm'] = algorithm;
        this.parameters['k'] = parseInt(k);
        this.parameters['current_itr'] = 0;
        this.parameters['total_itr'] = 0;
        this.charts = [];
        this.colors = ["green", "red", "blue", "yellow", "purple",
            "orange", "brown", "pink", "gray", "cyan",
            '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
            '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
            '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
            '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
            '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
            '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
            '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
            '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];
    }
    setData(dataJson) {
        this.dataJson = dataJson;
    }
    getData(index) {
        return this.dataJson[index];
    }
    setParameter(parameter, value){
        this.parameters[parameter] = value;
    }
    getParameter(parameter){
        return this.parameters[parameter];
    }
    getUrl(){
        // return `https://api-clustering.herokuapp.com/iterations/${this.dataset}/${this.algorithm}/${this.k}`;
        return `http://localhost:5000/iterations/${this.getParameter('dataset')}/${this.getParameter('algorithm')}/${this.getParameter('k')}`;
    }
    getIterationTitle(){
        return `${this.getParameter('ds_name')} / ${this.getParameter('ag_name')} / k = ${this.getParameter('k')} / iteration = ${this.getParameter('current_itr')}`;
    }
    addChart(chart) {
        this.charts.push(chart);
    }
    renderCharts() {
        for (let c = 0; c < this.charts.length; c++) {
            this.charts[c].render();
        }
    }
    removeChart(chart_idx) {
        this.charts[chart_idx].destroy();
    }
    cleanCharts() {
        for (let c = 0; c < this.charts.length; c++) {
            this.removeChart(c);
        }
        this.charts = [];
    }
}
