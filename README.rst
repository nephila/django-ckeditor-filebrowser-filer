=================================
django-ckeditor-filebrowser-filer
=================================

.. image:: https://badge.fury.io/py/django-ckeditor-filebrowser-filer.png
    :target: https://badge.fury.io/py/django-ckeditor-filebrowser-filer

A django-filer based CKEditor filebrowser

Documentation
-------------

Original code is taken from `django-ckeditor-filer`_

It supports both ckeditor widget provided by `django-ckeditor`_ and the one provided
by `djangocms-text-ckeditor`_.

.. warning:: if you are using filer<1.2 this plugin requires `django CMS`_
  `cmsplugin_filer_image`_, thus you need to install and configure both according
  to their respective documentation.


Quickstart
----------

* Install django-ckeditor-filebrowser-filer::

    pip install django-ckeditor-filebrowser-filer

* Add it to INSTALLED_APPS along with its dependencies::

    'filer',
    'ckeditor_filebrowser_filer',

* Configure django-filer `Canonical URLs`_

* Add `ckeditor_filebrowser_filer` to urlconf::

    url(r'^filebrowser_filer/', include('ckeditor_filebrowser_filer.urls')),

  Currently only ``filebrowser_filer/`` is supported as url path

* Add `FilerImage` button to you CKEditor configuration:

  * Add ``'FilerImage'`` to a toolbar in ``CKEDITOR_CONFIGS``
  * Add ``'filerimage'`` in `` 'extraPlugins'`` in ``CKEDITOR_CONFIGS``
  * Add ``'image'`` in `` 'removePlugins'`` in ``CKEDITOR_CONFIGS``

Example::

    CKEDITOR_CONFIGS = {
        'default': {
            'toolbar': 'Custom',
            'toolbar_Custom': [
                ...
                ['FilerImage']
            ],
            'extraPlugins': 'filerimage',
            'removePlugins': 'image'
        },
    }

when using `djangocms-text-ckeditor`_ use ``CKEDITOR_SETTINGS`` instead of
``CKEDITOR_CONFIGS``.


.. _Canonical URLs: http://django-filer.readthedocs.org/en/latest/installation.html#canonical-urls
.. _django CMS: https://pypi.python.org/pypi/django-cms
.. _django-filer: https://pypi.python.org/pypi/django-filer
.. _cmsplugin_filer_image: https://pypi.python.org/pypi/cmsplugin_filer_image
.. _django-ckeditor: https://pypi.python.org/pypi/django-ckeditor
.. _djangocms-text-ckeditor: https://pypi.python.org/pypi/djangocms-text-ckeditor
.. _django-ckeditor-filer: https://github.com/ikresoft/django-ckeditor-filer/


