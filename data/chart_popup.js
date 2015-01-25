/*globals self, Chartist*/

(function () {
    
    self.port.on("chart_popup-draw", function(chart_data) {
        console.log("chart_popup: Draw chart...");
        new Chartist.Line('.ct-chart', {
            labels: chart_data.date_list,
            series: [
                chart_data.price_list
            ]
            }, {
            axisX: {
                showLabel: false,
                showGrid: false
            },
            low: Math.min.apply(null, chart_data.price_list) * 0.8,
            high: Math.max.apply(null, chart_data.price_list) * 1.1,
            showArea: true,
            lineSmooth: false,
            width: "500px",
            height: "300px"
        });
    });
})();