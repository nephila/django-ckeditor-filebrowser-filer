# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

import django.views.static
from django.conf import settings
from django.conf.urls import include, url
from django.contrib import admin

admin.autodiscover()

urlpatterns = [
    url(r'^filebrowser_filer/', include('ckeditor_filebrowser_filer.urls')),
    url(r'^media/(?P<path>.*)$', django.views.static.serve,  # NOQA
        {'document_root': settings.MEDIA_ROOT, 'show_indexes': True}),
]
try:
    urlpatterns.insert(0, url(r'^admin/', admin.site.urls)),  # NOQA
except Exception:
    urlpatterns.insert(0, url(r'^admin/', include(admin.site.urls))),  # NOQA
