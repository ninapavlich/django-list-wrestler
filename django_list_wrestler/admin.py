from django.contrib import admin

class AdminListOrderable(admin.ModelAdmin):
	change_list_template = 'admin/django_list_wrestler/change_list.html'

	def changelist_view(self, request, extra_context=None):
		extra_context = extra_context or {}
		extra_context['ORDER_BY'] = self.custom_list_order_by or 'order'
		return super(AdminListOrderable, self).changelist_view(request, extra_context=extra_context)
	class Media:        
		css = {
			"all": (
				'django_list_wrestler/css/django-list-wrestler.css',
				'django_list_wrestler/css/django-skin.css',
			)
		}
		js = [
			'django_list_wrestler/js/django-list-wrestler.js' 
		]

class TabularInlineOrderable(admin.TabularInline):
	class Media:        
		css = {
			"all": (
				'django_list_wrestler/css/django-list-wrestler.css',
				'django_list_wrestler/css/django-skin.css',
			)
		}
		js = [
			'django_list_wrestler/js/django-list-wrestler.js' 
		]

	classes = ['django-list-wrestler'] 
	extra = 0



class StackedInlineOrderable(admin.StackedInline):
	class Media:        
		css = {
			"all": (
				'django_list_wrestler/css/django-list-wrestler.css',
				'django_list_wrestler/css/django-skin.css',
			)
		}
		js = [
			'django_list_wrestler/js/django-list-wrestler.js' 
		]

	classes = ['django-list-wrestler', 'django-list-wrestler-stacked'] 
	extra = 0
