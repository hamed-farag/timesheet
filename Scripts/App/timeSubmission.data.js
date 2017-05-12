window.timeSubmission = window.timeSubmission || {};
window.timeSubmission.data = (function () {
    var obj = {};
    var apiServer = " http://localhost:3000/";
    obj.urls = {
        getAssignedTasksUrl: apiServer + "GetAssignedTasks",
        getTimeSheetUrl: apiServer + "GetTimeSheet",
        saveCommentUrl: apiServer + "SaveComment",
        saveValueUrl: apiServer + "SaveDayValue",
        submitSheetUrl: apiServer + "Submit"
    };

    obj.getAssignedTasks = function () {
        return $.ajax({
            url: obj.urls.getAssignedTasksUrl,
            type: 'GET'
        });
    };

    obj.getTimeSheet = function (startDate) {
        return $.ajax({
            url: obj.urls.getTimeSheetUrl,
            type: 'GET',
            contentType: 'application/json',
            data: {
                startDate: startDate
            }
        });
    };

    obj.saveComment = function (comment) {
        return $.ajax({
            url: obj.urls.saveCommentUrl,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                comment: comment
            })
        });
    };

    obj.saveDayValue = function (value) {
        return $.ajax({
            url: obj.urls.saveValueUrl,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                value: value
            })
        });
    };

    obj.submitSheet = function (startDate) {
        return $.ajax({
            url: obj.urls.submitSheetUrl,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                startDate: startDate
            })
        });
    };

    return obj;
}({}));