window.timeSubmission = window.timeSubmission || {};

window.timeSubmission.binding = (function () {

    var customBindings = function () {
        ko.bindingHandlers.jqTree = {
            update: function (element, valueAccessor, allBindings) {
                // First get the latest data that we're bound to
                var value = valueAccessor();
                
                // Next, whether or not the supplied model property is observable, get its current value
                var valueUnwrapped = ko.unwrap(value);
                
                $(element).tree({
                    data: ko.unwrap(valueUnwrapped.data),
                    autoOpen: true,
                    dragAndDrop: true,
                    keyboardSupport: false,
                    onDragMove: valueUnwrapped.dragMove,
                    onDragStop: valueUnwrapped.dragStop,
                    onCanMove: function (node) {
                        if (!node.parent.parent) {
                            // Example: Cannot move root node
                            return false;
                        }
                        else {
                            return true;
                        }
                    },
                    onCanMoveTo: function (moved_node, target_node, position) {
                        if ($(target_node.element).hasClass("jqtree_common")) {
                            return false;
                        }
                        else {
                            return true;
                        }
                    }
                });
            }
        };

        ko.bindingHandlers.weekPicker = {
            update: function (element, valueAccessor, allBindings) {
                // First get the latest data that we're bound to
                var value = valueAccessor();

                // Next, whether or not the supplied model property is observable, get its current value
                var valueUnwrapped = ko.unwrap(value);

                $(element).datepicker({
                    autoclose: true,
                    format: 'dd/mm/yyyy',
                    forceParse: false
                }).on("changeDate", valueUnwrapped.weekChange);

                $(element).trigger("changeDate");
            }
        };
    };

    var run = function () {
        customBindings();
    };

    return {
        run: run
    }
}());

window.timeSubmission.binding.run();