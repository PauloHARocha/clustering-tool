let metricController = {
    init: (metric) => {
        this.dataMetric = metric;
        formMetricView.init();
        resultsView.init();
    },

    initData: (k_min, k_max, n_sim, ds, ag) => {
        
        if (k_min <= 1 || k_min > 10 || k_max <= k_min || k_max > 15 ) {
            return false;
        } else if (n_sim < 5 || n_sim > 30) {
            return false;
        } else {
            this.dataMetric.init(ds.value, ag.value, k_min, k_max, n_sim);

            this.dataMetric.setParameter('ds_name', ds.text);
            this.dataMetric.setParameter('ag_name', ag.text);

            return true;
        }
    },
    getDataResults: () => {
        let url = this.dataMetric.getUrl();

        formMetricView.startLoader();

        fetch(url).then(response => {
            return response.json();
        }).then(dataJson => {

            this.dataMetric.setData(dataJson)
         
            metricController.renderMetricChart();

            formMetricView.stopLoader();

        }).catch(function (e) {
            console.log(Error(e));
        })

    },
    renderMetricChart: () => {
        this.metrics = this.dataMetric.getData(this.dataMetric.getParameter('algorithm'));
        this.dataMetric.cleanCharts();
        
        this.results = {};
        for (let k in this.metrics) {
            for (let met in this.metrics[k]) {
                if (this.results[met] === undefined) {
                    this.results[met] = {
                        'mean': [],
                        'std': []
                    }
                }

                this.results[met].mean.push({ y: this.metrics[k][met].mean, label: k });
                this.results[met].std.push({
                    y: [this.metrics[k][met].mean - this.metrics[k][met].std, this.metrics[k][met].mean + this.metrics[k][met].std],
                    label: k
                });
            }
        }

        for (let met in this.results) {
            this.div_id = `chartContainer${met}`
            resultsView.renderChartContainer(this.div_id);
        
            this.dataMetric.addChart(new CanvasJS.Chart(div_id, {
                    animationEnabled: false,
                    title: {
                        text: met
                    },
                    axisX: {
                        title: "k",
                        interval: 1
                    },
                    axisY: {
                        title: "Mean",
                        // suffix: " in",
                        includeZero: true
                    },
                    toolTip: {
                        shared: true
                    },
                    data: [{
                        type: "line",
                        name: "Value",
                        toolTipContent: "<b>{label}</b><br><span style=\"color:#4F81BC\">{name}</span>: {y}",
                        markerType: "none",
                        dataPoints: this.results[met].mean
                    },
                    {
                        type: "error",
                        name: "std",
                        toolTipContent: "<span style=\"color:#C0504E\">{name}</span>: {y[0]} - {y[1]}",
                        dataPoints: this.results[met].std
                    }]
                }));
            }

        this.dataMetric.renderCharts();   
        }

}