
$(function() {
  $('#update-portfolio').on('click', function() {
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
    //calls the API function based on dates and ticker
    fetchMarketData(symbol, duration);
    //append user inputs to table
    var cost = $('#port-value').val() * ($('#allocation').val() * 0.01);
    var mv = 1;
    var gain = 10 + '%';
    addRows(symbol, cost, mv, gain);
  });

});
//function to call API based on user inputs
function fetchMarketData(symbol, duration) {
  PlotChart(symbol, duration);
}

function addRows (symbol, cost, mv, gain) {
  $('#cost-basis-total').append($('#port-value').val());
  $('#scroll-table').append('<tr><td class="security">' + symbol + '</td><td class="security-cost-basis">' + cost + '</td><td class="security-mv">' + mv + '</td><td class="gain">' + gain + '</td></tr>');
}
