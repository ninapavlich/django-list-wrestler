django.jQuery(document).ready(function() {
    //Initialize Form:
    //Go through list in the form, and if not already initialized, initialize it.

   
    

    

    //Destroy:
    //Go through each list and destroy it

    //Destroy List:
    //Go through each form item and destroy it

    //Destroy Item:
    //Remove button listeners
    //Remove buttons
    //Make position field editable

    
    $ = django.jQuery
    $.orderable_admin_list = function(element, id, options) {
        


        this.id = id;
        this.options = {};
        this.options = $.extend({}, $.orderable_admin_list.defaultOptions, options); 

        this._container = element;
        this._listContainer = null;
        this._listContainerHeader = null;
        this._listContainerHeaderHeight = null;
        this.list_item_hash = {};
        this.list_items = [];
        
        //CONFIG:
        this.on_item_change_callback = this.options.onItemChangePosition;


        //RUNTIME
        this.request_update_timeout;
        this.request_update_timeout_duration = 1;

        this.realign_interval;
        this.realign_interval_duration = 100;

        this.drag_offset_x = 0;
        this.drag_offset_y = 0;

        this.list_item_rows = [];
        
        

        /////////////////////////////////
        //PUBLIC FUNCTIONS //////////////
        /////////////////////////////////
        this.getVersion = function(){
            return '2.0';
        }
        
        this.moveToTop = function(item){
            //console.log("moveToTop")
            item.setPosition(-1);

            this.updateList();
        }
        this.moveToBottom = function(item){
            //console.log("moveToBottom")
            item.setPosition(this.list_items.length);

           this.updateList();
        }
        this.moveUp = function(item){
            
            previous_index = Math.max(0, item.getPosition()-1);
            current_index = item.getPosition();
            //console.log("move item from "+item.getPosition()+" to "+previous_index)
            previous_item = this.list_items[previous_index];
            previous_item.setPosition(current_index);
            item.setPosition(previous_index);

           

            this.updateList();
            
        }
        this.moveDown = function(item){
            //console.log("moveDown")
            next_index = Math.min(this.list_items.length-1, item.getPosition()+1);
            current_index = item.getPosition();

            //console.log("move item from "+item.getPosition()+" to "+next_index)

            next_item = this.list_items[next_index];
            next_item.setPosition(current_index);
            item.setPosition(next_index);

     

            this.updateList();
        }
        this.moveTo = function(item, index){
            
            if (index == item.getPosition()){
                //console.log("same index. ignore.")
                return;
            }
            var moving_down = index - item.getPosition() > 0;
            var offset_index = moving_down? 0.5 : -0.5;

            half_index = index + offset_index;        
            //console.log("moveTo: "+index+" moving_down? "+moving_down+" half_index? "+half_index)    
            item.setPosition(half_index)

            this.updateList();
        }
        this.startDrag = function(item, e){
            this._pauseInterval();
            this.drag_offset_y = e.pageY - $(item._buttonContainer).offset().top;
            this.drag_offset_x = e.pageX - $(item._buttonContainer).offset().left;
            this.moveDrag(item, e)
            
        }
        this.moveDrag = function(item, e){
            var mousex = e.pageX;
            var mousey = e.pageY;
            var header_position = $(this._listContainerHeader).offset()
            var relative_mouse_y = mousey - header_position.top;
            var relative_mouse_x = mousex - header_position.left;
            
            item.setTopPosition(relative_mouse_y - this.drag_offset_y, 0);
            item.setLeftPosition(relative_mouse_x - this.drag_offset_x, 0);  
            this._sortItemsByTop(item);     
        }
        this.stopDrag = function(item, e){
            //item.x = 0
            item.setLeftPosition(0, 0);
            this._sortItemsByTop(item, true); 
            this._pauseInterval(500);
        }
        this.updateList = function(){
            this._pauseInterval(500);
            this._checkDeleted();
            this._sortItems();
            this._realignItems();

        }
        this.deleteItem = function(item){
            
            item.destroy()

            delete this.list_item_hash[item.id];

            var index = this.list_items.indexOf(item)
            if(index != -1){
                this.list_items.splice(index, 1)
            }else{
                //weird
            }

            this.updateList();
        }

        /////////////////////////////////
        //PRIVATE FUNCTIONS /////////////
        /////////////////////////////////

        //LISTS//
        this._initList = function(element, options) {  
            //Initialize List:
            //Go through each item in the list. 
            //If it has a position sort by it. If it doesn't have a position, then auto-assign a position
            //If item is not initialized, then initialize it
      
            this._initListStyles(element);
            this._initListEvents(element);
            
            

            var list_items = $(element).find('.grp-tbody').not(".grp-empty-form")
            //console.log("Found "+list_items.length+" list items in list "+this.id)


            for( var k=0; k < list_items.length; k++ ){
                var list_item = list_items[k];
                


                is_initialized = $(list_item).hasClass( 'list-item-initialized' )
                
                if(is_initialized){
                    //carry on
                    
                }else{
                    
                    var new_id = this.id+"_"+(this.list_items.length);
                    var component = new $.orderable_admin_list_item(list_item, new_id, this, options); 
                    
                    $(list_item).addClass( 'list-item-initialized' );  
                    $(list_item).addClass( new_id );

                    this.list_item_hash[new_id] = component;
                    this.list_items.push(component);
                }

            }


            this._sortItems();
            this._realignItems(0);

            
            
            this._startResizeInterval();

        };
        this._pauseInterval = function(restart_time){
            clearInterval(this.realign_interval)
            var parent_reference = this;
            if(typeof restart_time == "undefined"){
                //stay paused
            }else{
                setTimeout(function(){
                    parent_reference._startResizeInterval()
                }, restart_time)
            }
        }
        this._startResizeInterval = function(){
            var parent_reference = this;
            clearInterval(this.realign_interval)   
            this.realign_interval = setInterval(function(){
                parent_reference._realignItems(0);
            }, this.realign_interval_duration)
        }
        this._initListStyles = function(container){
            this._listContainer = $(this._container).find(".grp-module.grp-table")
            this._listContainerHeader = $(this._listContainer).find(".grp-thead")
            this._listContainerHeaderHeight = $(this._listContainerHeader).height()
        };
        this._initListEvents = function(container) {
            var parent_reference = this
            $(container).find(".grp-add-handler").bind("click", function(e){

                setTimeout(function(){
                    parent_reference._initList(parent_reference._container, parent_reference.options);                    
                },100)
                
            })
            $(container).find(".grp-delete-handler").bind("click", function(e){
                setTimeout(function(){
                    parent_reference.updateList()
                },500)
            })
            $(container).find(".grp-remove-handler").bind("click", function(e){
                setTimeout(function(){
                    parent_reference._checkForRemovedItems()
                },500)
            })
            
        };
        this._checkDeleted = function(){
            for(var k=0; k<this.list_items.length; k++){
                var list_item = this.list_items[k];
                list_item.checkDeleted();
            }
        }
        this._sortItems = function(){
            
            //first go through and sort items by order
            this.list_items.sort(function(a,b){
                var apos = a.getPosition()
                var bpos = b.getPosition()

                var aIsEmpty = apos === null || a.isEmpty();
                var bIsEmpty = bpos === null || b.isEmpty();

                var aIsDeleted = a.isDeleted()
                var bIsDeleted = b.isDeleted()

                //console.log("apos: "+apos+" bpos: "+bpos+' aIsEmpty: '+aIsEmpty+" bIsEmpty: "+bIsEmpty+" aIsDeleted: "+aIsDeleted+" bIsDeleted: "+bIsDeleted)

                if(apos == bpos) return 0;

                //If empty or deleted, element is always after

                if(aIsEmpty && !bIsEmpty ) return 1;
                if(bIsEmpty && !aIsEmpty ) return -1;

                if(aIsDeleted && !bIsDeleted ) return 1;
                if(bIsDeleted && !aIsDeleted ) return -1;

                if(apos >= bpos) return 1;
                return -1;
            });
                

            //then go through and "repair" any gaps or problems
            counter = 0
            for(var k=0; k<this.list_items.length; k++){
                var list_item = this.list_items[k];
                list_item.setPosition(counter++);                                    
            }            
        }
        this._sortItemsByTop = function(item, apply_update){
            if(typeof apply_update == "undefined"){
                apply_update = false;
            }
            
            //first go through and sort items by order
            this.list_items.sort(function(a,b){

                var apos = a.getTopPosition() + (0.5*a.getHeight())
                var bpos = b.getTopPosition() + (0.5*b.getHeight())
                //console.log("a: "+a.getPosition()+" apos: "+apos+" b: "+b.getPosition()+" bpos: "+bpos)

                //console.log("apos: "+apos+" bpos: "+bpos+' aIsEmpty: '+aIsEmpty+" bIsEmpty: "+bIsEmpty+" aIsDeleted: "+aIsDeleted+" bIsDeleted: "+bIsDeleted)

                if(apos == bpos) return 0;
                if(apos >= bpos) return 1;
                return -1;
            });
          

            //then go through and "repair" any gaps or problems
            var counter = 0;
            var list_item;
            for(var k=0; k<this.list_items.length; k++){
                list_item = this.list_items[k];
                if(apply_update){
                    list_item.setPosition(counter++);
                }else{
                    list_item.setPositionWhileDragging(counter++);       
                }
            }          

            //Realign:
            var runningY = this._listContainerHeaderHeight;
            for(var k=0; k<this.list_items.length; k++){
                list_item = this.list_items[k];
                if(apply_update || list_item != item){
                    list_item.setTopPosition(runningY, 100)
                }
                runningY += list_item.getHeight()
            }
            $(this._listContainer).height(runningY)

        }
        this._realignItems = function(duration){
            if(typeof duration == "undefined"){
                duration = 400;
            }

            var runningY = this._listContainerHeaderHeight;

            for(var k=0; k<this.list_items.length; k++){
                var list_item = this.list_items[k];
                list_item.setTopPosition(runningY, duration)
                runningY += list_item.getHeight()
            }

            $(this._listContainer).height(runningY)

        }
        this._checkForRemovedItems = function(){
            for(var k=0; k<this.list_items.length; k++){
                var list_item = this.list_items[k];
                var list_item_id = list_item.id;
                var items = $(document).find("."+list_item_id)
                var deleted = items.length == 0;
                if(deleted){
                    this.deleteItem(list_item)
                }                
            }
        }

        
        this._initList(element, options);
    };


    $.orderable_admin_list_item = function(element, id, parent_list, options) {
        
        this.id = id;
        this.parent_list = parent_list;
        this.options = $.extend({}, options); 




        //RUNTIME
        this.request_update_timeout;
        this.request_update_timeout_duration = 10;
       
        this._hasValue = false;
        this._originalPosition = null;
        this._position = null;
        this._previousPosition = null;
        this._container = element;
        this._positionContainer = null;    
        this._inputContainer = null;
        this._buttonContainer = null;
        this._originalPositionContainer = null;
        this._inputChangeContainer = null;
        this._isDeleted = false;

        this._beforeWidth = "auto"

        /////////////////////////////////
        //PUBLIC FUNCTIONS //////////////
        /////////////////////////////////
        this.setPosition = function(value){
            this._previousPosition = this._position;
            this._position = value;
            this._requestUpdate();
            $(this._inputChangeContainer).val(this._position+1);
            //console.log("setPosition = "+value+" original = "+this._originalPosition)
        }
        this.getPosition = function(){
            return this._position;
        }
        this.setPositionWhileDragging = function(value){
            //console.log(this.getPosition()+" -> "+value)
            $(this._inputChangeContainer).val(value+1);
        }

        this.setTopPosition = function (top_position, duration){
            if(typeof duration == "undefined"){
                duration = 200;
            }
        
            if(duration == 0){
                $(this._container).css("top", top_position);
            }else{
                $(this._container).stop().animate({top: top_position}, duration);   
            }            
        }
        this.getTopPosition = function(){
            return parseInt($(this._container).css("top"), 10);
        }
        this.setLeftPosition = function (left_position, duration){
            if(typeof duration == "undefined"){
                duration = 400;
            }
        
            if(duration == 0){
                $(this._container).css("left", left_position);
            }else{
                $(this._container).stop().animate({left: left_position}, duration);
            }            
        }
        this.getLeftPosition = function(){
            return parseInt($(this._container).css("left"), 10);            
        }
        this.getHeight = function(){
            return $(this._container).outerHeight();
        }
        this.checkDeleted = function(){
            this._isDeleted = $(this._container).hasClass( 'grp-predelete' )
            var raw_classes = $(this._container).attr('class')
            //console.log("is Deleted? "+this._isDeleted+" classes? "+raw_classes)
        }
        this.isDeleted = function(){
            return this._isDeleted
        }
        this.isEmpty = function(){
            return this._hasValue == false;
        }
        this.destroy = function(){
            //Remove Styles
            this._removeStyles();
            this._removeListItemEvents();
            this._removeContent();
        }
        

        /////////////////////////////////
        //PRIVATE FUNCTIONS /////////////
        /////////////////////////////////

        
        //LIST ITEMS//
        this._initListItem = function(item, options) {  
            //Initialize Item:
            //Make form field readonly
            //Add form item buttons      

            
            this._originalPositionContainer = null;
            this._inputChangeContainer = null;
            
            this._initContent(item);

            this._initStyles();            

            
            this._initListItemEvents();            

        };
        this._initStyles = function(){
            this._beforeWidth = $(this._inputContainer).css("width")

            $(this._inputContainer).addClass("grp-readonly");
            $(this._inputContainer).css("width", "95px");   
            $(this._inputContainer).attr("readonly", "readonly");   
            $(this._container).css("position", "absolute")     

        }
        this._removeStyles = function(){
            $(this._inputContainer).removeClass("grp-readonly");
            $(this._inputContainer).css("width", this._beforeWidth);   
            $(this._inputContainer).attr("readonly", "");   
            $(this._container).css("position", "static")     

        }
        this._initContent = function(item){
            this._positionContainer = $(item).find(".grp-td."+this.options['order_by']);
            this._inputContainer = $(this._positionContainer).find('input:text')[0];

            //ADD BUTTONS
            $(this._positionContainer).prepend(this._createButtons());
            this._buttonContainer = $(this._positionContainer).find('.ordering-buttons');
            this._originalPositionContainer = $(this._buttonContainer).find('input.original_value')[0];
            this._inputChangeContainer = $(this._buttonContainer).find('input.new_value')[0];


            //PARSE INITIAL VALUE:
            this._originalHasValue = this._hasValue = $(this._inputContainer).val() != "";
            this._position = isNumber($(this._inputContainer).val())? parseInt($(this._inputContainer).val()) : 0;
            
            this._originalPosition = this._position;
            $(this._originalPositionContainer).val(this._originalPosition)
            $(this._inputChangeContainer).val(this._originalPosition)
        }
        this._removeContent = function(){
            $(this._buttonContainer).remove();
        }
        this._initListItemEvents = function() {
            var parent_reference = this;


            $(this._buttonContainer).find("input.drag").bind("mousedown", function(e){
                if(e.which == 1){
                    //left clicked
                    e.preventDefault();
                    parent_reference.parent_list.startDrag(parent_reference, e);

                    $('body').bind("mousemove", function(e){
                        parent_reference.parent_list.moveDrag(parent_reference, e);
                    });

                    $('body').bind("mouseup", function(e){
                        $('body').unbind("mousemove");
                        $('body').unbind("mouseup");
                        parent_reference.parent_list.stopDrag(parent_reference, e);
                    });
                }
            });

            $(this._buttonContainer).find("input.move_top").bind("click", function(e){
                e.preventDefault();
                parent_reference.parent_list.moveToTop(parent_reference);
            });
            $(this._buttonContainer).find("input.move_up").bind("click", function(e){
                e.preventDefault();
                parent_reference.parent_list.moveUp(parent_reference);
            });
            $(this._buttonContainer).find("input.move_down").bind("click", function(e){
                e.preventDefault();
                parent_reference.parent_list.moveDown(parent_reference);
            });
            $(this._buttonContainer).find("input.move_bottom").bind("click", function(e){
                e.preventDefault();
                parent_reference.parent_list.moveToBottom(parent_reference);
            });

            $(this._buttonContainer).find("input.apply_new_value").bind("click", function(e){
                e.preventDefault();
                parent_reference._applyInputValue();                
            });

            $(this._buttonContainer).find("input.new_value").bind("keyup", function(e) {
                if (e.keyCode == 10 || e.keyCode == 13) {
                    e.preventDefault();
                    parent_reference._applyInputValue();
                }
            });
            $(this._buttonContainer).find("input.new_value").bind("keydown", function(e) {
                if (e.keyCode == 10 || e.keyCode == 13) {
                    //Block enter key on new value input
                    e.preventDefault();                    
                }
            }); 
        };
        this._applyInputValue = function(){
            var input_value = $(this._inputChangeContainer).val();
            var is_number = isNumber(input_value);
            var new_value = parseInt(input_value);
            if(is_number){
                this.parent_list.moveTo(this, new_value-1);
            }else{
                this.parent_list._sortItems();
            }
        }
        this._removeListItemEvents = function(){
            var parent_reference = this
            $(this._buttonContainer).find("input.move_top").unbind("click");
            $(this._buttonContainer).find("input.move_up").unbind("click");
            $(this._buttonContainer).find("input.move_down").unbind("click");
            $(this._buttonContainer).find("input.move_bottom").unbind("click");
            $(this._buttonContainer).find("input.apply_new_value").unbind("click");
            $(this._buttonContainer).find("input.new_value").unbind("keyup");
            $(this._buttonContainer).find("input.new_value").unbind("keydown");
        }

        
       
        this._requestUpdate = function(immediate){
            //debounce multiple update requests
            if(typeof immediate == "undefined"){
                immediate = false
            }
            
            clearTimeout(this.request_update_timeout);

            if(immediate == false){
                var parent_reference = this;
                this.request_update_timeout = setTimeout(function(){
                    parent_reference._update();
                }, this.request_update_timeout_duration)
            }else{
                this._update(immediate);
            }
            
        }
        
        this._update = function(duration){
            //Update value of position in box     
            if(this._isDeleted){
                $(this._inputContainer).val("")   
                $(this._buttonContainer).hide(); 
            }else{
                $(this._inputContainer).val(this._position+1)
                $(this._buttonContainer).show();
            }

            //Update buttons:
            var list_length = this.parent_list.list_items.length;
            
            if(this._position <= 0){
                $(this._buttonContainer).find("input.move_top").addClass("disabled");
                $(this._buttonContainer).find("input.move_up").addClass("disabled");
            }else{
                $(this._buttonContainer).find("input.move_top").removeClass("disabled");
                $(this._buttonContainer).find("input.move_up").removeClass("disabled");
            }

            if(this._position >= list_length-1 ){
                $(this._buttonContainer).find("input.move_down").addClass("disabled");
                $(this._buttonContainer).find("input.move_bottom").addClass("disabled"); 
            }else{
                $(this._buttonContainer).find("input.move_down").removeClass("disabled");
                $(this._buttonContainer).find("input.move_bottom").removeClass("disabled"); 
            }

            if(list_length <= 1){
                $(this._buttonContainer).find("input.drag").addClass("disabled");
                $(this._buttonContainer).find("input.apply_new_value").addClass("disabled");
            }else{
                $(this._buttonContainer).find("input.drag").removeClass("disabled");
                $(this._buttonContainer).find("input.apply_new_value").removeClass("disabled");
            }
            
            
            
        }
        this._createButtons = function(){
            return '<div class="ordering-buttons">\
                <div class="drag-container">\
                    <input type="button" title="Drag element" class="drag" value="Drag">\
                </div>\
                <div class="move-container">\
                    <input type="button" title="Move to top" class="move_top" value="To Top">\
                    <input type="button" title="Move up" class="move_up" value="Move Up">\
                    <input type="button" title="Move down" class="move_down" value="Move Down">\
                    <input type="button" title="Move to bottom" class="move_bottom" value="To Bottom">\
                </div>\
                <div class="jump-container">\
                    <input type="text" class="new_value" name="New Value" value="">\
                    <input type="button" title="Move to this position" class="apply_new_value" value="Move to this position">\
                </div>\
                <input type="text" class="readonly original_value" name="Original Value" value="" readonly="readonly">\
                \
            </div>'
        }

        this._initListItem(element, options);
    };
    


    /* INITIALIZATION */
    $.init_orderable_admin_lists = function(config) { //Using only one method off of $.fn  
        
        app_name = "django-orderable-inline";
        all_elements = $(document).find("."+app_name);
        //console.log("FOUND "+all_elements.length+" items with class name: "+app_name)
        //for each element, check to see if it has been initialized


        for(var i=0; i<all_elements.length; i++){

            var element = all_elements[i];
            is_initialized = $(element).hasClass( app_name+'-initialized' )
            
            if(is_initialized){
                //carry on
            }else{

                var new_id = app_name+"_id_"+($.orderable_admin_list.registered_elements.length);
                //console.log(element+" "+new_id+" "+config+" classes "+$(element).attr('class'))

                var order_by_value = config['order_by']
                var class_names = $(element).attr('class').split(' ');
                for(index in class_names){
                    class_name = class_names[index]
                    if(class_name.indexOf("order-by-")>=0){
                        order_by_value = class_name.split("order-by-")[1]
                        config['order_by'] = order_by_value;
                    }
                }
                
                var component = new $.orderable_admin_list(element, new_id, config); 

                
                $(element).addClass( app_name+'-initialized' );  
                $(element).addClass( new_id );

                $.orderable_admin_list.registered_hash[new_id] = component;
                $.orderable_admin_list.registered_elements.push(component);
            }
        }

    };
    
    $.orderable_admin_list.defaultOptions = {
        onItemChangePosition : function(){}
    };
    $.orderable_admin_list.registered_hash = {}
    $.orderable_admin_list.registered_elements = []
    
    $.init_orderable_admin_lists({
        'order_by' : 'order'

    });
    
});

/* IF INDEX OF NOT AVAILABLE, ADD TO ARRAY DEFINITION*/
if (!Array.prototype.indexOf)
{
  Array.prototype.indexOf = function(elt /*, from*/)
  {
    var len = this.length >>> 0;

    var from = Number(arguments[1]) || 0;
    from = (from < 0)
         ? Math.ceil(from)
         : Math.floor(from);
    if (from < 0)
      from += len;

    for (; from < len; from++)
    {
      if (from in this &&
          this[from] === elt)
        return from;
    }
    return -1;
  };
}
function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}