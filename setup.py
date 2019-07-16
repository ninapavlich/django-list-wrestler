from setuptools import setup, find_packages
# this is a test
setup(name='django-list-wrestler',
      description='Make django admin lists easier to sort and collapse.',
      version='6.3',
      url='https://github.com/ninapavlich/django-list-wrestler',
      author='Nina Pavlich',
      author_email='nina@ninalp.com',
      license='BSD',
      packages=find_packages(),
      package_data={'': ['*.py', '*.css', '*.js', '*.png']},
      include_package_data=True,
      install_requires=[],
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
