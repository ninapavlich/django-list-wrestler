from django.contrib import admin

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



class ItemAdmin(admin.ModelAdmin):

	fieldsets = (
		( 'Item', { 'fields': ( 'parent', ('name', 'txtid'), 'description' ) } ),
	)
	list_display = ['parent', 'name', 'txtid', 'description']

	autocomplete_lookup_fields = { 'fk': ['parent'],}
	raw_id_fields = ('parent',)
	prepopulated_fields = {'txtid': ('name',)}

	inlines = [ItemInline, SubItemInline]
	

admin.site.register(Item, ItemAdmin)
