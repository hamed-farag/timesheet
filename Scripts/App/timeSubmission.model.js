window.timeSubmission = window.timeSubmission || {};

window.timeSubmission.model = (function () {

    var Project = function (project) {
        var self = this;
        self.projectId = project && project.projectId || "";
        self.projectName = project && project.projectName || "";

        self.tasks = project && ko.observableArray(project.tasks && createTasksArray(project.tasks, { projectId: self.projectId }) || []);
    };

    var Cell = function (cell) {
        var self = this;

        self.id = cell && cell.CellID || "";
        self.value = ko.observable(cell && cell.Value || "");
        self.show = ko.observable(false);
        self.date = cell && cell.date || "";
        self.isNumber = ko.observable(true);
        self.comment = ko.observable(cell && cell.Comment || "");
        self.approverComment = ko.observable(cell && cell.ApproverComment || "");
        self.hasComment = ko.observable(cell && cell.Comment && cell.Comment.length > 0 || false);
        self.DayOfWeek = ko.observable(cell && cell.DayOfWeek || "");
        self.requestID   = cell && cell.RequestID || "";
        self.requestType = cell && cell.requestType || "";
        self.isEditable  = cell && (cell.IsEditable==undefined || cell.IsEditable);
        self.isApproved  = cell &&  cell.IsApproved;
        self.isPending   = cell &&  cell.IsPending;
        self.isRejected  = cell &&  cell.IsRejected;
        self.cellStyle = ko.computed(function () {
            var styles = '';
            if (self.value()!="" && !self.isNumber()) {
                styles = styles + ' wrongNumber ';
            }
            
            if (self.isApproved) {
                styles = styles + ' approvedCell ';
            }
            if (self.isRejected) {
                styles = styles + ' rejectedCell ';
            }
            if (self.isPending) {
                styles = styles + ' pendingCell ';
            }

            if (self.IsHoliday) {
                styles = styles + ' holiday';
            }

            
            return styles;
        }, self);
    };

    var Task = function (taskItem, parent) {
        var self = this;
        self.parent = parent;
        self.taskName = taskItem && taskItem.taskName || "";
        self.taskId = taskItem && taskItem.taskId || "";
        self.rowId = taskItem && taskItem.rowId || "";
        //self.isSubmitted = taskItem && taskItem.taskId || false;

        self.sunday = new Cell(taskItem.Cells && taskItem.Cells.find(function (c) { return c.DayName.toLowerCase() === "sunday" }) || { DayOfWeek: 1 });
        self.monday = new Cell(taskItem.Cells && taskItem.Cells.find(function (c) { return c.DayName.toLowerCase() === "monday" }) || { DayOfWeek: 2 });
        self.tuesday = new Cell(taskItem.Cells && taskItem.Cells.find(function (c) { return c.DayName.toLowerCase() === "tuesday" }) || { DayOfWeek: 3 });
        self.wednesday = new Cell(taskItem.Cells && taskItem.Cells.find(function (c) { return c.DayName.toLowerCase() === "wednesday" }) || { DayOfWeek: 4 });
        self.thursday = new Cell(taskItem.Cells && taskItem.Cells.find(function (c) { return c.DayName.toLowerCase() === "thrusday" }) || { DayOfWeek: 5 });
        self.friday = new Cell(taskItem.Cells && taskItem.Cells.find(function (c) { return c.DayName.toLowerCase() === "friday" }) || { DayOfWeek: 6 });
        self.saturday = new Cell(taskItem.Cells && taskItem.Cells.find(function (c) { return c.DayName.toLowerCase() === "saturday" }) || { DayOfWeek: 7 });

        self.totalTask = {
            value: ko.computed(function () {
                if (isNaN(self.saturday.value()) || isNaN(self.sunday.value()) || isNaN(self.monday.value()) || isNaN(self.tuesday.value()) || isNaN(self.wednesday.value()) || isNaN(self.thursday.value()) || isNaN(self.friday.value())) {
                    return 0;
                } else {
                    return Number(self.saturday.value()) + Number(self.sunday.value()) + Number(self.monday.value()) + Number(self.tuesday.value()) + Number(self.wednesday.value()) + Number(self.thursday.value()) + Number(self.friday.value());
                }
            })
        };
    };

    var createProjectsArray = function (projects) {
        var newArray = [];
        $.each(projects, function (index, project) {
            newArray.push(new Project(project));
        });
        return newArray;
    };

    var createTasksArray = function (tasks, parent) {
        var newArray = [];
        $.each(tasks, function (index, task) {
            newArray.push(new Task(task, parent));
        });
        return newArray;
    };

    var TimeSheet = function (projects) {
        var self = this;
        self.projects = projects && ko.observableArray(createProjectsArray(projects)) || ko.observableArray([]);
    };

    return {
        TimeSheet: TimeSheet,
        Project: Project,
        Task: Task
    }
}());