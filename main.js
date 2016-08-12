$(function() {
    $('#add-security').on('click', function() {
        //updates the dates specified by user
        var startDateStr = $('#date-start').val();
        var finishDateStr = $('#date-finish').val();
        var dateInMilliseconds = Date.parse(startDateStr);
        var currentDay = Date.parse(finishDateStr);
        var msDuration = currentDay - dateInMilliseconds;
        var diff = new moment.duration(msDuration);
        var duration = Math.floor(diff.asDays());
        //updates the ticket specified by user
        var symbol = $('#security').val();
        //updates the cells for the portfolio table
        var cost = $('#port-value').val() * ($('#allocation').val() * 0.01);
        var weight = $('#allocation').val();
        //calls the API function based on dates and ticker and gets the current price of the specified stock and calls the addrow function
        fetchMarketData(symbol, duration).then(function(priceArr) {
          var mv = priceArr.slice(-1);
          var origPrice = priceArr[0];
          var gain = Math.round((((mv - origPrice) / origPrice) * 100)) + '%';
          addRows(symbol, weight, cost, mv, gain);
        });
    });
});

//function to call API based on user inputs
function fetchMarketData(symbol, duration) {
    return PlotChart(symbol, duration);
}

//function to add rows to portfolio

function addRows(symbol, weight, cost, mv, gain) {
    $('#cost-basis-total').html($('#port-value').val());
    $('#scroll-table').append('<tr class="new-row"><td class="security col-md-2 col-sm-1">' + symbol + '</td><td class="weight col-md-2 col-sm-1">' + weight + '%' + '</td><td class="security-cost-basis col-md-2 col-sm-1">' + cost + '</td><td class="security-mv col-md-2 col-sm-1">' + mv + '</td><td class="gain col-md-2 col-sm-1">' + gain + '<button class="remove-btn">Remove</button></td></tr>');
}

// function to remove rows in case user makes a mistake
$('.vScrollTable').on('click', '.remove-btn', function() {
    var $row = $(this).closest('tr');
    $row.remove();
});
//function to reset the portfolio
$('#reset-portfolio').on('click', function() {
  location.reload();
})
//function to calculate total portfolio performance
$('#update-portfolio').on('click', function() {
    calculateSum();
    getWeightedReturns();
});

function calculateSum (sum) {
  var sum = 0;
  $('.weight').each(function () {
    var value = $(this).text();
    sum += parseFloat(value);
  });
  if(sum !== 100) {
    alert("Please make sure allocations add to 100%")
  } else {
    $('#weight-total').text(sum + '%');
  };
  }

  function getWeightedReturns () {
    var weightArr = 0;
    $('.new-row').each(function (i, row) {
      var indWeight = $(row).children('.weight').text();
      var indGain = $(row).children('.gain').text();
      var weightGain = (parseFloat(indWeight) * parseFloat(indGain)) / 100;
      weightArr += weightGain;
    })
    var finalPortVal = Math.floor($('#port-value').val() * (1 + (weightArr / 100)));
    $('#market-value-total').text('$' + finalPortVal);
    $('#return-total').text(weightArr + '%');
    if (weightArr > 0) {
      $('.top-row').css("background-color", "#00FF00");
    } else {
      $('.top-row').css("background-color", "#e52b09");
    }
  }
