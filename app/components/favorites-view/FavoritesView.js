"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var application = require("application");
var observable_1 = require("data/observable");
var bookmarks_1 = require("../common/bookmarks");
var AppViewModel_1 = require("../common/AppViewModel");
var gestures_1 = require("ui/gestures");
var enums_1 = require("ui/enums");
var FavoritesViewModel = (function (_super) {
    __extends(FavoritesViewModel, _super);
    function FavoritesViewModel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.favoriteList = bookmarks_1.favoriteList;
        _this.filteredFavoriteList = bookmarks_1.filteredFavoriteList;
        _this.showFilteredResults = false;
        return _this;
    }
    return FavoritesViewModel;
}(observable_1.Observable));
exports.FavoritesViewModel = FavoritesViewModel;
exports.viewModel = new FavoritesViewModel();
var listView;
var editing = false;
function onLoaded(args) {
    listView = args.object;
    listView.bindingContext = exports.viewModel;
}
exports.onLoaded = onLoaded;
function onTap(args) {
    clearTimeout(tapTimerId);
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
    var i = bookmarks_1.favoriteList.indexOf(item);
    bookmarks_1.favoriteList.splice(i, 1);
}
exports.onDelete = onDelete;
var swipeLimit = -64;
var openCells = [];
var tapTimeout = 300;
var tapTimerId = -1;
function onItemLoaded(args) {
    var itemView = args.object;
    var contentView = itemView.getViewById('content');
    var deleteView = itemView.getViewById('delete');
    var cell = { contentView: contentView, deleteView: deleteView };
    var panStart = 0;
    contentView.on(gestures_1.GestureTypes.pan, function (data) {
        if (data.state === gestures_1.GestureStateTypes.began) {
            if (application.android) {
                closeAllCells(cell);
                editing = false;
                tapTimerId = setTimeout(function () {
                    panStart = contentView.translateX + data.deltaX;
                    editing = true;
                }, tapTimeout);
            }
            else {
                panStart = contentView.translateX;
                closeAllCells(cell);
                editing = true;
            }
        }
        else {
            // wait for tap timeout before handling this gesture (only on android)
            if (!editing)
                return;
        }
        contentView.translateX = Math.min(Math.max(panStart + data.deltaX, -1000), 0);
        if (data.state === gestures_1.GestureStateTypes.ended) {
            clearTimeout(tapTimerId);
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
bookmarks_1.filterControl.on('propertyChange', function (evt) {
    exports.viewModel.set('showFilteredResults', bookmarks_1.filterControl.showFilteredResults);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmF2b3JpdGVzVmlldy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkZhdm9yaXRlc1ZpZXcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5Q0FBMkM7QUFDM0MsOENBQStEO0FBRy9ELGlEQUFtRztBQUNuRyx1REFBbUQ7QUFFbkQsd0NBSXFCO0FBRXJCLGtDQUF1QztBQUV2QztJQUF3QyxzQ0FBVTtJQUFsRDtRQUFBLHFFQUlDO1FBSEcsa0JBQVksR0FBRyx3QkFBWSxDQUFDO1FBQzVCLDBCQUFvQixHQUFHLGdDQUFvQixDQUFDO1FBQzVDLHlCQUFtQixHQUFHLEtBQUssQ0FBQzs7SUFDaEMsQ0FBQztJQUFELHlCQUFDO0FBQUQsQ0FBQyxBQUpELENBQXdDLHVCQUFVLEdBSWpEO0FBSlksZ0RBQWtCO0FBS2xCLFFBQUEsU0FBUyxHQUFHLElBQUksa0JBQWtCLEVBQUUsQ0FBQztBQUVsRCxJQUFJLFFBQWlCLENBQUM7QUFDdEIsSUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDO0FBRXBCLGtCQUF5QixJQUFJO0lBQ3pCLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3ZCLFFBQVEsQ0FBQyxjQUFjLEdBQUcsaUJBQVMsQ0FBQztBQUN4QyxDQUFDO0FBSEQsNEJBR0M7QUFFRCxlQUFzQixJQUFJO0lBQ3RCLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN6QixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUM7UUFBQyxNQUFNLENBQUE7SUFDbkIsYUFBYSxFQUFFLENBQUM7SUFDaEIsSUFBSSxJQUFJLEdBQWlCLElBQUksQ0FBQyxNQUFlLENBQUMsY0FBYyxDQUFDO0lBQzdELDJCQUFZLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNuQyxDQUFDO0FBTkQsc0JBTUM7QUFFRCxrQkFBeUIsSUFBSTtJQUN6QixhQUFhLEVBQUUsQ0FBQztJQUNoQixJQUFJLElBQUksR0FBaUIsSUFBSSxDQUFDLE1BQWUs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Q0FBQyxDQUFBO0lBQ0YsU0FBUyxHQUFHLFVBQVUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMvQyxDQUFDO0FBRUQsOEJBQThCLElBQWMsRUFBRSxJQUFZO0lBQ3RELElBQU0sZUFBZSxHQUFHLElBQUksR0FBRyxVQUFVLEdBQUcsQ0FBQyxDQUFBO0lBQzdDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDO1FBQ3JCLFNBQVMsRUFBQyxFQUFDLENBQUMsRUFBQyxlQUFlLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBQztRQUNsQyxLQUFLLEVBQUUsc0JBQWMsQ0FBQyxTQUFTO0tBQ2xDLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDSixJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsR0FBRyxlQUFlLENBQUM7UUFDOUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7SUFDdkQsQ0FBQyxDQUFDLENBQUM7SUFDSCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ1AsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN6QixDQUFDO0FBQ0wsQ0FBQztBQUVELHlCQUFhLENBQUMsRUFBRSxDQUFDLGdCQUFnQixFQUFFLFVBQUMsR0FBc0I7SUFDdEQsaUJBQVMsQ0FBQyxHQUFHLENBQUMscUJBQXFCLEVBQUUseUJBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQzVFLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgYXBwbGljYXRpb24gZnJvbSAnYXBwbGljYXRpb24nO1xuaW1wb3J0IHtPYnNlcnZhYmxlLCBQcm9wZXJ0eUNoYW5nZURhdGF9IGZyb20gJ2RhdGEvb2JzZXJ2YWJsZSc7XG5pbXBvcnQge1ZpZXd9IGZyb20gJ3VpL2NvcmUvdmlldyc7XG5pbXBvcnQge0xpc3RWaWV3fSBmcm9tICd1aS9saXN0LXZpZXcnO1xuaW1wb3J0IHtCb29rbWFya0l0ZW0sIGZhdm9yaXRlTGlzdCwgZmlsdGVyQ29udHJvbCwgZmlsdGVyZWRGYXZvcml0ZUxpc3R9IGZyb20gJy4uL2NvbW1vbi9ib29rbWFya3MnXG5pbXBvcnQge2FwcFZpZXdNb2RlbH0gZnJvbSAnLi4vY29tbW9uL0FwcFZpZXdNb2RlbCdcblxuaW1wb3J0IHtcbiAgR2VzdHVyZVR5cGVzLFxuICBHZXN0dXJlU3RhdGVUeXBlcyxcbiAgUGFuR2VzdHVyZUV2ZW50RGF0YSxcbn0gZnJvbSAndWkvZ2VzdHVyZXMnO1xuXG5pbXBvcnQge0FuaW1hdGlvbkN1cnZlfSBmcm9tICd1aS9lbnVtcydcblxuZXhwb3J0IGNsYXNzIEZhdm9yaXRlc1ZpZXdNb2RlbCBleHRlbmRzIE9ic2VydmFibGUge1xuICAgIGZhdm9yaXRlTGlzdCA9IGZhdm9yaXRlTGlzdDtcbiAgICBmaWx0ZXJlZEZhdm9yaXRlTGlzdCA9IGZpbHRlcmVkRmF2b3JpdGVMaXN0O1xuICAgIHNob3dGaWx0ZXJlZFJlc3VsdHMgPSBmYWxzZTtcbn1cbmV4cG9ydCBjb25zdCB2aWV3TW9kZWwgPSBuZXcgRmF2b3JpdGVzVmlld01vZGVsKCk7XG5cbmxldCBsaXN0VmlldzpMaXN0VmlldztcbmxldCBlZGl0aW5nID0gZmFsc2U7XG5cbmV4cG9ydCBmdW5jdGlvbiBvbkxvYWRlZChhcmdzKSB7XG4gICAgbGlzdFZpZXcgPSBhcmdzLm9iamVjdDtcbiAgICBsaXN0Vmlldy5iaW5kaW5nQ29udGV4dCA9IHZpZXdNb2RlbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG9uVGFwKGFyZ3MpIHtcbiAgICBjbGVhclRpbWVvdXQodGFwVGltZXJJZCk7XG4gICAgaWYgKGVkaXRpbmcpIHJldHVyblxuICAgIGNsb3NlQWxsQ2VsbHMoKTtcbiAgICB2YXIgaXRlbTpCb29rbWFya0l0ZW0gPSAoYXJncy5vYmplY3QgYXMgVmlldykuYmluZGluZ0NvbnRleHQ7XG4gICAgYXBwVmlld01vZGVsLmxvYWRVcmwoaXRlbS51cmkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gb25EZWxldGUoYXJncykge1xuICAgIGNsb3NlQWxsQ2VsbHMoKTtcbiAgICB2YXIgaXRlbTpCb29rbWFya0l0ZW0gPSAoYXJncy5vYmplY3QgYXMgVmlldykuYmluZGluZ0NvbnRleHQ7XG4gICAgdmFyIGkgPSBmYXZvcml0ZUxpc3QuaW5kZXhPZihpdGVtKTtcbiAgICBmYXZvcml0ZUxpc3Quc3BsaWNlKGksIDEpO1xufVxuXG5jb25zdCBzd2lwZUxpbWl0ID0gLTY0O1xuXG5pbnRlcmZhY2UgQ2VsbFZpZXdzIHtcbiAgICBjb250ZW50VmlldzpWaWV3LCBcbiAgICBkZWxldGVWaWV3OlZpZXdcbn1cblxubGV0IG9wZW5DZWxsczpBcnJheTxDZWxsVmlld3M+ID0gW11cblxuY29uc3QgdGFwVGltZW91dCA9IDMwMDtcbnZhciB0YXBUaW1lcklkID0gLTE7XG5cbmV4cG9ydCBmdW5jdGlvbiBvbkl0ZW1Mb2FkZWQoYXJncykge1xuICAgIHZhciBpdGVtVmlldzpWaWV3ID0gYXJncy5vYmplY3Q7XG4gICAgdmFyIGNvbnRlbnRWaWV3ID0gaXRlbVZpZXcuZ2V0Vmlld0J5SWQoJ2NvbnRlbnQnKTtcbiAgICB2YXIgZGVsZXRlVmlldyA9IGl0ZW1WaWV3LmdldFZpZXdCeUlkKCdkZWxldGUnKTtcbiAgICB2YXIgY2VsbCA9IHtjb250ZW50VmlldywgZGVsZXRlVmlld307XG4gICAgXG4gICAgdmFyIHBhblN0YXJ0PTA7XG4gICAgY29udGVudFZpZXcub24oR2VzdHVyZVR5cGVzLnBhbiwgKGRhdGE6UGFuR2VzdHVyZUV2ZW50RGF0YSk9PntcbiAgICAgICAgXG4gICAgICAgIGlmIChkYXRhLnN0YXRlID09PSBHZXN0dXJlU3RhdGVUeXBlcy5iZWdhbikge1xuICAgICAgICAgICAgaWYgKGFwcGxpY2F0aW9uLmFuZHJvaWQpIHtcbiAgICAgICAgICAgICAgICBjbG9zZUFsbENlbGxzKGNlbGwpO1xuICAgICAgICAgICAgICAgIGVkaXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0YXBUaW1lcklkID0gc2V0VGltZW91dCgoKT0+e1xuICAgICAgICAgICAgICAgICAgICBwYW5TdGFydCA9IGNvbnRlbnRWaWV3LnRyYW5zbGF0ZVggKyBkYXRhLmRlbHRhWDtcbiAgICAgICAgICAgICAgICAgICAgZWRpdGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSwgdGFwVGltZW91dCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHBhblN0YXJ0ID0gY29udGVudFZpZXcudHJhbnNsYXRlWDtcbiAgICAgICAgICAgICAgICBjbG9zZUFsbENlbGxzKGNlbGwpO1xuICAgICAgICAgICAgICAgIGVkaXRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gd2FpdCBmb3IgdGFwIHRpbWVvdXQgYmVmb3JlIGhhbmRsaW5nIHRoaXMgZ2VzdHVyZSAob25seSBvbiBhbmRyb2lkKVxuICAgICAgICAgICAgaWYgKCFlZGl0aW5nKSByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGNvbnRlbnRWaWV3LnRyYW5zbGF0ZVggPSBNYXRoLm1pbihNYXRoLm1heChwYW5TdGFydCArIGRhdGEuZGVsdGFYLCAtMTAwMCksIDApO1xuICAgICAgICBcbiAgICAgICAgaWYgKGRhdGEuc3RhdGUgPT09IEdlc3R1cmVTdGF0ZVR5cGVzLmVuZGVkKSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGFwVGltZXJJZCk7XG4gICAgICAgICAgICBlZGl0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICB2YXIgb3BlbiA9IGNvbnRlbnRWaWV3LnRyYW5zbGF0ZVggPCBzd2lwZUxpbWl0KjAuNzU7XG4gICAgICAgICAgICB0b2dnbGVDZWxsU3dpcGVTdGF0ZShjZWxsLCBvcGVuKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRlbGV0ZVZpZXcudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcbiAgICAgICAgfVxuICAgICAgICBcbiAgICB9KVxufVxuXG5mdW5jdGlvbiBjbG9zZUFsbENlbGxzKGV4Y2VwdENlbGw/OkNlbGxWaWV3cykge1xuICAgIG9wZW5DZWxscy5mb3JFYWNoKChjZWxsKT0+e1xuICAgICAgICBpZiAoY2VsbCAhPT0gZXhjZXB0Q2VsbCkgdG9nZ2xlQ2VsbFN3aXBlU3RhdGUoY2VsbCwgZmFsc2UpO1xuICAgIH0pXG4gICAgb3BlbkNlbGxzID0gZXhjZXB0Q2VsbCA/IFtleGNlcHRDZWxsXSA6IFtdO1xufVxuXG5mdW5jdGlvbiB0b2dnbGVDZWxsU3dpcGVTdGF0ZShjZWxsOkNlbGxWaWV3cywgb3Blbjpib29sZWFuKSB7XG4gICAgY29uc3QgZmluYWxUcmFuc2xhdGVYID0gb3BlbiA/IHN3aXBlTGltaXQgOiAwXG4gICAgY2VsbC5jb250ZW50Vmlldy5hbmltYXRlKHtcbiAgICAgICAgdHJhbnNsYXRlOnt4OmZpbmFsVHJhbnNsYXRlWCwgeTowfSxcbiAgICAgICAgY3VydmU6IEFuaW1hdGlvbkN1cnZlLmVhc2VJbk91dFxuICAgIH0pLnRoZW4oKCk9PntcbiAgICAgICAgY2VsbC5jb250ZW50Vmlldy50cmFuc2xhdGVYID0gZmluYWxUcmFuc2xhdGVYO1xuICAgICAgICBpZiAoIW9wZW4pIGNlbGwuZGVsZXRlVmlldy52aXNpYmlsaXR5ID0gJ2NvbGxhcHNlJztcbiAgICB9KTtcbiAgICBpZiAob3Blbikge1xuICAgICAgICBvcGVuQ2VsbHMucHVzaChjZWxsKTtcbiAgICB9XG59XG5cbmZpbHRlckNvbnRyb2wub24oJ3Byb3BlcnR5Q2hhbmdlJywgKGV2dDpQcm9wZXJ0eUNoYW5nZURhdGEpID0+IHtcbiAgICB2aWV3TW9kZWwuc2V0KCdzaG93RmlsdGVyZWRSZXN1bHRzJywgZmlsdGVyQ29udHJvbC5zaG93RmlsdGVyZWRSZXN1bHRzKTtcbn0pOyJdfQ==