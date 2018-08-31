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
    let form_submit = document.getElementById('form-submit');
    let result = {};
    const colors = ['red', 'blue', 'green', 'yellow', 'orange', 'brown'];
    let form_ds = document.getElementById('dataset');
    let form_ag = document.getElementById('algorithm');
    let form_k = document.getElementById('k');


    form_submit.addEventListener('click', function(e){
        e.preventDefault();
        
        result = new Result(
            form_ds.options[form_ds.selectedIndex].value,
            form_ag.options[form_ag.selectedIndex].value,
            form_k.value
        );
        
        // let url = `https://api-clustering.herokuapp.com/${ds_value}/${ag_value}/${k_value}`;
        let url = `http://localhost:5000/${result.dataset}/${result.algorithm}/${result.k}`;
        
        // if (!response.ok) {
        //     throw Error(response.statusText);
        // }
        // // Read the response as json.
        // return response.json();

        fetch(url).then(function(response){
            return response.json();
        }).then(function(data){
            result.setCentroids(data.centroids);
            result.setClusters(data.clusters);

            total_itr = Object.keys(result.centroids);
            result.setTotalIteration(total_itr.length);
            
            create_itr_change();
            centroids_chart();
        }).catch(function(e){
            console.log(Error(e));
        })

    })

    

    function create_itr_change(){
            
        let select_section = document.getElementById('select-section');
        select_section.innerHTML = ''
        
        let select_label = document.createElement("label");
        select_label.setAttribute('for', 'itr');
        select_label.innerHTML = 'Iteration: ';
        select_section.appendChild(select_label);

        let select_itr = document.createElement("select");
        select_itr.id = `itr`;
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
            centroids_chart();
        })
    }

    // function generate_results(results){
    //     let html_centroids = [];
    //     let html_clusters = [];
    //     // p.innerHTML = JSON.stringify(data);
    //     // p.innerHTML = JSON.stringify(data);
    //     let centroids_keys_i = Object.keys(results.centroids);
    //     let centroids_keys_j = 0;
    //     let clusters_keys_k = 0;

    //     for (i = 0; i < centroids_keys_i.length; i++) {
    //         html_centroids.push('<tr>');
    //         html_clusters.push('<tr>');

    //         centroids_keys_j = Object.keys(results.centroids[i]);
    //         for (let j = 0; j < centroids_keys_j.length; j++){
    //             html_centroids.push(`<td>${parseFloat(results.centroids[i][j]).toFixed(4)}</td>`);
                
    //             clusters_keys_k = Object.keys(results.clusters[i][j]);
    //             html_clusters.push('<td>');
                
    //             for (let k = 0; k<clusters_keys_k.length;k++){
    //                 for (let w = 0; w < results.k; w++)
    //                     html_clusters.push(`${results.clusters[i][j][k]} -/-`);
    //             }
    //             html_clusters.push('</td>');
    //         }

    //         html_centroids.push('</tr>');
    //         html_clusters.push('</tr>');
    //     }

    //     let table_centroids = document.getElementById("tb_results_centroids");
    //     let table_clusters = document.getElementById("tb_results_clusters");

    //     table_centroids.innerHTML = html_centroids.join('');
    //     table_clusters.innerHTML = html_clusters.join('');
        
    // }

    

    function centroids_chart() {
        let centroids_data = result.centroids;
        let clusters_data = result.clusters;
        let text;
        let itr = result.current_itr;
        let charts = []
        let centroids_chart = [];
        let clusters_chart = [];

        let data_config = [];
        let graphics_section = document.getElementById("graphics");
        graphics_section.innerHTML = '';
        
        text = `${form_ds.options[form_ds.selectedIndex].text} / ${form_ag.options[form_ag.selectedIndex].text} / ${form_k.value} / iter ${itr}`; 

        for(x in [0,1,2,3]){
            for (y in [0,1,2,3]){
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
                            name: "Clusters",
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
                        showInLegend: true,
                        dataPoints: centroids_chart
                    });
                    centroids_chart = [];

                    
                    let div = document.createElement("div");
                    div.style.width = '33%';
                    div.style.height = '300px';
                    div.style.display = 'inline-block';
                    div.id = `chartContainer${x}${y}`;
                    graphics_section.appendChild(div);
                    charts.push(new CanvasJS.Chart(div.id, {
                        // animationEnabled: true,
                        zoomEnabled: true,
                        title: {
                            text: text
                        },
                        axisX: {
                            title: `Dimension ${x}`,
                            minimum: 0,
                            maximum: 10
                        },
                        axisY: {
                            title: `Dimension ${y}`,
                            minimum: 0,
                            maximum: 10
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
