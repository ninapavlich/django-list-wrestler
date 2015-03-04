from django.contrib import admin

class TabularInlineOrderable(admin.TabularInline):
	class Media:        
		css = {
			"all": ('django_inline_wrester/css/django-inline-wrestler.css',)
		}
		js = [
			'django_inline_wrester/js/django-inline-wrestler.js' 
		]

	classes = ['django-inline-wrestler'] 
	extra = 0



class StackedInlineOrderable(admin.StackedInline):
	class Media:        
		css = {
			"all": ('django_inline_wrester/css/django-inline-wrestler.css',)
		}
		js = [
			'django_inline_wrester/js/django-inline-wrestler.js' 
		]

	classes = ['django-inline-wrestler'] 
	extra = 0
