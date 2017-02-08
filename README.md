django-inline-wrestler
=======================

Make django admin lists easier to sort with jQuery and Grappelli.

This plugin turns an ordinary order field into a high-powered sorting tool including:
* Drag-and-Drop
* Jump to Top and Jump to Bottom buttons
* Jump one up and Jump one bottom
* Send directly to a position in the list
* Sort by a custom field

For inline admin forms:
* Adjust table headers so they line up with the actual columns
* Make table headers sortable, so you can sort by a particular field (supports sorting by text inputs, text areas, check boxes, image uploads, and fks)
* Positioning order buttons anywhere in the table

![Screenshot of Django inline items](/../master/docs/screenshots/screenshot.png?raw=true "Screenshot of Tabular Inline Items")

![Screenshot of Django inline items](/../master/docs/screenshots/sort_by_columns.png?raw=true "Screenshot of Tabular Inline Items")

![Screenshot of Django inline items](/../master/docs/screenshots/simplified.png?raw=true "Screenshot of simplified Inline Items")

Requirements
=====
Requires Django and django-grappelli

Usage
=====
1. pip install django-inline-wrestler
2. Add 'django_inline_wrestler' to your INSTALLED_APPS list in your project's settings.py

```python
from django_inline_wrestler.admin import TabularInlineOrderable, AdminListOrderable

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
	
	#To override which field is used for ordering, add a class starting with order-by-[fieldname]. Make sure to also include
	classes = ['django-inline-wrestler', 'order-by-position']

	#Add any of the following css classes to this list to disable any of the buttons:
	#'inline-wrestler-drag-disabled', 'inline-wrestler-move-disabled', 
	#'inline-wrestler-move-bottom-disabled', 'inline-wrestler-move-top-disabled', 
	#'inline-wrestler-move-up-disabled', 'inline-wrestler-move-down-disabled',
	#'inline-wrestler-jump-disabled'


class ObjectAdmin(AdminListOrderable):
	"""
	To bring drag-and-drop functionality to a changelist view:
	"""
	model = Object
	fields = ('priority', 'title')
	list_editable = ('priority',)

	change_list_template = 'admin/django_inline_wrestler/change_list.html'
    custom_list_order_by = 'priority'

	inlines = [ItemInline, SubItemInline]



```
