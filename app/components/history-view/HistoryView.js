"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var observable_1 = require("data/observable");
var bookmarks_1 = require("../common/bookmarks");
var AppViewModel_1 = require("../common/AppViewModel");
var gestures_1 = require("ui/gestures");
var enums_1 = require("ui/enums");
var HistoryViewModel = (function (_super) {
    __extends(HistoryViewModel, _super);
    function HistoryViewModel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.historyList = bookmarks_1.historyList;
        return _this;
    }
    return HistoryViewModel;
}(observable_1.Observable));
exports.HistoryViewModel = HistoryViewModel;
exports.viewModel = new HistoryViewModel();
var listView;
var editing = false;
function onLoaded(args) {
    listView = args.object;
    listView.bindingContext = exports.viewModel;
}
exports.onLoaded = onLoaded;
function onTap(args) {
    if (editing)
        return;
    closeAllCells();
    var item = args.object.bindingContext;
    AppViewModel_1.appViewModel.loadUrl(item.uri);
}
exports.onTap = onTap;
function onDelete(args) {
    closeAllCells();
    var item = args.object.bindingContext;
    var i = bookmarks_1.historyList.indexOf(item);
    bookmarks_1.historyList.splice(i, 1);
}
exports.onDelete = onDelete;
var swipeLimit = -64;
var openCells = [];
function onItemLoaded(args) {
    var itemView = args.object;
    var contentView = itemView.getViewById('content');
    var deleteView = itemView.getViewById('delete');
    var cell = { contentView: contentView, deleteView: deleteView };
    var panStart = 0;
    contentView.on(gestures_1.GestureTypes.pan, function (data) {
        if (data.state === gestures_1.GestureStateTypes.began) {
            panStart = contentView.translateX;
            closeAllCells(cell);
            editing = true;
        }
        contentView.translateX = Math.min(Math.max(panStart + data.deltaX, -1000), 0);
        if (data.state === gestures_1.GestureStateTypes.ended) {
            editing = false;
            var open = contentView.translateX < swipeLimit * 0.75;
            toggleCellSwipeState(cell, open);
        }
        else {
            deleteView.visibility = 'visible';
        }
    });
}
exports.onItemLoaded = onItemLoaded;
function closeAllCells(exceptCell) {
    openCells.forEach(function (cell) {
        if (cell !== exceptCell)
            toggleCellSwipeState(cell, false);
    });
    openCells = exceptCell ? [exceptCell] : [];
}
function toggleCellSwipeState(cell, open) {
    var finalTranslateX = open ? swipeLimit : 0;
    cell.contentView.animate({
        translate: { x: finalTranslateX, y: 0 },
        curve: enums_1.AnimationCurve.easeInOut
    }).then(function () {
        cell.contentView.translateX = finalTranslateX;
        if (!open)
            cell.deleteView.visibility = 'collapse';
    });
    if (open) {
        openCells.push(cell);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGlzdG9yeVZpZXcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJIaXN0b3J5Vmlldy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDhDQUEyQztBQUczQyxpREFBNkQ7QUFDN0QsdURBQW1EO0FBRW5ELHdDQUlxQjtBQUVyQixrQ0FBdUM7QUFFdkM7SUFBc0Msb0NBQVU7SUFBaEQ7UUFBQSxxRUFFQztRQURHLGlCQUFXLEdBQUcsdUJBQVcsQ0FBQzs7SUFDOUIsQ0FBQztJQUFELHVCQUFDO0FBQUQsQ0FBQyxBQUZELENBQXNDLHVCQUFVLEdBRS9DO0FBRlksNENBQWdCO0FBR2hCLFFBQUEsU0FBUyxHQUFHLElBQUksZ0JBQWdCLEVBQUUsQ0FBQztBQUVoRCxJQUFJLFFBQWlCLENBQUM7QUFDdEIsSUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDO0FBRXBCLGtCQUF5QixJQUFJO0lBQ3pCLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3ZCLFFBQVEsQ0FBQyxjQUFjLEdBQUcsaUJBQVMsQ0FBQztBQUN4QyxDQUFDO0FBSEQsNEJBR0M7QUFFRCxlQUFzQixJQUFJO0lBQ3RCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQztRQUFDLE1BQU0sQ0FBQTtJQUNuQixhQUFhLEVBQUUsQ0FBQztJQUNoQixJQUFJLElBQUksR0FBaUIsSUFBSSxDQUFDLE1BQWUsQ0FBQyxjQUFjLENBQUM7SUFDN0QsMkJBQVksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ25DLENBQUM7QUFMRCxzQkFLQztBQUVELGtCQUF5QixJQUFJO0lBQ3pCLGFBQWEsRUFBRSxDQUFDO0lBQ2hCLElBQUksSUFBSSxHQUFpQixJQUFJLENBQUMsTUFBZSxDQUFDLGNBQWMsQ0FBQztJQUM3RCxJQUFJLENBQUMsR0FBRyx1QkFBVyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNsQyx1QkFBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVB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fSBmcm9tICdkYXRhL29ic2VydmFibGUnO1xuaW1wb3J0IHtWaWV3fSBmcm9tICd1aS9jb3JlL3ZpZXcnO1xuaW1wb3J0IHtMaXN0Vmlld30gZnJvbSAndWkvbGlzdC12aWV3JztcbmltcG9ydCB7Qm9va21hcmtJdGVtLCBoaXN0b3J5TGlzdH0gZnJvbSAnLi4vY29tbW9uL2Jvb2ttYXJrcydcbmltcG9ydCB7YXBwVmlld01vZGVsfSBmcm9tICcuLi9jb21tb24vQXBwVmlld01vZGVsJ1xuXG5pbXBvcnQge1xuICBHZXN0dXJlVHlwZXMsXG4gIEdlc3R1cmVTdGF0ZVR5cGVzLFxuICBQYW5HZXN0dXJlRXZlbnREYXRhLFxufSBmcm9tICd1aS9nZXN0dXJlcyc7XG5cbmltcG9ydCB7QW5pbWF0aW9uQ3VydmV9IGZyb20gJ3VpL2VudW1zJ1xuXG5leHBvcnQgY2xhc3MgSGlzdG9yeVZpZXdNb2RlbCBleHRlbmRzIE9ic2VydmFibGUge1xuICAgIGhpc3RvcnlMaXN0ID0gaGlzdG9yeUxpc3Q7XG59XG5leHBvcnQgY29uc3Qgdmlld01vZGVsID0gbmV3IEhpc3RvcnlWaWV3TW9kZWwoKTtcblxubGV0IGxpc3RWaWV3Okxpc3RWaWV3O1xubGV0IGVkaXRpbmcgPSBmYWxzZTtcblxuZXhwb3J0IGZ1bmN0aW9uIG9uTG9hZGVkKGFyZ3MpIHtcbiAgICBsaXN0VmlldyA9IGFyZ3Mub2JqZWN0O1xuICAgIGxpc3RWaWV3LmJpbmRpbmdDb250ZXh0ID0gdmlld01vZGVsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gb25UYXAoYXJncykge1xuICAgIGlmIChlZGl0aW5nKSByZXR1cm5cbiAgICBjbG9zZUFsbENlbGxzKCk7XG4gICAgdmFyIGl0ZW06Qm9va21hcmtJdGVtID0gKGFyZ3Mub2JqZWN0IGFzIFZpZXcpLmJpbmRpbmdDb250ZXh0O1xuICAgIGFwcFZpZXdNb2RlbC5sb2FkVXJsKGl0ZW0udXJpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG9uRGVsZXRlKGFyZ3MpIHtcbiAgICBjbG9zZUFsbENlbGxzKCk7XG4gICAgdmFyIGl0ZW06Qm9va21hcmtJdGVtID0gKGFyZ3Mub2JqZWN0IGFzIFZpZXcpLmJpbmRpbmdDb250ZXh0O1xuICAgIHZhciBpID0gaGlzdG9yeUxpc3QuaW5kZXhPZihpdGVtKTtcbiAgICBoaXN0b3J5TGlzdC5zcGxpY2UoaSwgMSk7XG59XG5cbmNvbnN0IHN3aXBlTGltaXQgPSAtNjQ7XG5cbmludGVyZmFjZSBDZWxsVmlld3Mge1xuICAgIGNvbnRlbnRWaWV3OlZpZXcsIFxuICAgIGRlbGV0ZVZpZXc6Vmlld1xufVxuXG5sZXQgb3BlbkNlbGxzOkFycmF5PENlbGxWaWV3cz4gPSBbXVxuXG5leHBvcnQgZnVuY3Rpb24gb25JdGVtTG9hZGVkKGFyZ3MpIHtcbiAgICB2YXIgaXRlbVZpZXc6VmlldyA9IGFyZ3Mub2JqZWN0O1xuICAgIHZhciBjb250ZW50VmlldyA9IGl0ZW1WaWV3LmdldFZpZXdCeUlkKCdjb250ZW50Jyk7XG4gICAgdmFyIGRlbGV0ZVZpZXcgPSBpdGVtVmlldy5nZXRWaWV3QnlJZCgnZGVsZXRlJyk7XG4gICAgdmFyIGNlbGwgPSB7Y29udGVudFZpZXcsIGRlbGV0ZVZpZXd9O1xuICAgIFxuICAgIHZhciBwYW5TdGFydD0wO1xuICAgIGNvbnRlbnRWaWV3Lm9uKEdlc3R1cmVUeXBlcy5wYW4sIChkYXRhOlBhbkdlc3R1cmVFdmVudERhdGEpPT57XG4gICAgICAgIFxuICAgICAgICBpZiAoZGF0YS5zdGF0ZSA9PT0gR2VzdHVyZVN0YXRlVHlwZXMuYmVnYW4pIHtcbiAgICAgICAgICAgIHBhblN0YXJ0ID0gY29udGVudFZpZXcudHJhbnNsYXRlWDtcbiAgICAgICAgICAgIGNsb3NlQWxsQ2VsbHMoY2VsbCk7XG4gICAgICAgICAgICBlZGl0aW5nID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgY29udGVudFZpZXcudHJhbnNsYXRlWCA9IE1hdGgubWluKE1hdGgubWF4KHBhblN0YXJ0ICsgZGF0YS5kZWx0YVgsIC0xMDAwKSwgMCk7XG4gICAgICAgIFxuICAgICAgICBpZiAoZGF0YS5zdGF0ZSA9PT0gR2VzdHVyZVN0YXRlVHlwZXMuZW5kZWQpIHtcbiAgICAgICAgICAgIGVkaXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIHZhciBvcGVuID0gY29udGVudFZpZXcudHJhbnNsYXRlWCA8IHN3aXBlTGltaXQqMC43NTtcbiAgICAgICAgICAgIHRvZ2dsZUNlbGxTd2lwZVN0YXRlKGNlbGwsIG9wZW4pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGVsZXRlVmlldy52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgIH0pXG59XG5cbmZ1bmN0aW9uIGNsb3NlQWxsQ2VsbHMoZXhjZXB0Q2VsbD86Q2VsbFZpZXdzKSB7XG4gICAgb3BlbkNlbGxzLmZvckVhY2goKGNlbGwpPT57XG4gICAgICAgIGlmIChjZWxsICE9PSBleGNlcHRDZWxsKSB0b2dnbGVDZWxsU3dpcGVTdGF0ZShjZWxsLCBmYWxzZSk7XG4gICAgfSlcbiAgICBvcGVuQ2VsbHMgPSBleGNlcHRDZWxsID8gW2V4Y2VwdENlbGxdIDogW107XG59XG5cbmZ1bmN0aW9uIHRvZ2dsZUNlbGxTd2lwZVN0YXRlKGNlbGw6Q2VsbFZpZXdzLCBvcGVuOmJvb2xlYW4pIHtcbiAgICBjb25zdCBmaW5hbFRyYW5zbGF0ZVggPSBvcGVuID8gc3dpcGVMaW1pdCA6IDBcbiAgICBjZWxsLmNvbnRlbnRWaWV3LmFuaW1hdGUoe1xuICAgICAgICB0cmFuc2xhdGU6e3g6ZmluYWxUcmFuc2xhdGVYLCB5OjB9LFxuICAgICAgICBjdXJ2ZTogQW5pbWF0aW9uQ3VydmUuZWFzZUluT3V0XG4gICAgfSkudGhlbigoKT0+e1xuICAgICAgICBjZWxsLmNvbnRlbnRWaWV3LnRyYW5zbGF0ZVggPSBmaW5hbFRyYW5zbGF0ZVg7XG4gICAgICAgIGlmICghb3BlbikgY2VsbC5kZWxldGVWaWV3LnZpc2liaWxpdHkgPSAnY29sbGFwc2UnO1xuICAgIH0pO1xuICAgIGlmIChvcGVuKSB7XG4gICAgICAgIG9wZW5DZWxscy5wdXNoKGNlbGwpO1xuICAgIH1cbn0iXX0=