from setuptools import setup, find_packages
#this is a test
setup(name = 'django-inline-orderable',
      description = 'Make django inline lists easier to sort with jQuery and Grappelli.',
      version = '1.3.1',
      url = 'https://github.com/espenak/django_ckeditorfiles',
      author = 'Espen Angell Kristiansen',
      license = 'LGPL',
      packages=find_packages(exclude=['ez_setup']),
      zip_safe = False,
      include_package_data=True,
      install_requires = ['setuptools', 'Django'],
      classifiers=[
                   'Development Status :: 5 - Production/Stable',
                   'Environment :: Web Environment',
                   'Framework :: Django',
                   'Intended Audience :: Developers',
                   'License :: OSI Approved',
                   'Operating System :: OS Independent',
                   'Programming Language :: Python'
                  ]
)
