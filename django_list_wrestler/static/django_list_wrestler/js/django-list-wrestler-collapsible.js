//author:nina@ninalp.com
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
    $.collapsible_admin_list = function(element, id, options) {
        

        this.id = id;
        this.options = {};
        this.options = $.extend({}, $.collapsible_admin_list.defaultOptions, options); 

        this._container = element;
        this.list_items = [];
        this.list_column_items = [];
        this.is_grappelli = $(element).hasClass('grappelli-skin');

        // console.log("is changelist? "+this.is_changelist+" is stacked? "+this.is_stacked+" is_grappelli? "+this.is_grappelli)
        

        this.list_item_rows = [];
        
        

        /////////////////////////////////
        //PUBLIC FUNCTIONS //////////////
        /////////////////////////////////
        this.getVersion = function(){
            return '6.0';
        }
        
        this.closeTree = function(item){
            console.log("closeTree")
            
        }
        this.openTree = function(item, request_update){
            console.log("openTree")
           
        }

        /////////////////////////////////
        //PRIVATE FUNCTIONS /////////////
        /////////////////////////////////

        //LISTS//
        this._initList = function(element, options) {  
            
            this.list_items = $(element).find("tbody > tr");

            // console.log("FOUND "+this.list_items.length+" list items")

            for( var k=0; k < this.list_items.length; k++ ){
                var list_item = this.list_items[k];
                

                var container_selector = "."+this.options['order_by']+", .field-"+this.options['order_by'];
                var container = $(list_item).find(container_selector);
                this.list_column_items.push(container);
                
                is_initialized = $(list_item).hasClass( 'list-item-initialized' )
                
                if(is_initialized){
                    //carry on
                    
                }else{
                    
                    $(container).addClass( 'collapsible' );
                    var path = $(container).text().replace(/^\/|\/$/g, '');
                
                    var path_pieces = path.split("/");
                    var id = path_pieces[path_pieces.length-1]
                    $(container).attr("data-id", id);
                    $(container).attr("data-path", path);
                    
                    var running_path = "";
                    for( var j=0; j < path_pieces.length-1; j++ ){
                        var path_piece = path_pieces[j];
                        running_path += path_piece
                        $(container).addClass("child-of-"+running_path);
                        running_path += "_"
                    }

                    if(path_pieces.length == 1){
                        $(container).addClass("root");
                    }

                    $(container).addClass("indent-"+path_pieces.length);

                    $(container).find("a").text(id);
                    $(container).prepend(this._createButtons());


                    var self = this;
                    $(container).find(".toggle-handler").bind("click", function(e){
                        e.preventDefault();
                        $(this).toggleClass("closed");                        
                        self._renderItems();
                    })

                    $(list_item).addClass( 'list-item-initialized' );

                }

            }


            for( var k=0; k < this.list_column_items.length; k++ ){
                var list_column_item = this.list_column_items[k];
                var item_id = $(list_column_item).attr("data-path");


                
                var children_selector = ".child-of-"+item_id.replace(/\//g, "_");
                var total_children = $(this._container).find(children_selector);
                // console.log("FOUND "+total_children.length+" children of "+item_id+" with selector "+children_selector)
                if(total_children.length == 0){
                    $(list_column_item).addClass("leaf");
                }

            }



            this._renderItems();

        };


        this._renderItems = function(){

            $(this._container).find('.list-item-initialized').removeClass( 'collapsed' );

            for( var k=0; k < this.list_column_items.length; k++ ){
                var list_column_item = this.list_column_items[k];

                var item_id = $(list_column_item).attr("data-path");
                var is_closed = $(list_column_item).find(".toggle-handler").hasClass("closed")
                var is_leaf = $(list_column_item).hasClass("leaf");
                if(!is_leaf){

                    var children_selector = ".child-of-"+item_id.replace(/\//g, "_");
                    var children = $(this._container).find(children_selector);

                    // console.log("is "+item_id+" is_closed? "+is_closed+" how many children? "+children.length)

                    if(is_closed){
                        $(children).parent().addClass("collapsed");
                    }

                }
                


            }

        }



        this._createButtons = function(){
            return '<a href="#" title="Toggle Open" class="icon toggle-handler closed" ><span>Toggle</span></a>'
        }
        
        
        this._initList(element, options);

    };


    


    /* INITIALIZATION */
    $.init_collapsible_admin_lists = function(config) { //Using only one method off of $.fn  
        
        app_name = "django-list-wrestler-collapsible";


        var changelist_selector = "#result_list";
        var inline_item_selector = "."+app_name+":not(.inline-related)";
        app_selector = changelist_selector+", "+inline_item_selector;
        all_elements = $(document).find(app_selector);
        // console.log("FOUND "+all_elements.length+" items with selector: "+app_selector)
        //for each element, check to see if it has been initialized


        for(var i=0; i<all_elements.length; i++){

            var element = all_elements[i];
            is_initialized = $(element).hasClass( app_name+'-initialized' );

            
            if(is_initialized){
                //carry on
            }else{

                var new_id = app_name+"_id_"+($.collapsible_admin_list.registered_elements.length);
                var classes = $(element).attr('class') || "";
                console.log(element+" "+new_id+" "+config+" classes "+classes)


                // Determine which attribute to use for ordering this item:
                if(window['custom_list_order_by']!=undefined){
                    config['order_by'] = window['custom_list_order_by'];
                }

                var order_by_value = config['order_by'];
                var class_names = classes.split(' ');
                for(index in class_names){
                    class_name = class_names[index]
                    if(class_name.indexOf("order-by-")>=0){
                        order_by_value = class_name.split("order-by-")[1];
                        config['order_by'] = order_by_value;
                    }
                }

               

                var component = new $.collapsible_admin_list(element, new_id, config); 

                $(element).addClass( app_name );  
                $(element).addClass( app_name+'-initialized' );  
                $(element).addClass( new_id );
                $.collapsible_admin_list.registered_hash[new_id] = component;
                $.collapsible_admin_list.registered_elements.push(component);
            }
        }

    };
    
    $.collapsible_admin_list.defaultOptions = {
        onItemChangePosition : function(){}
    };
    $.collapsible_admin_list.registered_hash = {}
    $.collapsible_admin_list.registered_elements = []
    
    $.init_collapsible_admin_lists({
        'order_by' : 'path'
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