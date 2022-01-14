## visual-editor

* draggable zone
* droppable zone

### Tutorial

* [Drag operation](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations)
* [specify drop target](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations#specifying_drop_targets)

### Reference Resource

* [vue-drag-resize](https://github.com/kirillmurashov/vue-drag-resize)

### guide line

* collect all unfocus blocks info
* take advantage of above info generate x,y array coordination
* use current drag block's left,top to match against x,y array and find item which distance less than 5px
* employ x,y set guide line's left,top

### Thinking

* Should I use Vuex to implement state manage ?
  * Yes, can use getter to generate reactive global variable

### Article

* How to complete a drag and drop operation ?

### Feature

* drag and drop
* move one block or multiple blocks
* help lines
* sticky to help lines(when mouseup event fired)
