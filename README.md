django-inline-orderable
=======================

Make django inline lists easier to sort with jQuery and Grappelli.


![Screenshot of Django inline items](/../master/docs/screenshots/screenshot.png?raw=true "Screenshot of Tabular Inline Items")

```python
from django_inline_orderable.admin import TabularInlineOrderable

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
	classes = ['django-orderable-inline', 'order-by-position']
```