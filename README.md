django-list-wrestler
=======================

Make django admin lists easier to sort and collapse.

This plugin turns an ordinary order field into a high-powered sorting and collapsing tool including:

Add sorting functionality to both change list views and inline list views, including:
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


Requirements
=====
Requires Django

Usage
=====
1. pip install django-list-wrestler
2. Add 'django_list_wrestler' to your INSTALLED_APPS list in your project's settings.py
3. Customize your admin definition following the examples below:

* Inline Sorting Example *

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


* Change List Sorting Example *

Sorting in change list view:
...TODO... add screenshot

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





* Collapsing Tree Change List Example *

...TODO... add screenshot

```python
from django_list_wrestler.admin import AdminListCollapsible

from .models import *

class ObjectAdmin(AdminListCollapsible):
	"""
	To bring collapsing tree functionality to a changelist view:
	"""
	model = Object
	fields = ('priority', 'title')
	list_editable = ('priority',)

    custom_list_order_by = 'priority'

	inlines = [ItemInline, SubItemInline]

```