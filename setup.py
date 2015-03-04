from setuptools import setup, find_packages
#this is a test
setup(name = 'django-inline-wrestler',
      description = 'Wrestle your django inlines with jQuery and Grappelli.',
      version = '0.1',
      url = 'https://github.com/ninapavlich/django-inline-wrestler',
      author = 'Nina Pavlich',
      author_email='nina@ninalp.com',
      license = 'BSD',
      packages=find_packages(exclude=['ez_setup']),
      zip_safe = False,
      include_package_data=True,
      install_requires = ['setuptools', 'Django'],
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
