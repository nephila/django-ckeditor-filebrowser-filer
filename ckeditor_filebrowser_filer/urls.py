# -*- coding: utf-8 -*-
from django.conf.urls import patterns, url
from .views import *

urlpatterns = patterns('',
    url(r'version/$', filer_version, name='filer_version'),
    url(r'use_thumbnailoptions_only/$', use_thumbnailoptions_only, name='use_thumbnailoptions_only'),
    url(r'url_reverse/$', url_reverse, name='js_url_reverse'),
    url(r'url_image/(?P<image_id>\d+)/$', url_image, name='url_image'),
    url(r'url_image/(?P<image_id>\d+)/(?P<thumb_options>\d+)/$', url_image, name='url_image'),
    url(r'url_image/(?P<image_id>\d+)/(?P<width>\d+)/(?P<height>\d+)/$', url_image, name='url_image'),
    url(r'thumbnail_options/$', thumbnail_options, name='thumbnail_options'),
) 