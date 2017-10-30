var apiServer = 'http://35.194.192.181:8080';

var botComission = 0;

getUserParameters(function (data) {
    botComission = parseFloat(data.percentBOT);
});

function getUserParameters(callback) {
    return $.ajax({
        url: apiServer + '/userSetting',
        type: 'get',
        headers: {'authorization': token},
        success: function (data) {
            callback(data);
        },
        error: function (err) {
            callback(err);
        }
    });
}

function fillSelectWithCurrencies(select, sourceSelect) {
    var sselect = document.getElementById(sourceSelect);
    var bank = sselect.options[sselect.selectedIndex].value;
    var currencies = '';
    getBankList(function (data) {
        $.each(data, function (key, value) {
            if (value.bank === bank) {
                currencies = value.currency.split(',');
            }
        });
        select.removeAttribute('disabled');
        for (var j = select.options.length; j >= 0; j--) {
            select.remove(j);
        }
        for (var i = 0; i < currencies.length; i++) {
            var opt = document.createElement("option");
            opt.innerHTML = currencies[i];
            select.appendChild(opt);
        }
    });
}

function fillSelectFromArray(select, array) {
    select.removeAttribute('disabled');
    for (var j = select.options.length; j >= 0; j--) {
        if (j !== select.selectedIndex) {
            select.remove(j);
        } else {
            select.options[j].text = ".....";
        }
    }
    for (var i = 0; i < array.length; i++) {
        var opt = document.createElement("option");
        opt.innerHTML = array[i];
        opt.value = array[i];
        select.appendChild(opt);
    }
}

function getFullPaymentData(callback) {
    var totalRub = 0, totalBtc = 0, currentAvg = 0;
    return $.ajax({
        url: apiServer + '/reportpay',
        type: 'get',
        headers: {'authorization': localStorage.getItem('token')},
        crossDomain: true,
        success: function (data) {
            if (data) {
                $.each(data, function (key, value) {
                    currentAvg = ((totalBtc * currentAvg) + value.rub) / (totalBtc + value.btc);
                    totalBtc += value.btc - value.bot_commiss;
                    totalRub -= value.rub + value.commiss;
                });
            }
            var result = {
                'data': (data) ? data : "",
                'avg': currentAvg.toFixed(2),
                'btc': totalBtc.toFixed(8),
                'rub': totalRub.toFixed(2)
            };
            callback(result);
        },
        error: function (err) {
            callback(err.status);
        }
    });
}

function getFullSalesData(callback) {
    return $.ajax({
        url: apiServer + '/reportsell',
        type: 'get',
        headers: {'authorization': localStorage.getItem('token')},
        crossDomain: true,
        success: function (data) {
            var result = {
                'data': data
            };
            callback(result);
        },
        error: function (err) {
            callback(err.status);
        }
    });
}

function getFullTransferData(callback) {
    return $.ajax({
        url: apiServer + '/reporttranslate',
        type: 'get',
        headers: {'authorization': localStorage.getItem('token')},
        crossDomain: true,
        success: function (data) {
            var result = {
                'data': data
            };
            callback(result);
        },
        error: function (err) {
            callback(err.status);
        }
    });
}

function getUnacceptedTransferData(callback) {
    return $.ajax({
        url: apiServer + '/checktranslate',
        type: 'get',
        headers: {'authorization': localStorage.getItem('token')},
        crossDomain: true,
        success: function (data) {
            var result = {
                'data': data
            };
            callback(result);
        },
        error: function (err) {
            callback(err.status);
        }
    });
}

function getReserveList(callback) {
    return $.ajax({
        url: apiServer + '/reserves',
        type: 'get',
        headers: {'authorization': localStorage.getItem('token')},
        success: function (data) {
            callback(data);
        },
        error: function (err) {
            callback(err.status);
        }
    });
}

function getCurrencyList(callback) {
    return $.ajax({
        url: apiServer + '/currency',
        type: 'get',
        headers: {'authorization': localStorage.getItem('token')},
        success: function (data) {
            callback(data);
        },
        error: function (err) {
            callback(err.status);
        }
    });
}

function getBankList(callback) {
    return $.ajax({
        url: apiServer + '/banks',
        type: 'get',
        headers: {'authorization': localStorage.getItem('token')},
        success: function (data) {
            callback(data);
        },
        error: function (err) {
            callback(err.status);
        }
    });
}

function getAntiagentList(callback) {
    return $.ajax({
        url: apiServer + '/anti_agent',
        type: 'get',
        headers: {'authorization': localStorage.getItem('token')},
        success: function (data) {
            callback(data);
        },
        error: function (err) {
            callback(err.status);
        }
    });
}

function getCredits(callback) {
    return $.ajax({
        url: apiServer + '/reportcredit',
        type: 'get',
        headers: {'authorization': localStorage.getItem('token')},
        success: function (data) {
            callback(data);
        },
        error: function (err) {
            callback(err.status);
        }
    });
}

function getRemainders(callback) {
    return $.ajax({
        url: apiServer + "/remainder",
        type: 'get',
        headers: {'authorization': localStorage.getItem('token')},
        success: function (data) {
            callback(data);
        },
        error: function (err) {
            callback(err.status);
        }
    });
}

function getMentorInvites(callback) {
    return $.ajax({
        url: apiServer + '/checkMentor',
        type: 'get',
        headers: {'authorization': localStorage.getItem('token')},
        success: function (data) {
            callback(data);
        },
        error: function (err) {
            callback(err.status);
        }
    });
}

function getMentorList(callback) {
    return $.ajax({
        url: apiServer + "/listMentor",
        type: 'get',
        headers: {'authorization': localStorage.getItem('token')},
        success: function (data) {
            callback(data);
        },
        error: function (err) {
            callback(err.status);
        }
    });
}

function getReserveSwitches(callback) {
    return $.ajax({
        url: apiServer + '/checkPass',
        type: 'get',
        headers: {'authorization': localStorage.getItem('token')},
        success: function (data) {
            callback(data);
        },
        error: function (err) {
            callback(err.status);
        }
    });
}

function clearHistory(callback) {
    return $.ajax({
        url: apiServer + '/deleteMyOperations',
        type: 'get',
        headers: {'authorization' : token},
        success: function (data) {
            callback(1);
        },
        error: function (err) {
            callback(err);
        }
    });
}

function getDealFinrez(income, avgCourse, btcOutcome, botCommiss, comiss) {
    var result;
    result = (income - (avgCourse * btcOutcome) - (botCommiss * avgCourse) - comiss).toFixed(2);
    return parseFloat(result);
}


