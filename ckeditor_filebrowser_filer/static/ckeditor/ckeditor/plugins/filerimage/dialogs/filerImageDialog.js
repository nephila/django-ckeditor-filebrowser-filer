/**
 * @license Copyright (c) 2014-2014, Nephila - Iacopo Spalletti
 * For licensing, see LICENSE or https://github.com/nephila/django-ckeditor-filebrowser-filer
 */

/**
 * @fileOverview Image plugin based on django-filer
 */

'use strict';

(function(jQuery){
	CKEDITOR.dialog.add('filerImageDialog', function (editor) {
		var dialog = CKEDITOR.dialog.getCurrent(),
			idSuffix = '_filerImageDialog',
			imageWidth = 0,
			imageHeight = 0,
			lang = editor.lang.filerimage,
			commonLang = editor.lang.common,
			base_ckeditor = '/filebrowser_filer',
			base_static = editor.plugins.filerimage.path + '../../../../../static',
			base_admin = '/admin',
			nofile_icon = base_static + '/filer/icons/nofile_48x48.png';
		if (editor.filer_version < 1.2)
			var picker = 't=file_ptr';
		else
			var picker = '_pick=file';

		var standard_items = [
			{
				type: 'html',
				html: '<style>' +
						'.filerFile{display:table-cell; vertical-align: middle};' +
						'.filerFile .related-lookup{ text-indent= 0;}' +
						'#id_image' + idSuffix + '_clear {display: none; width: auto; height: auto; vertical-align: middle; margin-left: 10px;}' +
						'</style>' +
					'<div class="field-box field-image filerFile"><div>' +
						'<label for="id_image' + idSuffix + '">' + commonLang.image + ':</label>' +
						'<img style="width: 36px"; width="36" height="36" alt="' + lang.noFileAlt + '" class="quiet" src="' + nofile_icon + '" id="id_image' + idSuffix + '_thumbnail_img">' +
						'&nbsp;<span id="id_image' + idSuffix + '_description_txt" class="description_text"></span>' +
						'<a onclick="return showRelatedObjectLookupPopup(this);" title="' + lang.browse +'" id="lookup_id_image' + idSuffix + '" ' +
							'data-id="id_image' + idSuffix + '" class="related-lookup js-related-lookup" href="' + base_admin + '/filer/folder/last/?' + picker+ '">' +
							'<img width="16" height="16" alt="' + lang.browse +'" src="' + base_static + '/admin/img/icon_searchbox.png">' +
						'</a>' +
						'<img width="10" height="10" title="' + lang.clear + '" alt="' + lang.clear + '" src="' + base_static + '/admin/img/icon_deletelink.gif" id="id_image' + idSuffix + '_clear">' +
						'<br><input type="hidden" id="id_image' + idSuffix + '" data-id="id_image' + idSuffix + '" name="image" class="vForeignKeyRawIdAdminField">' +
					'</div></div>'
			},
			{
				type: 'text',
				id: 'url',
				label: lang.url,
				setup: function (element) {
					this.setValue(element.getAttribute('src'));
				},
				// Called by the main commitContent call on dialog confirmation.
				commit: function (element) {
					element.setAttribute('src', this.getValue());
				}
			},
			{
				type: 'text',
				id: 'caption',
				label: lang.caption,
				setup: function (element) {
					this.setValue(element.getAttribute('title'));
				},
				// Called by the main commitContent call on dialog confirmation.
				commit: function (element) {
					element.setAttribute('title', this.getValue());
				}
			},
			{
				type: 'hbox',
				widths: [ '50%', '50%' ],
				children: [
					{
						type: 'select',
						id: 'alignment',
						label: commonLang.align,
						items: [
							[commonLang.alignLeft, 'left'],
							[commonLang.alignRight, 'right']
						],
						setup: function (element) {
							this.setValue(element.getAttribute('align'));
						},
						// Called by the main commitContent call on dialog confirmation.
						commit: function (element) {
							element.setAttribute('align', this.getValue());
						}
					},
					{
						type: 'select',
						id: 'thumbnail_option',
						label: lang.thumbnailOption,
						items: [
							['--- Thumbnail ---', 0]
						],
						onLoad: function () {
							var element_id = '#' + this.getInputElement().$.id;
							jQuery.ajax({
								type: 'GET',
								url: base_ckeditor + '/thumbnail_options/',
								contentType: 'application/json; charset=utf-8',
								dataType: 'json',
								async: false,
								success: function (data) {
									jQuery.each(data, function (index, item) {
										jQuery(element_id).get(0).options[jQuery(element_id).get(0).options.length] = new Option(item.name, item.id);
									});
								},
								error: function (xhr, ajaxOptions, thrownError) {
									alert(xhr.status);
									alert(thrownError);
								}
							});
						},
						onChange: function () {
							getImageUrl();
						},
						setup: function (element) {
							this.setValue(element.getAttribute('thumb_option'));
						},
						// Called by the main commitContent call on dialog confirmation.
						commit: function (element) {
							element.setAttribute('thumb_option', this.getValue());
						}
					}
				]
			}
		];

		var extra_items = [
			{
				type: 'hbox',
				widths: [ '33%', '33%', '33%' ],
				children: [
					{
						type: 'checkbox',
						id: 'use_original_image',
						label: lang.useOriginal,
						setup: function (element) {
							this.setValue(element.getAttribute('original_image'));
						},
						// Called by the main commitContent call on dialog confirmation.
						commit: function (element) {
							element.setAttribute('original_image', this.getValue());
						}
					},
					{
						type: 'text',
						id: 'width',
						label: commonLang.width,
						onChange: function () {
							if (this.getValue() != '') {
								var ratio = this.getValue() / imageWidth;   // get ratio for scaling image
								dialog.getContentElement('tab-basic', 'height').setValue(Math.ceil(imageHeight * ratio));
							}

							//getImageUrl();
						},
						setup: function (element) {
							this.setValue(element.getAttribute('width'));
						},
						// Called by the main commitContent call on dialog confirmation.
						commit: function (element) {
							element.setAttribute('width', this.getValue());
						}
					},
					{
						type: 'text',
						id: 'height',
						label: commonLang.height,
						onChange: function () {
							getImageUrl();
						},
						setup: function (element) {
							this.setValue(element.getAttribute('height'));
						},
						// Called by the main commitContent call on dialog confirmation.
						commit: function (element) {
							element.setAttribute('height', this.getValue());
						}
					}
				]
			},
			{
				type: 'hbox',
				widths: [ '33%', '33%', '33%' ],
				children: [
					{
						type: 'checkbox',
						id: 'crop',
						label: lang.crop
					},
					{
						type: 'checkbox',
						id: 'upscale',
						label: lang.upscale
					},
					{
						type: 'checkbox',
						id: 'use_autoscale',
						label: lang.autoscale
					}
				]
			}
		];

		if (editor.use_thumbnailoptions_only === '1')
			var elements = standard_items;
		else
			var elements = standard_items.concat(extra_items);

		function getImageUrl() {
			var url = dialog.getContentElement('tab-basic', 'url'),
				thumb_opt_id = '',
				thumb_sel_val = dialog.getContentElement('tab-basic', 'thumbnail_option').getValue(),
				server_url = '',
				width = 0,
				height = 0;
			if (thumb_sel_val != 0) {
				thumb_opt_id = thumb_sel_val + '/';
			} else {
				if (dialog.getContentElement('tab-basic', 'width')) {
					width = dialog.getContentElement('tab-basic', 'width').getValue();
					if (width == '') width = ''; else width += '/';
					height = dialog.getContentElement('tab-basic', 'height').getValue();
					if (height == '') height = ''; else height += '/';
				}
				else {
					width = '';
					height = '';
				}
			}
			if(!editor.use_canonical_for_thumbnails) {
				if (thumb_opt_id) {
					server_url = base_ckeditor + '/url_image/' + jQuery('#id_image' + idSuffix).val() + '/' + thumb_opt_id;
				}
				else {
					server_url = base_ckeditor + '/url_image/' + jQuery('#id_image' + idSuffix).val() + '/' + width + height;
				}
				jQuery.get(server_url, function (data) {
					url.setValue(data.url);
					imageWidth = data.width;
					imageHeight = data.height;
					var id_image_thumbnail_img = jQuery('#id_image' + idSuffix + '_thumbnail_img');
					id_image_thumbnail_img.attr('src', data.url);
				});

			}
			else {
				if(editor.use_canonical_for_thumbnails === true) {
					server_url = base_ckeditor + '/serve/' + jQuery('#id_image' + idSuffix).val() + '/';
				}
				else {
					server_url = editor.use_canonical_for_thumbnails + jQuery('#id_image' + idSuffix).val() + '/';
				}
				if (thumb_opt_id) {
					server_url += thumb_opt_id;
				}
				else {
					server_url += width + height;
				}
				var id_image_thumbnail_img = jQuery('#id_image' + idSuffix + '_thumbnail_img');
				url.setValue(server_url);
				id_image_thumbnail_img.attr('src', server_url);
			}
		}

		return {
			title: lang.title,
			minWidth: 400,
			minHeight: 200,

			onShow: function () {
				dialog = CKEDITOR.dialog.getCurrent();
				var document = this.getElement().getDocument(),
					id_image = document.getById('id_image' + idSuffix),
					id_image_description_txt = document.getById('id_image' + idSuffix + '_description_txt'),
					id_image_thumbnail_img = document.getById('id_image' + idSuffix + '_thumbnail_img'),
					oldVal = id_image.getValue();

				setInterval(function () {
					if (oldVal != id_image.getValue()) {
						oldVal = id_image.getValue();
						getImageUrl();
					}
				}, 1000);
				if (id_image)
					id_image.hide();
				var id_image_clear = document.getById('id_image' + idSuffix + '_clear');

				id_image_clear.on('click', function () {
					id_image.setValue('');
					id_image.removeAttribute('value');
					id_image_thumbnail_img.setAttribute('src', nofile_icon);
					id_image_description_txt.setHtml('');
					id_image_clear = document.getById('id_image' + idSuffix + '_clear');
					id_image_clear.hide();
				});

				// Get the selection in the editor.
				var selection = editor.getSelection();

				// Get the element at the start of the selection.
				var element = selection.getStartElement();

				// Get the <img> element closest to the selection, if any.
				if (element)
					element = element.getAscendant('img', true);

				// Create a new <img> element if it does not exist.
				if (!element || element.getName() != 'img') {
					element = editor.document.createElement('img');

					// Flag the insertion mode for later use.
					this.insertMode = true;
				}
				else
					this.insertMode = false;

				// Store the reference to the <img> element in an internal property, for later use.
				this.element = element;

				id_image.setValue(element.getAttribute('filer_id'));

				// Invoke the setup methods of all dialog elements, so they can load the element attributes.
				if (!this.insertMode)
					this.setupContent(this.element);
				else
					id_image_clear.fire('click');
			},
			// This method is invoked once a user clicks the OK button, confirming the dialog.
			onOk: function () {
				// The context of this function is the dialog object itself.
				// http://docs.ckeditor.com/#!/api/CKEDITOR.dialog
				var dialog = this;

				// Creates a new <img> element.
				var img = this.element;

				dialog = CKEDITOR.dialog.getCurrent();
				var document = this.getElement().getDocument();
				// document = CKEDITOR.dom.document
				var id_image = document.getById('id_image' + idSuffix);
				img.setAttribute('filer_id', id_image.getValue());

				// Invoke the commit methods of all dialog elements, so the <img> element gets modified.
				this.commitContent(img);

				// Finally, in if insert mode, inserts the element at the editor caret position.
				if (this.insertMode)
					editor.insertElement(img);
			},

			contents: [
				{
					id: 'tab-basic',
					label: lang.titleBasic,
					elements: elements
				},
				{
					id: 'tab-adv',
					label: lang.titleAdvanced,
					elements: [
						{
							type: 'text',
							id: 'css_style',
							label: 'CSS'
						}
					]
				}
			]
		};
	});
})($||django.jQuery||jQuery);
