from django.contrib import admin


class GRPMediaMixin(object):

	class Media:        
		css = {
			"all": (
				'django_list_wrestler/css/django-list-wrestler-orderable.css',
				'django_list_wrestler/css/grappelli-skin-orderable.css',
			)
		}
		js = [
			'django_list_wrestler/js/django-list-wrestler-orderable.js' 
		]

class DefaultSkinMediaMixin(object):

	class Media:        
		css = {
			"all": (
				'django_list_wrestler/css/django-list-wrestler-orderable.css',
				'django_list_wrestler/css/django-skin-orderable.css',
			)
		}
		js = [
			'django_list_wrestler/js/django-list-wrestler-orderable.js' 
		]		


class BaseAdminListOrderable(admin.ModelAdmin):
	change_list_template = 'admin/django_list_wrestler/change_list.html'


	def get_custom_list_settings(self):
		if hasattr(self, 'custom_list_settings'):
			return self.custom_list_settings
		return []

	def changelist_view(self, request, extra_context=None):
		extra_context = extra_context or {}
		extra_context['ORDER_BY'] = self.custom_list_order_by or 'path'
		extra_context['custom_list_settings'] = self.get_custom_list_settings()
		
		return super(BaseAdminListOrderable, self).changelist_view(request, extra_context=extra_context)

class AdminListOrderable(DefaultSkinMediaMixin, BaseAdminListOrderable):
	pass

class GRPAdminListOrderable(GRPMediaMixin, BaseAdminListOrderable):
	
	def get_custom_list_settings(self):
		if hasattr(self, 'custom_list_settings'):
			return self.custom_list_settings + ['grappelli-skin']
		return ['grappelli-skin']

class BaseTabularInlineOrderable(admin.TabularInline):

	classes = ['django-list-wrestler', 'django-list-wrestler-orderable'] 
	extra = 0

class TabularInlineOrderable(GRPMediaMixin, BaseTabularInlineOrderable):
	pass

class GRPTabularInlineOrderable(GRPMediaMixin, BaseTabularInlineOrderable):
	classes = ['django-list-wrestler', 'django-list-wrestler-orderable', 'grappelli-skin'] 


class BaseStackedInlineOrderable(admin.StackedInline):
	
	classes = ['django-list-wrestler', 'django-list-wrestler-orderable', 'django-list-wrestler-stacked'] 
	extra = 0


class StackedInlineOrderable(GRPMediaMixin, BaseStackedInlineOrderable):
	pass

class GRPStackedInlineOrderable(GRPMediaMixin, BaseStackedInlineOrderable):
	
	classes = ['django-list-wrestler', 'django-list-wrestler-orderable', 'django-list-wrestler-stacked', 'grappelli-skin'] 





class GRPCollapseMediaMixin(object):

	class Media:        
		css = {
			"all": (
				'django_list_wrestler/css/django-list-wrestler-collapsible.css',
				'django_list_wrestler/css/grappelli-skin-collapsible.css',
			)
		}
		js = [
			'django_list_wrestler/js/django-list-wrestler-collapsible.js' 
		]

class DefaultSkinCollapseMediaMixin(object):

	class Media:        
		css = {
			"all": (
				'django_list_wrestler/css/django-list-wrestler-collapsible.css',
				'django_list_wrestler/css/django-skin-collapsible.css',
			)
		}
		js = [
			'django_list_wrestler/js/django-list-wrestler-collapsible.js' 
		]

class BaseAdminListCollapsible(admin.ModelAdmin):
	change_list_template = 'admin/django_list_wrestler/change_list.html'


	def get_custom_list_settings(self):
		if hasattr(self, 'custom_list_settings'):
			return self.custom_list_settings
		return ['django-list-wrestler']

	def changelist_view(self, request, extra_context=None):
		extra_context = extra_context or {}
		extra_context['ORDER_BY'] = self.custom_list_order_by or 'order'
		extra_context['custom_list_settings'] = self.get_custom_list_settings()
		
		return super(BaseAdminListCollapsible, self).changelist_view(request, extra_context=extra_context)

class AdminListCollapsible(DefaultSkinCollapseMediaMixin, BaseAdminListCollapsible):
	pass

class GRPAdminListCollapsible(GRPCollapseMediaMixin, BaseAdminListCollapsible):
	
	def get_custom_list_settings(self):
		if hasattr(self, 'custom_list_settings'):
			return self.custom_list_settings + ['grappelli-skin']
		return ['grappelli-skin']
