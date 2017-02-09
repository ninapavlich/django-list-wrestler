from setuptools import setup, find_packages
#this is a test
setup(name = 'django-inline-wrestler',
      description = 'Wrestle your django inlines with jQuery and Grappelli.',
      version = '5.3',
      url = 'https://github.com/ninapavlich/django-inline-wrestler',
      author = 'Nina Pavlich',
      author_email='nina@ninalp.com',
      license = 'BSD',
      packages=find_packages(),
      package_data={'': ['*.py','*.css','*.js']},
      include_package_data=True,
      install_requires = [],
      classifiers=[
            'Development Status :: 4 - Beta',
            'Environment :: Web Environment',
            'Framework :: Django',
            'Intended Audience :: Developers',
            'License :: OSI Approved',
            'Operating System :: OS Independent',
            'Programming Language :: Python'
      ]
)
