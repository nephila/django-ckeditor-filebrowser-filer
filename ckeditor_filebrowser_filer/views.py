# -*- coding: utf-8 -*-
import json
from distutils.version import LooseVersion

from django import http
from django.conf import settings
from django.core import urlresolvers
from django.http import HttpResponseRedirect

from filer.models import File
from filer.server.views import server

try:
    from filer.models import ThumbnailOption
except ImportError:
    from cmsplugin_filer_image.models import ThumbnailOption


def filer_version(request):
    import filer
    filer_legacy = LooseVersion(filer.__version__) < LooseVersion('1.1')
    filer_11 = not filer_legacy and LooseVersion(filer.__version__) < LooseVersion('1.2')
    filer_12 = not filer_11 and LooseVersion(filer.__version__) < LooseVersion('1.3')
    if filer_11:
        version = '1.1'
    elif filer_12:
        version = '1.2'
    else:
        version = '1.0'
    return http.HttpResponse(version)


def get_setting(request, setting):
    setting = 'CKEDITOR_FILEBROWSER_{}'.format(setting).upper()
    return http.HttpResponse(int(getattr(settings, setting, False)))


def url_reverse(request):
    """
    Reverse the requested URL (passed via GET / POST as `url_name` parameter)

    :param request: Request object
    :return: The reversed path
    """
    if request.method in ('GET', 'POST'): 
        data = getattr(request, request.method) 
        url_name = data.get('url_name') 
        try: 
            path = urlresolvers.reverse(url_name, args=data.getlist('args')) 
            (view_func, args, kwargs) = urlresolvers.resolve(path)
            return http.HttpResponse(path, content_type='text/plain')
        except urlresolvers.NoReverseMatch: 
            return http.HttpResponse('Error', content_type='text/plain')
    return http.HttpResponseNotAllowed(('GET', 'POST'))


def _return_thumbnail(image, thumb_options=None, width=None, height=None):
    thumbnail_options = {}
    if thumb_options is not None:
        thumbnail_options = ThumbnailOption.objects.get(pk=thumb_options).as_dict

    if width is not None or height is not None:
        width = int(width)
        height = int(height)

        size = (width, height)
        thumbnail_options.update({'size': size})

    if thumbnail_options != {}:
        thumbnailer = image.easy_thumbnails_thumbnailer
        image = thumbnailer.get_thumbnail(thumbnail_options)
        return image
    return None


def url_image(request, image_id, thumb_options=None, width=None, height=None):
    """
    Converts a filer image ID in a complete path

    :param request: Request object
    :param image_id: Filer image ID
    :param thumb_options: ThumbnailOption ID
    :param width: user-provided width
    :param height: user-provided height
    :return: JSON serialized URL components ('url', 'width', 'height')
    """
    image = File.objects.get(pk=image_id)
    if getattr(image, 'canonical_url', None):
        url = image.canonical_url
    else:
        url = image.url
    thumb = _return_thumbnail(image, thumb_options, width, height)
    if thumb:
        image = thumb
        url = image.url
    data = {
        'url': url,
        'width': image.width,
        'height': image.height,
    }
    return http.HttpResponse(json.dumps(data), content_type='application/json')


def thumbnail_options(request):
    """
    Returns the requested ThumbnailOption as JSON

    :param request: Request object
    :return: JSON serialized ThumbnailOption
    """
    response_data = [{'id': opt.pk, 'name': opt.name} for opt in ThumbnailOption.objects.all()]
    return http.HttpResponse(json.dumps(response_data), content_type="application/json")


def serve_image(request, image_id, thumb_options=None, width=None, height=None):
    """
    returns the content of an image sized according to the parameters

    :param request: Request object
    :param image_id: Filer image ID
    :param thumb_options: ThumbnailOption ID
    :param width: user-provided width
    :param height: user-provided height
    :return: JSON serialized URL components ('url', 'width', 'height')
    """
    image = File.objects.get(pk=image_id)
    if getattr(image, 'canonical_url', None):
        url = image.canonical_url
    else:
        url = image.url
    thumb = _return_thumbnail(image, thumb_options, width, height)
    if thumb:
        return server.serve(request, file_obj=thumb, save_as=False)
    else:
        return HttpResponseRedirect(url)