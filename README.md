django-list-wrestler
=======================

Make django admin lists easier to sort and collapse.

This plugin turns an ordinary order field into a high-powered sorting and collapsing tool including:

Add sorting functionality to both change list views and inline list views, including:

![Screenshot of changelist with drag controls](/../master/docs/screenshots/changelist_drag.png?raw=true "Screenshot of changelist with drag controls")

* Drag-and-Drop re-ordering
* Jump to Top and Jump to Bottom buttons
* Jump one up and Jump one bottom
* Send directly to a position in the list
* Sort by a custom field

For inline lists:
* Adjust table headers so they line up with the actual columns
* Make table headers sortable, so you can sort by a particular field (supports sorting by text inputs, text areas, check boxes, image uploads, and fks)
* Positioning order buttons anywhere in the table

For change lists:
* Add collapsing functionality to a changelist view to mimic the functionality of a tree folder structure.

![Screenshot of changelist with tree widget enabled and open](/../master/docs/screenshots/path_collapse_open.png?raw=true "Screenshot of changelist with tree widget enabled and open")


Requirements
=====
Requires Django

Usage
=====
1. pip install django-list-wrestler
2. Add 'django_list_wrestler' to your INSTALLED_APPS list in your project's settings.py
3. Customize your admin definition following the examples below:

### Inline Sorting Example

Inline list, with all the sorting options turned on:

![Screenshot of Django inline items](/../master/docs/screenshots/screenshot.png?raw=true "Screenshot of Tabular Inline Items")

Inline list, with only simplified control:

![Screenshot of Django inline items](/../master/docs/screenshots/simplified.png?raw=true "Screenshot of simplified Inline Items")

```python
from django_list_wrestler.admin import TabularInlineOrderable, StackedInlineOrderable

from .models import *

class ItemInline(TabularInlineOrderable):
	"""
	To bring drag-and-drop functionality to an inline:
	"""
	model = Item
	fields = ('order', 'name', 'txtid', 'description')
	prepopulated_fields = {'txtid': ('name',)}
	
class SubItemInline(TabularInlineOrderable):
	"""
	To bring drag-and-drop functionality to an inline, sorting on a custom field:
	"""
	model = SubItem
	fields = ('position', 'name', 'txtid')
	prepopulated_fields = {'txtid': ('name',)}
	
	# To override which field is used for ordering, add a class starting with order-by-[fieldname]. Make sure to also include 'django-list-wrestler' in the list:
	classes = ['django-list-wrestler', 'order-by-position']

	# Add any of the following css classes to this list to disable any of the buttons:
	#'inline-wrestler-drag-disabled', 'inline-wrestler-move-disabled', 
	#'inline-wrestler-move-bottom-disabled', 'inline-wrestler-move-top-disabled', 
	#'inline-wrestler-move-up-disabled', 'inline-wrestler-move-down-disabled',
	#'inline-wrestler-jump-disabled'

```


### Change List Sorting Example

Allow sorting within the change list, turning a basic integer field into a drag and drop or push-button sortable widget.

The raw ordering field:

![Screenshot of changelist without sorting](/../master/docs/screenshots/changelist_raw.png?raw=true "Screenshot of changelist without sorting")

With Dragging and Jumping:

![Screenshot of changelist with dragging and jumping](/../master/docs/screenshots/changelist_drag.png?raw=true "Screenshot of changelist with dragging and jumping")

With the whole kitchen sink of controls:

![Screenshot of changelist with all controls](/../master/docs/screenshots/changelist_full.png?raw=true "Screenshot of changelist with all controls")


```python
from django_list_wrestler.admin import AdminListOrderable

from .models import *

class ObjectAdmin(AdminListOrderable):
	"""
	To bring drag-and-drop functionality to a changelist view:
	"""
	model = Object
	fields = ('priority', 'title')
	list_editable = ('priority',)

	# REQUIRED: Set which field is used for ordering:
	custom_list_order_by = 'priority'

	# OPTIONAL: To disable any of the sorting functions:
    custom_list_settings = ['inline-wrestler-drag-disabled']
    #'inline-wrestler-drag-disabled', 'inline-wrestler-move-disabled', 
	#'inline-wrestler-move-bottom-disabled', 'inline-wrestler-move-top-disabled', 
	#'inline-wrestler-move-up-disabled', 'inline-wrestler-move-down-disabled',
	#'inline-wrestler-jump-disabled'

	inlines = [ItemInline, SubItemInline]

	
```



### Collapsing Tree Change List Example

Allow folder-style tree collapsling within the change list, turning a basic uri path (/path/to/item/) into a collapsing tree widget.

The raw hierarchical path field in the changelist:
![Screenshot of a raw path field](/../master/docs/screenshots/path_raw.png?raw=true "Screenshot of a raw path field")

With tree widget enabled:
![Screenshot of changelist with tree widget enabled and open](/../master/docs/screenshots/path_collapse_open.png?raw=true "Screenshot of changelist with tree widget enabled and open")

![Screenshot of changelist with tree widget enabled and closed](/../master/docs/screenshots/path_collapse_closed.png?raw=true "Screenshot of changelist with tree widget enabled and closed")

```python
import sys

from django_list_wrestler.admin import AdminListCollapsible

from .models import *

class ObjectAdmin(AdminListCollapsible):
	"""
	To bring collapsing tree functionality to a changelist view:

	where path is something like a tree path:
	- /root/
	- /root/child/
	- /root/child/grandchild/

	"""
	model = Object
	
	# Specify which field should be used to determine the hierarchy
	# in this case we're using "path"
	custom_list_order_by = 'path'
	list_display = ('path', 'title')
	
	# Also make sure to include this item in the display links list
	list_display_links = ('path', 'title')


	# It's also helpful to display all or more of the items, 
	# since we are now nesting them:
	list_per_page = sys.maxsize
```


### Grapelli Support

To use a version that is skinned to match grappelli, use the following classes:

* AdminListOrderable -> GRPAdminListOrderable
* TabularInlineOrderable -> GRPTabularInlineOrderable
* StackedInlineOrderable -> GRPStackedInlineOrderable
* AdminListCollapsible -> GRPAdminListCollapsible