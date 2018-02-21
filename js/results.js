/**
 * Function to show charts
 */
$(document).ready(function () {
    $('body').css("background-image", "url(../img/bg1.jpg");
    isLogin();
    var ratingData = JSON.parse(localStorage.getItem('ratingData'));
    var comicsCatalog = JSON.parse(localStorage.getItem('comics'));
    var catalog = JSON.parse(localStorage.getItem('characters'));
    var dataGraphic;
    var type = 'characters';
    /**
     * Change the type of selection
     */
    var $typeSwitch = $('#type');
    $typeSwitch.change(function () {
        if ($typeSwitch.prop('checked'))
            type = 'characters';
        else
            type = 'comics';
        loadData();
        drawChartDonut();
        drawChart();        
        drawChartPie();    
    });
    loadData();

    // #region - Donut chart
    $('#donut').change(function () {
        drawChartDonut();
    });
    google.charts.load("current", { packages: ["corechart"] });
    google.charts.setOnLoadCallback(drawChartDonut);
    function drawChartDonut() {
        var data = google.visualization.arrayToDataTable(dataGraphic);
        var options = {
            title: 'Best Rated',
            pieHole: 0.4,
        };
        var chart = new google.visualization.PieChart(document.getElementById('graphic'));
        chart.draw(data, options);
    }
    // #endregion

    // #region - diagrama de chart
    $('#chart').change(function () {
        drawChart();
    });
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
        var data = google.visualization.arrayToDataTable(dataGraphic);
        var options = {
            title: 'Best Rated',
            curveType: 'function',
            legend: { position: 'bottom' }
        };
        var chart = new google.visualization.LineChart(document.getElementById('graphic'));
        chart.draw(data, options);
    };
    // #endregion

    // #region - diagrama de tarta
    $('#pie').change(function () {
        drawChartPie();
    });
    google.charts.load("current", { packages: ["corechart"] });
    google.charts.setOnLoadCallback(drawChartPie);
    function drawChartPie() {
        var data = google.visualization.arrayToDataTable(dataGraphic);
        var options = {
            title: 'Best Rated',
            is3D: true,
        };
        var chart = new google.visualization.PieChart(document.getElementById('graphic'));
        chart.draw(data, options);
    }
    // #endregion

    $('#logout').click(function () {
        localStorage.removeItem('currentUser');
        location.reload();
    });
    
    /** 
     * Reads the info from the voting result
    */
    function loadData() {
        dataGraphic = [['Rate', 'Best Rated']];
        ratingData.forEach(function (e) {
            if (e.type === type)
                dataGraphic.push([e.name, e.rate]);
        });
    }
});