
let formMetricView = {
    init: () => {
        this.metrics_submit = document.getElementById('metrics-submit');
        this.metrics_ds = document.getElementById('metrics-dataset');
        this.metrics_ag = document.getElementById('metrics-algorithm');
        this.metrics_k_min = document.getElementById('k-min');
        this.metrics_k_max = document.getElementById('k-max');
        this.metrics_n_sim = document.getElementById('n_sim');
        
        this.metrics_submit.addEventListener('click', function (e) {
            e.preventDefault();
            let k_min = parseInt(metrics_k_min.value);
            let k_max = parseInt(metrics_k_max.value);
            let n_sim = parseInt(metrics_n_sim.value);
            let ds = metrics_ds.options[metrics_ds.selectedIndex];
            let ag = metrics_ag.options[metrics_ag.selectedIndex];
            if (metricController.initData(k_min, k_max, n_sim, ds, ag)) {
                metricController.getDataResults();
            }

        });
    },
    startLoader: () => {
        // console.log('begin-iterationView-startLoader');
        this.metric_loader = document.getElementById('metrics_sp_loader');
        this.metrics_results.innerHTML = '';
        this.metric_loader.setAttribute("class", "loader form-element");
        // console.log('end-iterationView-startLoader');
    },
    stopLoader: () => {
        // console.log('begin-iterationView-stopLoader');
        this.metric_loader.setAttribute("class", "loader form-element l_collapse");
        // console.log('end-iterationView-stopLoader');
    }
}

let resultsView = {
    init: () => {
        this.metrics_results = document.getElementById("metrics-results");
    },
    renderChartContainer: div_id => {
        let div = document.createElement("div");
        div.setAttribute("class", "graphic_chart");
        div.id = div_id;
        this.metrics_results.appendChild(div);
    },
}