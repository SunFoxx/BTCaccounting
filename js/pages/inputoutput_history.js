var agents = [], IOReserves = [], unacceptedList = [], acceptedList = [];

var q1 = getAntiagentList(function (data) {
    agents = data;
});
var q2 = getReserveList(function (data) {
    IOReserves = data;
});
var q3 = getUnacceptedTransferData(function (data) {
    unacceptedList = data;
});
var q4 = getFullTransferData(function (data) {
    acceptedList = data;
});
$.when(q1, q2, q3, q4).done(function () {
    fillTable(unacceptedList, "#unaccepted_table");
    fillTable(acceptedList, "#report_table");
    $("#loading").prop('class', 'hidden');
});


function getParticipantData(input, callback) {
    var agent = null, reserve = null;
    var found = false;
    //check if input is an agent
    $.each(agents, function (key, value) {
        if (input === value.agentname) {
            agent = input;
            found = true;
        }
    });
    if (!found) {
        $.each(IOReserves, function (key, value) {
            if (input === value.title) {
                reserve = input;
                agent = value.owner;
                found = true;
            }
        });
    }

    var result = {
        reserve: reserve,
        agent: agent
    };
    callback(result);
}

var unacceptedID = {}, acceptedID = {};

function fillTable(data, targetID) {
    if (data.data.length > 0) {
        var operation_data = '';
        var rowNumber = 0;
        $.each(data.data, function (key, value) {
            rowNumber++;
            var source = {};
            var destination = {};
            getParticipantData(value.destination, function (data) {
                operation_data += '<tr id="' + targetID.substring(1, targetID.length) + "_tr" + rowNumber + '\">';
                //====hidden buttons=====
                var xtraData = "";
                if (targetID === '#unaccepted_table') {
                    xtraData = '<div class="table_row_overlay col-md-6"><button class="accept col-md-6" onclick="acceptEntry(' + rowNumber + ")\">" +
                        '<i class="fa fa-chevron-down" aria-hidden="true">Подтвердить</i></button>';
                    xtraData += '<button class="decline col-md-6" onclick="declineEntry(' + rowNumber + ")\"" + '>' +
                        '<i class="fa fa-times" aria-hidden="true">Отклонить</i></button></div>';
                    unacceptedID["" + rowNumber] = value._id;
                }
                if (targetID === '#report_table') {
                    acceptedID["" + rowNumber] = value._id;
                }
                //====date column=====
                var datet = value.date.substring(0, value.date.indexOf('T')).split("-");
                operation_data += '<td>' + datet[2] + "/" + datet[1] + "/" + datet[0] + xtraData + '</td>';
                //====destination column=====
                destination = data;
                operation_data += '<td><div class="transfer_participant">' +
                    '<span class="transfer_data"><i class="fa fa-male" aria-hidden="true"></i>' + destination.agent + '</span>';
                if (destination.reserve !== null) {
                    operation_data += '<span class="transfer_data"><i class="fa fa-credit-card" aria-hidden="true"></i>' + destination.reserve + '</span>';
                }
                operation_data += '</div></td>';

                //======forming comission string and getting a currency========
                var commiss = value.commiss;
                var comStr = (commiss > 0) ? " (+" + commiss + ")" : "";
                var curStr = value.currency,
                    creditStr = (value.percent > 0) ? "<span class='red'> " + value.percent + "%</span>" : "";
                //====operation details column=====
                operation_data += '<td class="transfer_arrow">' +
                    '<div class="description">' + value.description + '</div>' +
                    '<img src="../img/arrow.png" width="30px">' + value.transaction.toLocaleString("ru-RU", {maximumFractionDigits: 2}) + '<span class="red">' + comStr + "</span> " + curStr + creditStr +
                    '</td>';

                getParticipantData(value.source, function (data) {
                    source = data;

                    //====source column=====
                    operation_data += '<td><div class="transfer_participant">' +
                        '<span class="transfer_data"><i class="fa fa-male" aria-hidden="true"></i>' + source.agent + '</span>';
                    if (source.reserve !== null) {
                        operation_data += '<span class="transfer_data"><i class="fa fa-credit-card" aria-hidden="true"></i>' + source.reserve + '</span>';
                    }
                    operation_data += '</div></td>';
                    operation_data += '</tr>';
                });
            });

        });
        $(targetID + " tr th").removeClass("hidden");
        $(targetID).append(operation_data);
    } else if (targetID === '#report_table') {
        $("#message").html("Завершенных операций пока нет");
    }
}

function acceptEntry(id) {
    console.log(unacceptedList);
    var currency = unacceptedList.data.find(function (a) {
        return a._id === unacceptedID[id];
    }).currency, userReservesOptions = {};

    for (var i = 0; i < IOReserves.length; i++) {
        if (IOReserves[i].currency === currency && IOReserves[i].responsible === username) {
            userReservesOptions[IOReserves[i].title] = IOReserves[i].title;
        }
    }
    console.log(userReservesOptions);
    swal({
        title: 'Подтверждение операции',
        text: "Выберите целевой резерв",
        input: 'select',
        inputOptions: userReservesOptions,
        inputPlaceholder: 'Выберите резерв',
        showCancelButton: true,
        inputValidator: function (value) {
            return new Promise(function (resolve, reject) {
                if (value !== '') {
                    resolve()
                } else {
                    reject('Выберите любой резерв')
                }
            })
        }
    }).then(function (isPressed) {
        if (isPressed) {
            $.ajax({
                url: apiServer + '/confirmation',
                type: 'post',
                headers: {'authorization': token},
                data: "&id=" + unacceptedID[id] + "&fulfilled=true&destination=" + isPressed,
                success: function (data) {
                    swal("Успех", "Перевод был подтвержден", "success");
                    $("#unaccepted_table_tr" + id).detach().appendTo($("#report_table"));
                    delete unacceptedID[id];
                    $("#report_table").show(200);
                    if (Object.keys(unacceptedID).length === 0) {
                        $("#unaccepted_table").hide(200);
                        $("#message").html("");
                    }
                    reBuildSidebarContent();
                    reBuildHeaderInfo();
                },
                error: function (err) {
                    swal("Упс", "Ошибка при подтверждении перевода", "error");
                }
            });
        }
    });
}

function declineEntry(id) {
    swal({
        title: 'Подтверждение операции',
        text: "Вы действительно хотите отклонить этот перевод?",
        type: "question",
        showCancelButton: true
    }).then(function (pressed) {
        if (pressed) {
            $.ajax({
                url: apiServer + '/confirmation',
                type: 'post',
                headers: {'authorization': token},
                data: "&id=" + unacceptedID[id] + "&fulfilled=false",
                success: function () {
                    swal("Успех", "Перевод был отклонен", "success");
                    $("#unaccepted_table_tr" + id).hide();
                    delete unacceptedID[id];
                    if (Object.keys(unacceptedID).length === 0) {
                        $("#unaccepted_table").hide(200);
                        $("#message").html("");
                    }
                    reBuildSidebarContent();
                },
                error: function (err) {
                    swal("Упс", "Ошибка при отмене перевода", "error");
                }
            });
        }
    });
}
