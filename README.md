django-inline-wrestler
=======================

Make django inline lists easier to sort with jQuery and Grappelli.

This plugin turns an ordinary order field into a high-powered sorting tool including:
* Drag-and-Drop
* Jump to Top and Jump to Bottom buttons
* Jump one up and Jump one bottom
* Send directly to a position in the list
* Adjust table headers so they line up with the actual columns
* Make table headers sortable, so you can sort by a particular field (supports sorting by text inputs, text areas, check boxes, image uploads, and fks)
* Positioning order buttons anywhere in the table

![Screenshot of Django inline items](/../master/docs/screenshots/screenshot.png?raw=true "Screenshot of Tabular Inline Items")

![Screenshot of Django inline items](/../master/docs/screenshots/sort_by_columns.png?raw=true "Screenshot of Tabular Inline Items")

Usage
=====
1. pip install django-inline-wrestler
2. Add 'django-inline-wrestler' to your INSTALLED_APPS list in your project's settings.py

```python
from django_inline_wrestler.admin import TabularInlineOrderable

from .models import *

class ItemInline(TabularInlineOrderable):
	model = Item
	fields = ('order', 'name', 'txtid', 'description')
	prepopulated_fields = {'txtid': ('name',)}
	
class SubItemInline(TabularInlineOrderable):
	model = SubItem
	fields = ('position', 'name', 'txtid')
	prepopulated_fields = {'txtid': ('name',)}
	
	#To override which field is used for ordering, add a class starting with order-by-[fieldname]. Make sure to also include
	classes = ['django-inline-wrestler', 'order-by-position']
```
