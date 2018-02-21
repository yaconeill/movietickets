$(document).ready(function () {
    $('body').css("background-image", "url(../img/bg1.jpg"); 
    isLogin();
    var selectedFilm = localStorage.getItem('selectedFilm');
    var filmCatalog = JSON.parse(localStorage.getItem('rating'));

    var $movieDetails = $('#movieDetails');
    var tmpFilm;
    filmCatalog.find(o => {
        if (o.id === selectedFilm)
            tmpFilm = o;
    });
    var dataGraphic = [['Rate', 'Películas mejor valoradas']];
    filmCatalog.forEach(function (e) {
        dataGraphic.push([e.name, e.rate]);
    });

    // #region - gráfico donut
    $('#donut').change(function () {
        google.charts.load("current", { packages: ["corechart"] });
        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {
            var data = google.visualization.arrayToDataTable(dataGraphic);

            var options = {
                title: 'Películas mejor valoradas',
                pieHole: 0.4,
            };

            var chart = new google.visualization.PieChart(document.getElementById('graphic'));
            chart.draw(data, options);
        }
    });

    // #endregion

    // #region - diagrama de chart
    $('#chart').change(function () {
        google.charts.load('current', { 'packages': ['corechart'] });
        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {
            var data = google.visualization.arrayToDataTable(dataGraphic);

            var options = {
                title: 'Películas mejor valoradas',
                curveType: 'function',
                legend: { position: 'bottom' }
            };

            var chart = new google.visualization.LineChart(document.getElementById('graphic'));

            chart.draw(data, options);
        };
    });
    // #endregion

    // #region - diagrama de tarta
    $('#pie').change(function () {
        // function drawChart() {
        google.charts.load("current", { packages: ["corechart"] });
        google.charts.setOnLoadCallback(drawChart);
        function drawChart() {
            var data = google.visualization.arrayToDataTable(dataGraphic);

            var options = {
                title: 'Películas mejor valoradas',
                is3D: true,
            };

            var chart = new google.visualization.PieChart(document.getElementById('graphic'));
            chart.draw(data, options);
        }
    });
    // #endregion
    $('#logout').click(function () {
        localStorage.removeItem('currentUser');
        location.reload();
    });
});