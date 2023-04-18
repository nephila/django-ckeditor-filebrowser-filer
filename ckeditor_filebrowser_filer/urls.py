from django.urls import re_path
try:
    from django.conf.urls import patterns
except:
    def patterns(prefix, *urls):
        return urls

from .views import *

urlpatterns = patterns('',
    re_path(r'filer_version/$', filer_version, name='filer_version'),
    re_path(r'setting/(?P<setting>\w+)/$', get_setting, name='get_setting'),
    re_path(r'url_reverse/$', url_reverse, name='js_url_reverse'),
    re_path(r'url_image/(?P<image_id>\d+)/$', url_image, name='url_image'),
    re_path(r'url_image/(?P<image_id>\d+)/(?P<thumb_options>\d+)/$', url_image, name='url_image'),
    re_path(r'url_image/(?P<image_id>\d+)/(?P<width>\d+)/(?P<height>\d+)/$', url_image, name='url_image'),
    re_path(r'serve/(?P<image_id>\d+)/$', serve_image, name='serve_image'),
    re_path(r'serve/(?P<image_id>\d+)/(?P<thumb_options>\d+)/$', serve_image, name='serve_image'),
    re_path(r'serve/(?P<image_id>\d+)/(?P<width>\d+)/(?P<height>\d+)/$', serve_image, name='serve_image'),
    re_path(r'thumbnail_options/$', thumbnail_options, name='thumbnail_options'),
)
