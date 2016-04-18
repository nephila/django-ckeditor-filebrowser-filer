=================================
django-ckeditor-filebrowser-filer
=================================

.. image:: https://badge.fury.io/py/django-ckeditor-filebrowser-filer.png
    :target: https://badge.fury.io/py/django-ckeditor-filebrowser-filer

A django-filer based CKEditor filebrowser for **django CMS**

Documentation
-------------

A CKEditor filebrowser based on `django-filer`_ and `django CMS`_

Original code is taken from `django-ckeditor-filer`_

Quickstart
----------

Install django-ckeditor-filebrowser-filer::

    pip install django-ckeditor-filebrowser-filer

Then add it to INSTALLED_APPS along with its dependencies::

    'filer',
    'ckeditor_filebrowser_filer',

**IMPORTANT: if you're using filer<1.2 this plugin requires django CMS and 'cmsplugin_filer_image', so you need to add 'cmsplugin_filer_image' in your settings and setup a django CMS environment**

Configure django-filer `Canonical URLs`_

Add `ckeditor_filebrowser_filer` to urlconf::

    url(r'^filebrowser_filer/', include('ckeditor_filebrowser_filer.urls')),

Add `FilerImage` button to you CKEditor configuration.

.. _Canonical URLs: http://django-filer.readthedocs.org/en/latest/installation.html#canonical-urls
.. _django CMS: https://pypi.python.org/pypi/django-cms
.. _django-filer: https://pypi.python.org/pypi/django-filer
.. _django-ckeditor-filer: https://github.com/ikresoft/django-ckeditor-filer/


