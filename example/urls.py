from django.conf import settings
from django.conf.urls import patterns, url, include
from django.contrib import admin


admin.autodiscover()

urlpatterns = patterns('',
    # -- Support Apps
    url(r'^grappelli/', include('grappelli.urls')),
    
    # -- Django Admin
    (r'^admin/doc/', include('django.contrib.admindocs.urls')),
    (r'^admin/', include(admin.site.urls)),

    # -- Example Apps
    (r'^', include('example.apps.items.urls')),

)

