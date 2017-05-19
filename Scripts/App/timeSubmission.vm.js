window.timeSubmission = window.timeSubmission || {};
window.timeSubmission.vm = (function (model, business) {

    // View For Bind the ViewModel On it
    var $view = $("#timeSubmissionContainer");
    var $weekPicker = $('#weekpicker');
    var dateFormat = function (date) {
        return ("0" + date).slice(-2);
    };

    // The ViewModel
    var timeSubmissionVm = function (assignedTasks) {

        var self = this;
        self.startDate;
        self.endDate;

        self.weekDays = ko.observableArray([]);
        self.projects = ko.observableArray([]);
        self.temptask = ko.observable();
        self.weekNumber = ko.observable();

        self.setWeekDate = function (direction, date) {
            var weekDate;

            switch (direction) {
                case "change":
                    date = date || new Date();
                    self.startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay());
                    self.endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + 6);
                    $weekPicker.datepicker('update', self.startDate);
                    weekDate = dateFormat(self.startDate.getDate()) + '/' + dateFormat((self.startDate.getMonth() + 1)) + '/' + self.startDate.getFullYear() + ' - ' + dateFormat(self.endDate.getDate()) + '/' + dateFormat((self.endDate.getMonth() + 1)) + '/' + self.endDate.getFullYear();
                    break;

                case "prev":
                    self.startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() - 7);
                    self.endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() - 1);
                    $weekPicker.datepicker("setDate", new Date(self.startDate));
                    weekDate = dateFormat(self.startDate.getDate()) + '/' + dateFormat((self.startDate.getMonth() + 1)) + '/' + self.startDate.getFullYear() + ' - ' + dateFormat(self.endDate.getDate()) + '/' + dateFormat((self.endDate.getMonth() + 1)) + '/' + self.endDate.getFullYear();
                    break;

                case "next":
                    self.startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + 7);
                    self.endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + 13);
                    $weekPicker.datepicker("setDate", new Date(self.startDate));
                    weekDate = dateFormat(self.startDate.getDate()) + '/' + dateFormat((self.startDate.getMonth() + 1)) + '/' + self.startDate.getFullYear() + ' - ' + dateFormat(self.endDate.getDate()) + '/' + dateFormat((self.endDate.getMonth() + 1)) + '/' + self.endDate.getFullYear();
                    break;
            }
            return weekDate;

        };
        self.preWeek = function () {
            var date = $weekPicker.datepicker('getDate');
            $weekPicker.text(self.setWeekDate("prev", date));
            return false;
        };
        self.nextWeek = function () {
            var date = $weekPicker.datepicker('getDate');
            $weekPicker.text(self.setWeekDate("next", date));
            return false;
        };
        self.currentWeek = function () {
            $weekPicker.trigger("changeDate");
            return false;
        };
        self.weekChange = function (e) {
            var date = e.date;
            $weekPicker.text(self.setWeekDate("change", date));

            business.getTimeSheet(self.startDate)
                .done(function (response) {
                    self.model = new model.TimeSheet(response.timeSheet);
                    self.projects(self.model.projects());
                });

            self.extractWeekDays(self.startDate);
            self.weekNumber(moment(self.startDate).week());
        };
        self.extractWeekDays = function (startDate) {
            self.weekDays([]);
            var tempDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() - startDate.getDay());
            var formattedDate = dateFormat(tempDate.getDate()) + '/' + dateFormat((tempDate.getMonth() + 1));

            self.weekDays.push({
                day: "Sun,",
                date: formattedDate
            });

            for (var index = 1; index <= 6; index++) {
                tempDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() - startDate.getDay() + index);
                formattedDate = dateFormat(tempDate.getDate()) + '/' + dateFormat((tempDate.getMonth() + 1));

                switch (index) {
                    case 1:
                        self.weekDays.push({
                            day: "Mon,",
                            date: formattedDate
                        });
                        break;
                    case 2:
                        self.weekDays.push({
                            day: "Tues,",
                            date: formattedDate
                        });
                        break;
                    case 3:
                        self.weekDays.push({
                            day: "Wed,",
                            date: formattedDate
                        });
                        break;
                    case 4:
                        self.weekDays.push({
                            day: "Thu,",
                            date: formattedDate
                        });
                        break;
                    case 5:
                        self.weekDays.push({
                            day: "Fri,",
                            date: formattedDate
                        });
                        break;
                    case 6:
                        self.weekDays.push({
                            day: "Sat,",
                            date: formattedDate
                        });
                        break;
                }

            }
        };

        self.computeTotalDay = function (day) {
            var total = 0;

            ko.utils.arrayForEach(self.projects(), function (projectItem) {
                ko.utils.arrayForEach(projectItem.tasks(), function (taskItem) {

                    var taskJS = ko.mapping.toJS(taskItem);
                    if (isNaN(taskJS[day].value))
                        total = 0;
                    else
                        total = total + Number(taskJS[day].value);
                });
            });

            return total;
        };

        ////////////////////////////////////////////////////////////////////

        self.totalSaturday = ko.pureComputed(function () {
            return self.computeTotalDay("saturday");
        });
        self.totalSunday = ko.pureComputed(function () {
            return self.computeTotalDay("sunday");
        });
        self.totalMonday = ko.pureComputed(function () {
            return self.computeTotalDay("monday");
        });
        self.totalTuesday = ko.pureComputed(function () {
            return self.computeTotalDay("tuesday");
        });
        self.totalWednesday = ko.pureComputed(function () {
            return self.computeTotalDay("wednesday");
        });
        self.totalThursday = ko.pureComputed(function () {
            return self.computeTotalDay("thursday");
        });
        self.totalFriday = ko.pureComputed(function () {
            return self.computeTotalDay("friday");
        });
        self.totalSubTotal = ko.pureComputed(function () {
            return self.computeTotalDay("totalTask");
        });

        /////////////////////////////////////////////////////////////////////

        self.EditCell = function (task, event) {
            var day = $(event.target).data("day");
            task[day].show(true);
        };
        self.isValidDayValue = true;
        self.checkEditing = function (task, event) {

            var timeDay = $(event.target).val();
            var day = $(event.target).data("day");

            // Check if timeDay is Number
            if (isNaN(timeDay)) {
                task[day].isNumber(false);
                task[day].show(true);
                self.isValidDayValue = false;
            } else {
                task[day].isNumber(true);

                if (Number(timeDay) > 24 || Number(timeDay) < 0) {
                    task[day].isNumber(false);
                    task[day].show(true);
                    self.isValidDayValue = false;
                } else {
                    self.isValidDayValue = true;
                    var valueObj = {
                        recordId: task[day].id,
                        taskId: task.taskId,
                        taskDate: task[day].date || moment(new Date(new Date(self.startDate).setDate(self.startDate.getDate() + task[day].DayOfWeek() - 1))).format('DD/MM/YYYY'),
                        projectId: task.parent.projectId,
                        value: timeDay,
                        rowId: task.rowId
                    };

                    business.saveDayValue(valueObj).done(function (response) {
                        task[day].id = response.RecordId;
                    });
                }
            }
        };
        self.submitSheet = function () {
            business.submitSheet(self.startDate)
                .done(function (response) {
                    self.model = new model.TimeSheet(response.timeSheet);
                    self.projects(self.model.projects());
                });
            console.log(ko.mapping.toJS(self.projects));
        };

        /////////////////////////////////////////////////////////////////////

        self.dragTreeMove = function (node, event) {
            $(".timeCover").css("display", "block");
        };
        self.dragTreeStop = function (node, event) {

            if ($(event.target).data("target") == true) {
                var tempTaskNode = {
                    taskName: node.name,
                    taskId: node.taskId,
                    sundayDate: self.startDate.getDate() + '/' + (self.startDate.getMonth() + 1) + '/' + self.startDate.getFullYear(),
                    mondayDate: (self.startDate.getDate() + 1) + '/' + (self.startDate.getMonth() + 1) + '/' + self.startDate.getFullYear(),
                    tuesdayDate: (self.startDate.getDate() + 2) + '/' + (self.startDate.getMonth() + 1) + '/' + self.startDate.getFullYear(),
                    wednesdayDate: (self.startDate.getDate() + 3) + '/' + (self.startDate.getMonth() + 1) + '/' + self.startDate.getFullYear(),
                    thursdayDate: (self.startDate.getDate() + 4) + '/' + (self.startDate.getMonth() + 1) + '/' + self.startDate.getFullYear(),
                    fridayDate: (self.startDate.getDate() + 5) + '/' + (self.startDate.getMonth() + 1) + '/' + self.startDate.getFullYear(),
                    saturdayDate: (self.startDate.getDate() + 6) + '/' + (self.startDate.getMonth() + 1) + '/' + self.startDate.getFullYear(),
                };
                var newTask = new model.Task(tempTaskNode, {
                    projectId: node.parent.projectId
                });
                var newProject;
                var targetProject;
                var isExist;

                // Check First If Project Exist At The Array Or Not
                $.each(self.projects(), function (index, project) {
                    if (project.projectId == node.parent.projectId) {
                        targetProject = ko.utils.arrayFirst(self.projects(), function (project) {
                            return project.projectId == node.parent.projectId;
                        });
                        isExist = true;
                        return false;
                    }
                });

                if (!isExist) {
                    // Create New Project And Push The task
                    node.parent.projectName = node.parent.name;
                    newProject = new model.Project(node.parent);
                    newProject.tasks.push(newTask);
                    isExist = false;
                    self.projects.push(newProject);
                } else {
                    targetProject.tasks.push(newTask);
                }
            }
            $(".timeCover").css("display", "none");
        };
        self.dataTree = assignedTasks;

        /////////////////////////////////////////////////////////////////////

        self.modalVisible = ko.observable(false);
        self.modalSize = ko.observable('');
        self.headerLabel = ko.observable('');
        self.bodyTemplate = ko.observable('commentTemplate');
        self.bodyData = {
            comment: ko.observable(),
            approverComment: ko.observable(),
            taskObs: {},
            day: {},
            isEditable: true
        };
        self.showCommentPopup = function (task, event) {
            if (self.isValidDayValue) {
                self.modalVisible(true);
                var day = $($(event.target).closest("td")).data("day");
                var comment = task[day].comment();
                var approverComment = task[day].approverComment();
                var isEditable = task[day].isEditable;


                self.headerLabel(task.taskName + ", " + day + " - " + task[day].date);
                self.bodyData.comment(comment);
                self.bodyData.approverComment(approverComment);
                self.bodyData.taskObs = task;
                self.bodyData.day = day;
                self.bodyData.isEditable = isEditable;
            }
        };
        self.saveComment = function () {
            var comment = self.bodyData.comment();
            var task = self.bodyData.taskObs;
            var day = self.bodyData.day;

            var commentObj = {
                recordId: task[day].id,
                taskId: task.taskId,
                taskDate: task[day].date,
                projectId: task.parent.projectId,
                comment: comment
            };

            if ($.trim(comment).length > 0) {
                // Update comment for this task.
                task[day].comment(comment);
                business.saveComment(commentObj).done(function (response) {
                    task[day].id = response.RecordId;
                    task[day].hasComment(true);
                });
            }
        };
        self.cancelComment = function () {

        };
        self.animateRow = function (dom, index, item) {
            if ($(dom).is("tr")) {
                $(dom).fadeOut("fast");
                $(dom).fadeIn("fast");

            }
        };
    };

    return {
        timeSubmissionVm: timeSubmissionVm,
        $view: $view
    }
}(window.timeSubmission.model, window.timeSubmission.business));