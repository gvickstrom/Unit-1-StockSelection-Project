function PlotChart(symbol, duration) {
    var params = {
        parameters: JSON.stringify(getInputParams(symbol, duration))
    }

    //Make JSON request for timeseries data
    return Promise.resolve($.ajax({
        beforeSend: function() {
            $("#chart-container").text("Generating Chart...");
        },
        data: params,
        url: "https://dev.markitondemand.com/Api/v2/InteractiveChart/jsonp",
        dataType: "jsonp",
        context: this,
    })).then(function(json) {
        console.log('json', json)
        var priceArr = json.Elements[0].DataSeries.close.values;
        var data = createDataSet(json.Dates, priceArr);
        render(data, symbol);

        return priceArr;
    }).catch(function(err) {
        alert('Error')
    });
}





function createDataSet(datesArr, priceArr) {
    // var tempArr = [];
    //
    // for (var i = 0; i < datesArr.length; i++) {
    //   var arr = [ Date.parse(datesArr[i]), priceArr[i] ]
    //   tempArr.push(arr)
    // }
    //
    // return tempArr;
    return datesArr.map(function(date, i) {
        return [Date.parse(date), priceArr[i]];
    });
}


function getInputParams(symbol, duration) {
    return {
        Normalized: false,
        NumberOfDays: duration,
        DataPeriod: "Day",
        Elements: [{
                Symbol: symbol,
                Type: "price",
                Params: ["ohlc"] //ohlc, c = close only
            }, {
                Symbol: symbol,
                Type: "volume"
            }]
            //,LabelPeriod: 'Week',
            //LabelInterval: 1
    }
};

function render(data, symbol) {
    $('#chart-container').highcharts('StockChart', {
        rangeSelector: {
            selected: 1
        },

        title: {
            text: symbol + ' Stock Price'
        },

        series: [{
            name: symbol,
            data: data,
            tooltip: {
                valueDecimals: 2
            }
        }]
    });
}
