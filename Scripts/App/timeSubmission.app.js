window.timeSubmission = window.timeSubmission || {};

window.timeSubmission.app = (function (business, vm) {

    var init = function () {
        $(document).ready(function () {

            var assginedTasks = business.getAssignedTasks();

            $.when(assginedTasks)
                .done(function (tasks) {
                    var timeSheetvm = new vm.timeSubmissionVm(tasks.Tasks);
                    ko.applyBindings(timeSheetvm, vm.$view.get(0));
                });
        });
    };

    return {
        init: init,
    }
}(window.timeSubmission.business, window.timeSubmission.vm));

window.timeSubmission.app.init();