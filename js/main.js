class Result{
    constructor(dataset, algorithm, k){
        this.dataset = dataset;
        this.algorithm = algorithm;
        this.k = k;
        this.current_itr = 0;
    }

    setCentroids(centroids) {
        this.centroids = centroids;
    }

    setClusters(clusters){
        this.clusters = clusters;
    }
    
    setDimensions(dimensions){
        this.dimensions = dimensions
    }

    setTotalIteration(total_itr){
        this.total_itr = total_itr;
    }

    setCurrentIteration(current_itr){
        if(current_itr > this.total_itr)
            this.current_itr = 0;
        else
            this.current_itr = current_itr;
    }
}
window.onload = function () {
    let result = {};
    let charts = [];
    let chart_metrics = [];
    const colors = ["green", "red", "blue", "yellow", "purple",
    "orange", "brown", "pink", "gray", "cyan",
    '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
    '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
    '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
    '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
    '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
    '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
    '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
    '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

    //Change page function
    let btn_iteration = document.getElementById('open-iteration');
    let btn_metrics = document.getElementById('open-metrics');
    let iteration_section = document.getElementById('iteration-section');
    let metrics_section = document.getElementById('metrics-section');
    btn_iteration.addEventListener('click', function(){
        iteration_section.setAttribute('class', '');
        metrics_section.setAttribute('class', 'hide-section');
    });
    btn_metrics.addEventListener('click', function () {
        metrics_section.setAttribute('class', '');
        iteration_section.setAttribute('class', 'hide-section');
    });

    //Generate iterations function
    let iteration_submit = document.getElementById('form-submit');
    let form_ds = document.getElementById('dataset');
    let form_ag = document.getElementById('algorithm');
    let form_k = document.getElementById('k');
    let select_section = document.getElementById('select-section');
    let title = document.getElementById('result_title');
    let graphics_section = document.getElementById("graphics");
    iteration_submit.addEventListener('click', function(e){
        e.preventDefault();
        if (form_k.value <=0 || form_k.value > 50)
            return; 
        result = new Result(
            form_ds.options[form_ds.selectedIndex].value,
            form_ag.options[form_ag.selectedIndex].value,
            form_k.value
        );
        
        let url = `https://api-clustering.herokuapp.com/iterations/${result.dataset}/${result.algorithm}/${result.k}`;
        // let url = `http://localhost:5000/iterations/${result.dataset}/${result.algorithm}/${result.k}`;
        
        select_section.innerHTML = '';
        title.innerHTML = '';
        graphics_section.innerHTML = '';
        let loader = document.getElementById('sp_loader');
        loader.setAttribute("class", "loader form-element");

        fetch(url).then(function(response){
            return response.json();
        }).then(function(data){
            
            result.setCentroids(data.centroids);
            result.setClusters(data.clusters);
            result.setDimensions(data.dimensions);
            
            total_itr = Object.keys(result.centroids);
            result.setTotalIteration(total_itr.length);
           
            
            centroids_chart();
            loader.setAttribute("class", "loader form-element l_collapse");
            create_itr_change();
        }).catch(function(e){
            console.log(Error(e));
        })

    })

    let metrics_submit = document.getElementById('metrics-submit');
    let metrics_ds = document.getElementById('metrics-dataset');
    let metrics_ag = document.getElementById('metrics-algorithm');
    let metrics_k_min = document.getElementById('k-min');
    let metrics_k_max = document.getElementById('k-max');
    let metrics_n_sim = document.getElementById('n_sim');
    let metrics_results = document.getElementById("metrics-results");

    metrics_submit.addEventListener('click', function(e){
        e.preventDefault();
        let k_min = parseInt(metrics_k_min.value);
        let k_max = parseInt(metrics_k_max.value);
        let n_sim = parseInt(metrics_n_sim.value);
        if (k_min <= 0 || k_min > 10 || k_max <= k_min || k_max > 15){
            return;
        }
        if (n_sim < 5 || n_sim > 30){
            return;
        }

        result_metrics = {
            'dataset': metrics_ds.options[metrics_ds.selectedIndex].value,
            'algorithm': metrics_ag.options[metrics_ag.selectedIndex].value,
            'k_min': k_min,
            'k_max': k_max,
            'n_sim': n_sim,
        }

        let url = `https://api-clustering.herokuapp.com/comparision/${result_metrics.dataset}/${result_metrics.algorithm}/${result_metrics.k_min}/${result_metrics.k_max}/${result_metrics.n_sim}`;
        // let url = `http://localhost:5000/comparision/${result_metrics.dataset}/${result_metrics.algorithm}/${result_metrics.k_min}/${result_metrics.k_max}/${result_metrics.n_sim}`;
        
        metrics_results.innerHTML = '';
        let loader = document.getElementById('metrics_sp_loader');
        loader.setAttribute("class", "loader form-element");

        fetch(url).then(function (response) {
            return response.json();
        }).then(function (data) {

            result_metrics.data = data[result_metrics.algorithm];
            
            metrics_chart(result_metrics);
            
            loader.setAttribute("class", "loader form-element l_collapse");
            
        }).catch(function (e) {
            console.log(Error(e));
        })

    });

    function metrics_chart(results){
        let data = results.data;

        for (let c = 0; c < chart_metrics.length; c++) {
            chart_metrics[c].destroy();
        }
        chart_metrics = [];
        results['metrics'] = {};
        for(let k in data){
            for(let met in data[k]){
                if(results.metrics[met] === undefined){
                    results.metrics[met] = {
                        'mean': [],
                        'std': []
                    }
                }
                
                results.metrics[met].mean.push({ y: data[k][met].mean, label: k });  
                results.metrics[met].std.push({ 
                    y: [data[k][met].mean - data[k][met].std, data[k][met].mean + data[k][met].std], 
                    label: k });  
            }
        }

        for(let met in results.metrics){
            let div = document.createElement("div");
            div.setAttribute("class", "graphic_chart");
            div.id = `chartContainer${met}`;
            metrics_results.appendChild(div);

            chart_metrics.push(new CanvasJS.Chart(div.id, {
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
                    dataPoints: results.metrics[met].mean
                },
                {
                    type: "error",
                    name: "std",
                    toolTipContent: "<span style=\"color:#C0504E\">{name}</span>: {y[0]} - {y[1]}",
                    dataPoints: results.metrics[met].std
                }]
            }));
        }
        for (let c = 0; c < chart_metrics.length; c++) {
            chart_metrics[c].render();
        }
        
    }

    function create_itr_change(){
        let select_label = document.createElement("label");
        select_label.setAttribute('for', 'itr');
        select_label.id = 'l_iter';
        select_label.innerHTML = `Iteration`;
        select_section.appendChild(select_label);

        let select_itr = document.createElement("select");
        select_itr.id = `itr`;
        select_itr.setAttribute('class', 'slc iteration');
        select_section.appendChild(select_itr);
        
        let option_itr;
        for(let i = 0; i< result.total_itr; i++){
            option_itr = document.createElement("option");
            option_itr.value = i;
            option_itr.text = i;
            select_itr.appendChild(option_itr);
        }

        select_itr.addEventListener('change', function (e) {
            result.setCurrentIteration(select_itr.options[select_itr.selectedIndex].value);
            select_label.innerHTML = `Iteration`;
            centroids_chart();
        })
    }

    function centroids_chart() {
        let centroids_data = result.centroids;
        let clusters_data = result.clusters;
        let text;
        let itr = result.current_itr;
        let centroids_chart = [];
        let clusters_chart = [];

        for (let c = 0; c < charts.length; c++) {
            charts[c].destroy();
        }
        charts = [];

        let data_config = [];
        graphics_section.innerHTML = '';
        
        text = `${form_ds.options[form_ds.selectedIndex].text} / ${form_ag.options[form_ag.selectedIndex].text} / k = ${form_k.value} /  iteration = ${itr}`; 
        
        title.innerHTML = text;
        title.style.fontSize = '1.3em';
        for(let x=0;x < result.dimensions.length;x++){
            for (let y =0; y < result.dimensions.length;y++){
                if (x < y){
                    for (let i = 0; i < form_k.value; i++) {
                        centroids_chart.push({ x: centroids_data[itr][i][x], y: centroids_data[itr][i][y] });

                        clusters_keys_j = Object.keys(clusters_data[itr][i]);
                        for (let j = 0; j < clusters_keys_j.length; j++) {
                            clusters_chart.push({ x: clusters_data[itr][i][j][x], y: clusters_data[itr][i][j][y] });
                        }

                        data_config.push({
                            type: "scatter",
                            toolTipContent: "<b>x: </b>{x} <br/><b>y: </b>{y}",
                            color: colors[i],
                            markerType: "circle",
                            markerSize: 4,
                            name: `${clusters_keys_j.length}`,
                            showInLegend: true,
                            dataPoints: clusters_chart
                        })

                        clusters_chart = [];
                    }

                    data_config.push({
                        type: "scatter",
                        toolTipContent: "<b>x: </b>{x} <br/><b>y: </b>{y}",
                        color: "black",
                        markerType: "cross",
                        markerSize: 8,
                        name: "Centroid",
                        showInLegend: false,
                        dataPoints: centroids_chart
                    });
                    centroids_chart = [];

                    
                    let div = document.createElement("div");
                    div.setAttribute("class", "graphic_chart");
                    div.id = `chartContainer${x}${y}`;
                    graphics_section.appendChild(div);
                    charts.push(new CanvasJS.Chart(div.id, {
                        // animationEnabled: true,
                        zoomEnabled: true,
                        title: {
                            // text: text
                        },
                        axisX: {
                            title: `${result.dimensions[x]}`,
                            minimum: 0,
                            maximum: 1
                        },
                        axisY: {
                            title: `${result.dimensions[y]}`,
                            minimum: 0,
                            maximum: 1
                        },
                        data: data_config
                    }));

                    data_config = [];
                }
            }
        }

        for (let c = 0; c < charts.length; c++) {
            charts[c].render();
        }
        
    }
        

    }
