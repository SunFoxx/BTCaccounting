$(document).ready(function () {
    getFullSalesData(function (data) {
        console.log("huy");
        console.log(data);
        var operation_data = '';
        $.each(data.data, function (key, value) {
            operation_data += '<tr>';
            operation_data += '<td>' + value.paym + '</td>';
            operation_data += '<td>' + value.btc + '</td>';
            operation_data += '<td>' + value.course + '</td>';
            operation_data += '<td>' + value.rub + '</td>';
            operation_data += '<td>' + value.commiss + '</td>';
            operation_data += '<td>' + value.date + '</td>';
            operation_data += '</tr>';
        });
        $("#report_table").append(operation_data);
    });
});