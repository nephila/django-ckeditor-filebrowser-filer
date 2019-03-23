#!/usr/bin/env python
# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from tempfile import mkdtemp

HELPER_SETTINGS = dict(
    ROOT_URLCONF='project.urls',
    INSTALLED_APPS=[
        'filer',
        'ckeditor',
        'ckeditor_filebrowser_filer',
        'project',
    ],
    CKEDITOR_CONFIGS={
        'default': {
            'toolbar': 'Custom',
            'toolbar_Custom': [
                ['FilerImage', 'Source']
            ],
            'extraPlugins': 'filerimage',
            'removePlugins': 'image'
        },
    },
    FILE_UPLOAD_TEMP_DIR=mkdtemp()
)

try:
    import sekizai  # NOQA

    HELPER_SETTINGS['INSTALLED_APPS'].append('sekizai')
    HELPER_SETTINGS['TEMPLATE_CONTEXT_PROCESSORS'] = [
        'sekizai.context_processors.sekizai',
    ]
except ImportError:
    pass


def run():
    from djangocms_helper import runner
    runner.run('ckeditor_filebrowser_filer')


def setup():
    import sys
    from djangocms_helper import runner
    runner.setup('ckeditor_filebrowser_filer', sys.modules[__name__])


if __name__ == '__main__':
    run()
