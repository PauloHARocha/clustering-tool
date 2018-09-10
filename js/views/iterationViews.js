let formView = {
    init: () => {
        // console.log('begin-formView-init');
        formView.initPageChange();
        formView.initIteration();
        // console.log('end-formView-init');
    },
    initPageChange: () => { //Change page function
        // console.log('begin-formView-initPageChange');
        this.btn_iteration = document.getElementById('open-iteration');
        this.btn_metrics = document.getElementById('open-metrics');
        this.iteration_section = document.getElementById('iteration-section');
        this.metrics_section = document.getElementById('metrics-section');

        this.btn_iteration.addEventListener('click', () => {
            this.iteration_section.setAttribute('class', '');
            this.metrics_section.setAttribute('class', 'hide-section');
        });
        this.btn_metrics.addEventListener('click', () => {
            this.metrics_section.setAttribute('class', '');
            this.iteration_section.setAttribute('class', 'hide-section');
        });
        // console.log('end-formView-initPageChange');
    },
    initIteration: () => {
        // console.log('begin-formView-initIteration');
        this.iteration_submit = document.getElementById('form-submit');
        this.form_ds = document.getElementById('dataset');
        this.form_ag = document.getElementById('algorithm');
        this.form_k = document.getElementById('k');
        this.iteration_submit.addEventListener('click', e => {
            e.preventDefault();
            if (controller.initData(this.form_ds.options[form_ds.selectedIndex],
                this.form_ag.options[form_ag.selectedIndex],
                this.form_k.value)) {
                controller.getDataResults();
            }
        })
        // console.log('end-formView-initIteration');      
    },
}

let iterationView = {
    init: () => {
        // console.log('begin-iterationView-init');
        this.select_section = document.getElementById('select-section');
        this.title = document.getElementById('result_title');
        this.graphics_section = document.getElementById("graphics");
        // console.log('end-iterationView-init');
    },
    renderIterator: (total_itr) => {
        // console.log('begin-iterationView-renderIterator');
        this.select_section.innerHTML = '';

        this.select_label = document.createElement("label");
        this.select_label.setAttribute('for', 'itr');
        this.select_label.id = 'l_iter';
        this.select_label.innerHTML = `Iteration`;

        this.select_section.appendChild(select_label);

        this.select_itr = document.createElement("select");
        this.select_itr.id = `itr`;
        this.select_itr.setAttribute('class', 'slc iteration');

        this.select_section.appendChild(select_itr);

        let option_itr;
        for (let i = 0; i < total_itr; i++) {
            option_itr = document.createElement("option");
            option_itr.value = i;
            option_itr.text = i;
            this.select_itr.appendChild(option_itr);
        }

        this.select_itr.addEventListener('change', () => {
            controller.renderIterationChart(select_itr.options[select_itr.selectedIndex].value);
        })
        // console.log('end-iterationView-renderIterator');
    },
    renderChartContainer: div_id => {
        // console.log('begin-iterationView-renderChartContainer');
        let div = document.createElement("div");
        div.setAttribute("class", "graphic_chart");
        div.id = div_id;
        this.graphics_section.appendChild(div);
        // console.log('end-iterationView-renderChartContainer');
    },
    renderGraphic: () => {
        // console.log('begin-iterationView-renderGraphic');
        
        this.title.innerHTML = controller.getIterationTitle();
        // console.log('end-iterationView-renderGraphic');
    },
    startLoader: () => {
        // console.log('begin-iterationView-startLoader');
        this.loader = document.getElementById('sp_loader');
        this.graphics_section.innerHTML = '';
        this.select_section.innerHTML = '';
        this.title.innerHTML = ''
        this.loader.setAttribute("class", "loader form-element");
        // console.log('end-iterationView-startLoader');
    },
    stopLoader: () => {
        // console.log('begin-iterationView-stopLoader');
        this.loader.setAttribute("class", "loader form-element l_collapse");
        // console.log('end-iterationView-stopLoader');
    }
}