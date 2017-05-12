window.timeSubmission = window.timeSubmission || {};
window.timeSubmission.business = (function (data) {
    var obj = {};
    obj.getAssignedTasks = function () {
        return data.getAssignedTasks();
    };

    obj.getTimeSheet = function (startDate) {
        return data.getTimeSheet(startDate.toISOString());
    };

    obj.saveComment = function (commentObj) {
        return data.saveComment(commentObj);
    };

    obj.saveDayValue = function (valueObj) {
        return data.saveDayValue(valueObj);
    };

    obj.submitSheet = function (startDate) {
        return data.submitSheet(startDate);
    };

    return obj;
}(window.timeSubmission.data));