let controller = {
    init: (iteration) => {
        this.data = iteration;
        // console.log('begin-controller-init');
        formView.init();
        iterationView.init();
        // console.log('end-controller-init');
    },
    initData: (ds, ag, k) => {
        // console.log('begin-controller-initData');
        if (k <= 0 || k > 50 || ds.value < 0 || ag.value < 0) {
            // console.log('end-false-controller-initData');
            return false;
        }
        else {
            this.data.init(ds.value, ag.value, k);

            this.data.setParameter('ds_name', ds.text);
            this.data.setParameter('ag_name', ag.text);
            // console.log('end-true-controller-initData');
            return true;
        }
    },
    getDataResults: () => {
        // console.log('begin-controller-getDataResults');
        let url = this.data.getUrl();

        iterationView.startLoader();

        fetch(url).then(response => {
            return response.json();
        }).then(dataJson => {

            this.data.setData(dataJson)

            let total_itr = Object.keys(this.data.getData('centroids'));
            this.data.setParameter('total_itr', total_itr.length);

            iterationView.stopLoader();
            iterationView.renderIterator(this.data.getParameter('total_itr'));

            controller.renderIterationChart(this.data.getParameter('current_itr'));

            // console.log('end-controller-getDataResults');
        }).catch(e => {
            console.log(Error(e));
        })
    },
    renderIterationChart: (itr_id) => {
        // console.log('begin-controller-renderIterationChart');
        this.data.setParameter('current_itr', itr_id);

        iterationView.renderGraphic();
        this.data.cleanCharts();

        this.centroids_chart = [];
        this.clusters_chart = [];
        this.data_config = [];
        this.centroids = this.data.getData('centroids');
        this.dimensions = this.data.getData('dimensions');
        this.itr = this.data.getParameter('current_itr');


        for (let x = 0; x < this.dimensions.length; x++) {
            for (let y = 0; y < this.dimensions.length; y++) {
                if (x < y) {
                    for (let i = 0; i < this.data.getParameter('k'); i++) {
                        controller.addClusterChart(x, y, i);
                        centroids_chart.push({ x: this.centroids[itr][i][x], y: this.centroids[itr][i][y] });
                    }
                    controller.addCentroidChart()

                    this.div_id = `chartContainer${x}${y}`
                    iterationView.renderChartContainer(this.div_id);

                    this.data.addChart(new CanvasJS.Chart(this.div_id, {
                        // animationEnabled: true,
                        zoomEnabled: true,
                        title: {
                            // text: text
                        },
                        axisX: {
                            title: `${this.dimensions[x]}`,
                            minimum: 0,
                            maximum: 1
                        },
                        axisY: {
                            title: `${this.dimensions[y]}`,
                            minimum: 0,
                            maximum: 1
                        },
                        data: this.data_config
                    }))

                    this.data_config = [];
                }
            }
        }

        this.data.renderCharts();
        // console.log('end-controller-renderIterationChart');
    },
    addClusterChart: (x, y, i) => {

        this.clusters = this.data.getData('clusters');
        let cluster_size = Object.keys(this.clusters[itr][i]);
        cluster_size = cluster_size.length

        for (let j = 0; j < cluster_size; j++) {
            this.clusters_chart.push({ x: this.clusters[itr][i][j][x], y: this.clusters[itr][i][j][y] });
        }

        this.data_config.push({
            type: "scatter",
            toolTipContent: "<b>x: </b>{x} <br/><b>y: </b>{y}",
            color: this.data.getColor(i),
            markerType: "circle",
            markerSize: 4,
            name: `${cluster_size}`,
            showInLegend: true,
            dataPoints: this.clusters_chart
        })


        this.clusters_chart = [];
        // console.log('end-controller-addClusterChart');
    },
    addCentroidChart: () => {
        // console.log('begin-controller-addCentroidChart');
        this.data_config.push({
            type: "scatter",
            toolTipContent: "<b>x: </b>{x} <br/><b>y: </b>{y}",
            color: "black",
            markerType: "cross",
            markerSize: 8,
            name: "Centroid",
            showInLegend: false,
            dataPoints: this.centroids_chart
        });
        this.centroids_chart = [];
        // console.log('end-controller-addCentroidChart');
    },
    getIterationTitle: () => {
        return this.data.getIterationTitle();
    }
}