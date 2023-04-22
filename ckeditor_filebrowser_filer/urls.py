from django.urls import path, re_path

from .views import filer_version, get_setting, serve_image, thumbnail_options, url_image, url_reverse

urlpatterns = [
    path("version/", filer_version, name="filer_version"),
    re_path(r"setting/(?P<setting>\w+)/$", get_setting, name="get_setting"),
    path("url_reverse/", url_reverse, name="js_url_reverse"),
    path("url_image/<int:image_id>/", url_image, name="url_image"),
    path(
        "url_image/<int:image_id>/<int:thumb_options>/",
        url_image,
        name="url_image",
    ),
    path(
        "url_image/<int:image_id>/<int:width>/<int:height>/",
        url_image,
        name="url_image",
    ),
    path("serve/<int:image_id>/", serve_image, name="serve_image"),
    path(
        "serve/<int:image_id>/<int:thumb_options>/",
        serve_image,
        name="serve_image",
    ),
    path(
        "serve/<int:image_id>/<int:width>/<int:height>/",
        serve_image,
        name="serve_image",
    ),
    path("thumbnail_options/", thumbnail_options, name="thumbnail_options"),
]
