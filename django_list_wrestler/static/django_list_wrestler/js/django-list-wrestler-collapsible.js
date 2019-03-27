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
        this._listContainer = null;
        this._listContainerHeader = null;
        this._listContainerAddRow = null;
        this.list_item_hash = {};
        this.list_items = [];
        this.is_changelist = $('#result_list').length > 0;
        this.is_stacked = $(element).hasClass('django-list-wrestler-stacked');
        this.is_grappelli = $(element).hasClass('grappelli-skin');

        console.log("is changelist? "+this.is_changelist+" is stacked? "+this.is_stacked+" is_grappelli? "+this.is_grappelli)
        

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
            
            
            var list_items = this.is_changelist? $(element).find("tbody > tr") : $(element).find(".has_original, [class*='dynamic']");
            console.log("Found "+list_items.length+" list items in list "+this.id)


            // for( var k=0; k < list_items.length; k++ ){
            //     var list_item = list_items[k];
                


            //     is_initialized = $(list_item).hasClass( 'list-item-initialized' )
                
            //     if(is_initialized){
            //         //carry on
                    
            //     }else{
                    
            //         var new_id = this.id+"_"+(this.list_items.length);
            //         var component = new $.collapsible_admin_list_item(list_item, new_id, this, options); 
                    
            //         this.moveToBottom(component, false);

            //         $(list_item).addClass( 'list-item-initialized' );  
            //         $(list_item).addClass( new_id );

            //         this.list_item_hash[new_id] = component;
            //         this.list_items.push(component);
            //     }

            // }

            

            

        };
        
        
        this._initList(element, options);

    };


    


    /* INITIALIZATION */
    $.init_collapsible_admin_lists = function(config) { //Using only one method off of $.fn  
        
        app_name = "django-list-wrestler";

        var changelist_selector = "#result_list";
        var inline_item_selector = "."+app_name+":not(.inline-related)";
        app_selector = changelist_selector+", "+inline_item_selector;
        all_elements = $(document).find(app_selector);
        console.log("FOUND "+all_elements.length+" items with selector: "+app_selector)
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