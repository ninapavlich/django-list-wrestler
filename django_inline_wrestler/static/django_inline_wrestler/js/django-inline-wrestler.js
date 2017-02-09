//author:nina@cgpartnersllc.com
;django.jQuery(document).ready(function() {

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
        this.is_changelist = $('.grp-change-list').length > 0;
        this.is_stacked = $(element).hasClass('grp-stacked');
        
        //CONFIG:
        this.on_item_change_callback = this.options.onItemChangePosition;


        //RUNTIME
        this.request_update_timeout;
        this.request_update_timeout_duration = 1;

        this.realign_interval;
        this.realign_interval_duration = 500;

        this.drag_offset_x = 0;
        this.drag_offset_y = 0;

        this.list_item_rows = [];
        
        

        /////////////////////////////////
        //PUBLIC FUNCTIONS //////////////
        /////////////////////////////////
        this.getVersion = function(){
            return '5.3';
        }
        
        this.moveToTop = function(item){
            //console.log("moveToTop")
            item.notEmpty();
            item.setPosition(-1);

            this.updateList();
        }
        this.moveToBottom = function(item){
            //console.log("moveToBottom")
            item.notEmpty();
            item.setPosition(this.list_items.length);

           this.updateList();
        }
        this.moveUp = function(item){
            
            item.notEmpty();
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

            item.notEmpty();
            next_index = Math.min(this.list_items.length-1, item.getPosition()+1);
            current_index = item.getPosition();

            //console.log("move item from "+item.getPosition()+" to "+next_index)

            next_item = this.list_items[next_index];
            next_item.setPosition(current_index);
            item.setPosition(next_index);

     

            this.updateList();
        }
        this.moveTo = function(item, index){

            item.notEmpty();
            
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

            item.notEmpty();

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
            
            

            var list_items = $(element).find('.grp-tbody, tr.grp-row, .grp-items > *').not(".grp-empty-form")
            // console.log("Found "+list_items.length+" list items in list "+this.id)


            for( var k=0; k < list_items.length; k++ ){
                var list_item = list_items[k];
                


                is_initialized = $(list_item).hasClass( 'list-item-initialized' )
                
                if(is_initialized){
                    //carry on
                    
                }else{
                    
                    var new_id = this.id+"_"+(this.list_items.length);
                    var component = new $.orderable_admin_list_item(list_item, new_id, this, options); 
                    
                    this.moveToBottom(component);

                    $(list_item).addClass( 'list-item-initialized' );  
                    $(list_item).addClass( new_id );

                    this.list_item_hash[new_id] = component;
                    this.list_items.push(component);
                }

            }


            this._sortItems();
            this._realignItems(0);

            window['list_items'] = this.list_items

            
            
            this._startResizeInterval();

        };
        this._clearEmpties = function(){

            for(var k=0; k<this.list_items.length; k++){
                var list_item = this.list_items[k];
                list_item.notEmpty();
            } 

        }
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
                parent_reference._alignColumns();
            }, this.realign_interval_duration)
        }
        this._initListStyles = function(container){
            this._listContainer = $(this._container).find(".grp-module.grp-table, table, .grp-items");
            this._listContainerHeader = $(this._listContainer).find(".grp-thead, thead, .grp-collapse-handler");
            this._listContainerHeaderHeight = $(this._listContainerHeader).height();
            this._alignColumns();
            this._populateColumnSortLinks();
        };
        this._initListEvents = function(container) {
            if(this.is_changelist==true){
                return;
            }

            var parent_reference = this
            $(container).find(".grp-add-handler").bind("click", function(e){
                setTimeout(function(){
                    parent_reference._initList(parent_reference._container, parent_reference.options);     
                    parent_reference._clearEmpties();
                },100)

                setTimeout(function(){
                    parent_reference._alignColumns();
                },1000);
                
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
        this._sortItemsByProperty = function(property, ascending){
            //console.log("sort items by "+property+" ascending: "+ascending)

            var on = ascending? 1 : -1;
            var off = ascending? -1 : 1;
            //first go through and sort items by order
            this.list_items.sort(function(a,b){
                var apos = a.getProperty(property)
                var bpos = b.getProperty(property)

                var aIsEmpty = apos === null || a.isEmpty();
                var bIsEmpty = bpos === null || b.isEmpty();

                var aIsDeleted = a.isDeleted()
                var bIsDeleted = b.isDeleted()

                //console.log("apos: "+apos+" bpos: "+bpos+' aIsEmpty: '+aIsEmpty+" bIsEmpty: "+bIsEmpty+" aIsDeleted: "+aIsDeleted+" bIsDeleted: "+bIsDeleted)

                if(apos == bpos) return 0;

                //If empty or deleted, element is always after

                if(aIsEmpty && !bIsEmpty ) return on;
                if(bIsEmpty && !aIsEmpty ) return off;

                if(aIsDeleted && !bIsDeleted ) return on;
                if(bIsDeleted && !aIsDeleted ) return off;

                if(apos >= bpos) return on;
                return off;
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
                list_item.setZIndex(100);
            }          
            item.setZIndex(500);

            //Realign:
            this._listContainerHeaderHeight = $(this._listContainerHeader).find('.grp-th, th').height();
            var runningY = this._listContainerHeaderHeight;
            var maxW = 0;
            for(var k=0; k<this.list_items.length; k++){
                list_item = this.list_items[k];
                if(apply_update || list_item != item){
                    list_item.setTopPosition(runningY, 100)
                }
                runningY += list_item.getHeight();
                maxW = Math.max(maxW, list_item.getWidth());
            }
            $(this._listContainer).height(runningY);
            if(this.is_stacked==true){
                $(this._listContainer).width(maxW);    
            }
            

        }
        this._realignItems = function(duration){
            if(typeof duration == "undefined"){
                duration = 400;
            }

            
            this._listContainerHeaderHeight = $(this._listContainerHeader).find('.grp-th, th').height();
            var runningY = this.is_changelist? this._listContainerHeaderHeight : 22;
            var maxW = 0;
            for(var k=0; k<this.list_items.length; k++){
                var list_item = this.list_items[k];
                list_item.setTopPosition(runningY, duration)
                runningY += list_item.getHeight();
                maxW = Math.max(maxW, list_item.getWidth());

                if(this.is_changelist){
                    $(list_item.element).removeClass('grp-row-even');
                    $(list_item.element).removeClass('grp-row-odd');
                    if(k%2==0){
                        $(list_item.element).addClass('grp-row-even');
                    }else{
                        $(list_item.element).addClass('grp-row-odd');
                    }
                }
            }

            $(this._listContainer).height(runningY);
            if(this.is_stacked==true){
                $(this._listContainer).width(maxW);    
            }

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
        this._alignColumns = function(){
            
            
            //var list_items = $(element).find('.grp-tbody').not(".grp-empty-form");
            
            //if there's at least one item, adjust column dimensions
            var has_items = this.list_items.length > 1;
        

            var first_list_item = has_items? this.list_items[0].element : null;
            var first_list_item_columns = has_items? $(first_list_item).find('.grp-td, td') : [];
            var first_list_item_row = has_items? $(first_list_item).find('.grp-tr, tr') : [];
            var header_columns = $(this._listContainerHeader).find('.grp-th, th');

            

            if(this.is_changelist){

                for(var k=0; k<this.list_items.length; k++){
                    var list_item = this.list_items[k];
                    
                    

                    var list_item_columns = $(list_item.element).find('td, th');
                    for(var j=0; j<header_columns.length; j++){
                        var list_item_column = list_item_columns[j];
                        var header_column = header_columns[j];

                        var columnWidth = $(header_column).width();
                        // $(list_item_column).css("width", "100px");
                        $(list_item_column).innerWidth(columnWidth)
                    }
                    
                }

                
            }else{
                for(var k=0; k<header_columns.length; k++){
                    if(has_items){
                        var first_item_column = first_list_item_columns[k];
                        var header_column = header_columns[k];

                        var columnWidth = $(first_item_column).width()-1;
                        if(k==0){
                            columnWidth += 4;
                        }
                        $(header_column).width(columnWidth);
                        $(header_column).css("display", "inline-block");    
                    }else{
                        $(header_column).css("width", "auto");
                        $(header_column).css("display", "table-cell");
                    }
                }

                if(has_items){
                    var rowWidth = $(first_list_item_row).width();
                    $(this._container).width(rowWidth);    
                }else{
                    $(this._container).css("width", "auto");   
                }
            }
            

            
            
            
        },

        this._populateColumnSortLinks = function(){
            if(this.is_changelist==true){
                return;
            }

            var parent_reference = this;

            var list_items = $(element).find(".grp-tbody.grp-empty-form");
            var header_columns = $(this._listContainerHeader).find('.grp-th');
            var empty_columns = $(list_items).find('.grp-td');
            
            for(var k=0; k<header_columns.length; k++){
                var header_column = header_columns[k];
                var empty_column = empty_columns[k];

                var isColumnInited = $(header_column).hasClass( 'sort-inited' );
                if(isColumnInited==false){
                    
                    var columnText = $(header_column).text();
                    var sortProperty = columnText;
                    var classes = $(empty_column).attr('class').split(/\s+/);
                    var isReadOnly = $(empty_column).find(".grp-readonly").length > 0;


                    
                    for(var i=0; i<classes.length; i++){
                        var class_name = classes[i];
                        if(class_name!= '' && class_name.indexOf('grp')<0 && class_name.indexOf('required')<0){
                            sortProperty = class_name;
                        }
                    }
                    var isOrderColumn = sortProperty == this.options['order_by'];

                    if(sortProperty != '' && isReadOnly == false && isOrderColumn == false){
                        var link = '<a href="#'+sortProperty+'">'+columnText+'</a>';
                        $(header_column).html(link);
                    }
                    $(header_column).addClass("sort-inited");

                    $(header_column).find('a').bind("click", function(e){
                        e.preventDefault();
                        var url = e.target.toString();
                        var hash = url.substr(url.indexOf('#')+1);
                        var isAscending = $(this).hasClass( 'sort-asc' );
                        
                        if(isAscending){
                            $(header_columns).find("a").removeClass( 'sort-asc sort-desc' );
                            $(this).addClass( 'sort-desc' );
                            parent_reference._sortItemsByProperty(hash, true);
                        }else{
                            $(header_columns).find("a").removeClass( 'sort-asc sort-desc' );
                            $(this).addClass( 'sort-asc' );
                            parent_reference._sortItemsByProperty(hash, false);
                        }

                    });
                }

            }

        },
        
        
        this._initList(element, options);
    };


    $.orderable_admin_list_item = function(element, id, parent_list, options) {
        
        this.id = id;
        this.parent_list = parent_list;
        this.options = $.extend({}, options); 
        this.element = element;




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
        this.setPosition = function(value, immediate){
            if(typeof immediate == "undefined"){
                immediate = false
            }

            this._previousPosition = this._position;
            this._position = value;
            this._requestUpdate(immediate);
            if(this.isEmpty() == false){
                $(this._inputChangeContainer).val(this._position+1);
                $(this._inputChangeContainer).attr("value", (this._position+1));
            }
            
            // console.log("setPosition = "+value+" original = "+this._originalPosition)
        }
        this.getPosition = function(){
            return this._position;
        }
        this.getProperty = function(property){
            var column = $(this._container).find("."+property);
            
            var isTextField = $(column).find(".vTextField").length > 0;
            var isTextArea = $(column).find("textarea").length > 0;
            var isCheckBox = $(column).find("input[type='checkbox']").length > 0;
            var isImageUpload = $(column).find(".file-upload").length > 0;
            var isSelect = $(column).find("select").length > 0;
            var isFK = $(column).find("grp-autocomplete-wrapper-fk").length > 0;

            //File upload
            if(isImageUpload){
                var linkText = $(column).find("a").text();
                return $(column).find("a").text();
            }

           

            //fk
            if(isFK){
                return $(column).find("input.vTextField").val();
            }

            //m2m

             //textfield
            if(isTextField){
                return $(column).find("input").val();
            }

            //select
            if(isSelect){
                return $(column).find("select option:selected").text();
            }

            //checkbox
            if(isCheckBox){
                return $(column).find("input").is(':checked');
            }

            //checkboxes

            //textarea
            if(isTextArea){
                return $(column).find("textarea").val();
            }

            //last attempt:
            return $(column).find("input").val();
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
        this.setZIndex = function(zindex){
            $(this._container).css("z-index", zindex);       
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
        this.getWidth = function(){
            return $(this._container).outerWidth();
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
        this.notEmpty = function(){
            this._hasValue = true;
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
            console.log("_initListItem("+item+", "+options+")")
            
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
            var positionContainerSelector = ".grp-td."+this.options['order_by']+", td.field-"+this.options['order_by']+", .form-row."+this.options['order_by']+" .field-box."+this.options['order_by']+" .c-2";
            this._positionContainer = $(item).find(positionContainerSelector);
            if(this._positionContainer.length == 0){
                //HACK -- try more general selector only if specific item wasn't found.
                //This happens when an item is alone on its own line.
                this._positionContainer = $(item).find(".form-row."+this.options['order_by']+" .c-2");
            }
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
            $(this._originalPositionContainer).attr('value', this._originalPosition)
            //console.log("_originalPosition: "+this._originalPosition+" this._position: "+this._position+" val: "+$(this._originalPositionContainer).val())

            if(this.isEmpty() == false){
                $(this._inputChangeContainer).attr('value', this._originalPosition)    
            }
            
        }
        this._removeContent = function(){
            $(this._buttonContainer).remove();
        }
        this._initListItemEvents = function() {
            var parent_reference = this;


            $(this._buttonContainer).find(".drag").bind("mousedown", function(e){
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
            $(this._buttonContainer).find(".drag").bind("click", function(e){
                if(e.which == 1){
                    //left clicked
                    e.preventDefault();
                }
            });

            $(this._buttonContainer).find(".move_top").bind("click", function(e){
                e.preventDefault();
                if(e.which == 1){
                    parent_reference.parent_list.moveToTop(parent_reference);
                }
            });
            $(this._buttonContainer).find(".move_up").bind("click", function(e){
                e.preventDefault();
                if(e.which == 1){
                    parent_reference.parent_list.moveUp(parent_reference);
                }
            });
            $(this._buttonContainer).find(".move_down").bind("click", function(e){
                e.preventDefault();
                if(e.which == 1){
                    parent_reference.parent_list.moveDown(parent_reference);
                }
            });
            $(this._buttonContainer).find(".move_bottom").bind("click", function(e){
                e.preventDefault();
                if(e.which == 1){
                    parent_reference.parent_list.moveToBottom(parent_reference);
                }
            });

            $(this._buttonContainer).find(".apply_new_value").bind("mousedown", function(e){
                e.preventDefault();
                if(e.which == 1){
                    parent_reference._applyInputValue();                
                }
            });

            $(this._buttonContainer).find(".new_value").bind("keyup", function(e) {
                if (e.keyCode == 10 || e.keyCode == 13) {
                    e.preventDefault();
                    parent_reference._applyInputValue();
                }
            });
            $(this._buttonContainer).find(".new_value").bind("keydown", function(e) {
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
            $(this._buttonContainer).find(".move_top").unbind("click");
            $(this._buttonContainer).find(".move_up").unbind("click");
            $(this._buttonContainer).find(".move_down").unbind("click");
            $(this._buttonContainer).find(".move_bottom").unbind("click");
            $(this._buttonContainer).find(".apply_new_value").unbind("click");
            $(this._buttonContainer).find(".new_value").unbind("keyup");
            $(this._buttonContainer).find(".new_value").unbind("keydown");
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
                $(this._inputContainer).attr("value", "");
                $(this._buttonContainer).hide(); 
            }else{
                $(this._inputContainer).val(this._position+1);
                $(this._inputContainer).attr("value", (this._position+1));
                $(this._buttonContainer).show();
            }

            //Update buttons:
            var list_length = this.parent_list.list_items.length;
            
            if(this._position <= 0){
                $(this._buttonContainer).find(".move_top").addClass("disabled");
                $(this._buttonContainer).find(".move_up").addClass("disabled");
            }else{
                $(this._buttonContainer).find(".move_top").removeClass("disabled");
                $(this._buttonContainer).find(".move_up").removeClass("disabled");
            }

            if(this._position >= list_length-1 ){
                $(this._buttonContainer).find(".move_down").addClass("disabled");
                $(this._buttonContainer).find(".move_bottom").addClass("disabled"); 
            }else{
                $(this._buttonContainer).find(".move_down").removeClass("disabled");
                $(this._buttonContainer).find(".move_bottom").removeClass("disabled"); 
            }

            if(list_length <= 1){
                $(this._buttonContainer).find(".drag").addClass("disabled");
                $(this._buttonContainer).find(".apply_new_value").addClass("disabled");
            }else{
                $(this._buttonContainer).find(".drag").removeClass("disabled");
                $(this._buttonContainer).find(".apply_new_value").removeClass("disabled");
            }
            
            
            
        }
        this._createButtons = function(){
            // <ul class="grp-tools">
            //     <li><a href="#" class="grp-icon grp-viewsite-link"></a></li>
            //     <li><a href="#" class="grp-icon grp-add-handler"></a></li>
            //     <li><a href="#" class="grp-icon grp-delete-handler"></a></li>
            //     <li><a href="#" class="grp-icon grp-remove-handler"></a></li>
            //     <li><a href="#" class="grp-icon grp-drag-handler"></a></li>
            //     <li><a href="#" class="grp-icon grp-open-handler"></a></li>
            //     <li><a href="#" class="grp-icon grp-close-handler"></a></li>
            // </ul>
            return '<div class="ordering-buttons">\
                <ul class="grp-tools drag-container">\
                    <li class="drag_container"><a href="#" title="Drag element" class="grp-icon grp-drag-handler drag" value="Drag">Drag</a></li>\
                </ul>\
                <ul class="grp-tools move-container">\
                    <li class="move_top_container"><a href="#" title="Move to top" class="grp-icon grp-close-handler move_top" >Move to top</a></li>\
                    <li class="move_up_container"><a href="#" title="Move up" class="grp-icon grp-arrow-up-handler move_up" >Move Up</a></li>\
                    <li class="move_down_container"><a href="#" title="Move down" class="grp-icon grp-arrow-down-handler move_down" >Move Down</a></li>\
                    <li class="move_bottom_container"><a href="#" title="Move to bottom" class="grp-icon grp-open-handler move_bottom" >Move to bottom</a></li>\
                </ul>\
                <ul class="grp-tools jump-container">\
                    <li class="input_container"><input type="text" class="new_value" name="New Value" value="" /></li>\
                    <li class="apply_container"><a href="#" title="Move to this position" class="apply_new_value" value="Move to this position">&gt;</a></li>\
                </ul>\
                <input type="text" class="readonly original_value" name="Original Value" value="" readonly="readonly">\
                \
            </div>'
        }
        
        this._initListItem(element, options);

    };
    


    /* INITIALIZATION */
    $.init_orderable_admin_lists = function(config) { //Using only one method off of $.fn  
        
        app_name = "django-inline-wrestler";
        app_selector = "."+app_name+":not(.inline-related), body.grp-change-list .grp-changelist-results";
        all_elements = $(document).find(app_selector);
        // console.log("FOUND "+all_elements.length+" items with selector: "+app_selector)
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

                if(window['custom_list_order_by']!=undefined){
                    config['order_by'] = window['custom_list_order_by'];
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