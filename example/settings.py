import os
import sys

from django.conf.global_settings import *   # pylint: disable=W0614,W0401

import apps as project_module

#==============================================================================
# Generic Django project settings
#==============================================================================

DEBUG = True
TEMPLATE_DEBUG = DEBUG

SITE_ID = 1
TIME_ZONE = 'UTC'
USE_TZ = True
USE_I18N = True
USE_L10N = True
LANGUAGE_CODE = 'en'
LANGUAGES = (
    ('en', 'English'),
)

GRAPPELLI_ADMIN_TITLE = "Django Inline Orderable | Example"
GRAPPELLI_INDEX_DASHBOARD = 'example.dashboard.ExampleDashboard'

#==============================================================================
# Apps
#==============================================================================

INSTALLED_APPS = (
    'grappelli.dashboard',
    'grappelli',

    'django.contrib.admin',
    'django.contrib.admindocs',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.webdesign',

    'django_inline_orderable',
    'example.apps.items',

    'south'
)

#==============================================================================
# Calculation of directories relative to the project module location
#==============================================================================

APP_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir,os.pardir))
DATA_DIR = os.path.join(APP_DIR, 'data')
PROJECT_DIR = os.path.dirname(os.path.realpath(project_module.__file__))
PYTHON_BIN = os.path.dirname(sys.executable)
ve_path = os.path.dirname(os.path.dirname(os.path.dirname(PROJECT_DIR)))

if os.path.exists(os.path.join(PYTHON_BIN, 'activate_this.py')):
    VAR_ROOT = os.path.join(os.path.dirname(PYTHON_BIN), 'var')
elif ve_path and os.path.exists(os.path.join(ve_path, 'bin',
        'activate_this.py')):
    VAR_ROOT = os.path.join(ve_path, 'var')
else:
    VAR_ROOT = os.path.join(PROJECT_DIR, 'var')

if not os.path.exists(VAR_ROOT):
    os.mkdir(VAR_ROOT)

#==============================================================================
# Project URLS and Media Settings
#==============================================================================

ROOT_URLCONF = 'example.urls'

LOGIN_URL = '/login/'
LOGOUT_URL = '/logout/'
LOGIN_REDIRECT_URL = '/'

STATIC_URL = '/static/'
MEDIA_URL = '/media/'

STATIC_ROOT = os.path.join(os.path.dirname(__file__), 'static')
MEDIA_ROOT = os.path.join(STATIC_ROOT, 'media')


STATICFILES_DIRS = (
    os.path.join(PROJECT_DIR,  '..', 'static'),
)


STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    'django.contrib.staticfiles.finders.FileSystemFinder',
)


#==============================================================================
# DATABASES
#==============================================================================
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': 'inline_orderable_testing_db',
    }
}

#==============================================================================
# Templates
#==============================================================================

TEMPLATE_DIRS = (
    os.path.join(PROJECT_DIR, '..', 'templates'),
)

TEMPLATE_CONTEXT_PROCESSORS += (
    "django.core.context_processors.request",
)


#==============================================================================
# Middleware
#==============================================================================

MIDDLEWARE_CLASSES += (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
)

#==============================================================================
# Auth / security
#==============================================================================

ACCOUNT_ACTIVATION_DAYS = 7


AUTHENTICATION_BACKENDS += (
)

SECRET_KEY = 'cj51h)g!+qi-=&#ul0d+a8fdlakjhr3y4982orn238(*&(*&(*78687'


#==============================================================================
# App Settings
#==============================================================================

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'


#==============================================================================
# CKEditor Settings
#==============================================================================
CKEDITOR_BASIC = {
    'filebrowserImageBrowseUrl': '/admin/media/mediapicker',
    'filebrowserImageWindowWidth': '640',
    'filebrowserImageWindowHeight': '480',
    'height': '400px',
    'toolbar': [
        {
            'name': 'styles',
            'items': ['Format']
        },
        {
            'name': 'basicstyles',
            'items': ['Bold', 'Italic', 'Underline']
        },
        {
            'name': 'semantic',
            'items': ['Superscript']
        },
        {
            'name': 'paragraph',
            'groups': ['list'],
            'items': ['NumberedList', 'BulletedList', 'Blockquote']
        },
        {
            'name': 'media',
            'items': ['Image', 'CreateDiv']
        },
        {
            'name': 'links',
            'items': ['Link', 'Unlink', 'Anchor']
        },
        {
            'name': 'insert',
            'items': ['HorizontalRule', 'SpecialChar']
        },
        {
            'name': 'pasting',
            'items': ['PasteText', 'PasteFromWord', 'RemoveFormat']
        },
        {
            'name': 'tools',
            'items': ['Maximize']
        },
        {
            'name': 'source',
            'items': ['Source']
        },
        {
            'name': 'styles',
            'items': ['Quote Attribution']
        }        
    ],
    'allowedContent' : 
        'h1 h2 h3 p blockquote strong em sup u;'\
        'ol ul li;'\
        'figure{width,height,display,float};'\
        'figcaption{width,height,display,float,text-align,margin};'\
        'img[!src,alt,width,height,align,data-caption,style]{display,margin,float};'\
        'div(*);',
    'removeButtons' : ''
}