from django.contrib import admin

class TabularInlineOrderable(admin.TabularInline):
	class Media:        
		css = {
			"all": ('django_inline_orderable/css/django-orderable-inline.css',)
		}
		js = [
			'django_inline_orderable/js/django-orderable-inline.js' 
		]

	classes = ['django-orderable-inline'] 
	extra = 0
