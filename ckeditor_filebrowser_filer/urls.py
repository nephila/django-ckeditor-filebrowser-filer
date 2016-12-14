# -*- coding: utf-8 -*-
from django.conf.urls import url
try:
    from django.conf.urls import patterns
except:
    def patterns(prefix, *urls):
        return urls

from .views import *

urlpatterns = patterns('',
    url(r'version/$', filer_version, name='filer_version'),
    url(r'setting/(?P<setting>\w+)/$', get_setting, name='get_setting'),
    url(r'url_reverse/$', url_reverse, name='js_url_reverse'),
    url(r'url_image/(?P<image_id>\d+)/$', url_image, name='url_image'),
    url(r'url_image/(?P<image_id>\d+)/(?P<thumb_options>\d+)/$', url_image, name='url_image'),
    url(r'url_image/(?P<image_id>\d+)/(?P<width>\d+)/(?P<height>\d+)/$', url_image, name='url_image'),
    url(r'serve/(?P<image_id>\d+)/$', serve_image, name='serve_image'),
    url(r'serve/(?P<image_id>\d+)/(?P<thumb_options>\d+)/$', serve_image, name='serve_image'),
    url(r'serve/(?P<image_id>\d+)/(?P<width>\d+)/(?P<height>\d+)/$', serve_image, name='serve_image'),
    url(r'thumbnail_options/$', thumbnail_options, name='thumbnail_options'),
)
