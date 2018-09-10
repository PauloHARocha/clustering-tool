class Metric {
    getColor(idx) {
        return this.colors[idx];
    }
    init(dataset, algorithm, k_min = 0, k_max = 0, n_sim = 0) {
        this.parameters = {};
        this.parameters['dataset'] = dataset;
        this.parameters['algorithm'] = algorithm;
        this.parameters['k_min'] = k_min;
        this.parameters['k_max'] = k_max;
        this.parameters['n_sim'] = n_sim;
        this.charts = [];
        this.colors = ["green", "red", "blue", "yellow", "purple",
            "orange", "brown", "pink", "gray", "cyan"];
    }
    setData(dataJson) {
        this.dataJson = dataJson;
    }
    getData(index) {
        return this.dataJson[index];
    }
    setParameter(parameter, value) {
        this.parameters[parameter] = value;
    }
    getParameter(parameter) {
        return this.parameters[parameter];
    }
    getUrl() {
        // return `https://api-clustering.herokuapp.com/comparision/${result_metrics.dataset}/${result_metrics.algorithm}/${result_metrics.k_min}/${result_metrics.k_max}/${result_metrics.n_sim}`;
        return `http://localhost:5000/comparision/${this.getParameter('dataset')}/${this.getParameter('algorithm')}/${this.getParameter('k_min')}/${this.getParameter('k_max')}/${this.getParameter('n_sim')}`;
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
