CKEDITOR.dialog.add( 'filerImageDialog', function ( editor ) {
    dialog = CKEDITOR.dialog.getCurrent();
    var imageWidth = 0;
    var imageHeight = 0;

    function getImageUrl() {
        var url = dialog.getContentElement("tab-basic", "url");
        var thumb_opt_id = "";
        thumb_sel_val = dialog.getContentElement("tab-basic", "thumbnail_option").getValue();
        if (thumb_sel_val != 0) {
            thumb_opt_id = thumb_sel_val + '/';
            server_url = '/ckeditor_filer/url_image/'+ $('#id_image').val() + '/' + thumb_opt_id;
        } else {
            width = dialog.getContentElement("tab-basic", "width").getValue();
            if (width == "") width = ''; else width += '/';
            height = dialog.getContentElement("tab-basic", "height").getValue();
            if (height == "") height = ''; else height += '/';
            server_url = '/ckeditor_filer/url_image/'+ $('#id_image').val() + '/' + width + height;
        }
        $.get(server_url, function(data) {
            url.setValue(data.url);
            imageWidth = data.width;
            imageHeight = data.height;
        });
    }
    return {
        title: 'Filer Image Properties',
        minWidth: 400,
        minHeight: 200,

        onShow: function() {
            dialog = CKEDITOR.dialog.getCurrent();
            var document = this.getElement().getDocument();
            // document = CKEDITOR.dom.document
            var id_image = document.getById( 'id_image' );
            var oldVal = id_image.getValue();

            setInterval(function () {
                if (oldVal != id_image.getValue()) {
                    oldVal = id_image.getValue();
                    getImageUrl();
                }
            }, 1000);
            if ( id_image )
                id_image.hide();
            var id_image_clear = document.getById( 'id_image_clear' );

            id_image_clear.on('click', function () {
                id_image.setValue("");
                id_image.removeAttribute("value");
                id_image_thumbnail_img = document.getById( 'id_image_thumbnail_img' );
                id_image_thumbnail_img.setAttribute("src", "http://media.uninp.edu.rs/static/filer/icons/nofile_48x48.png");
                id_image_description_txt = document.getById( 'id_image_description_txt' );
                id_image_description_txt.setHtml("");
                id_image_clear = document.getById( 'id_image_clear' );
                id_image_clear.hide();
            });

            // Get the selection in the editor.
            var selection = editor.getSelection();

            // Get the element at the start of the selection.
            var element = selection.getStartElement();

            // Get the <img> element closest to the selection, if any.
            if ( element )
                element = element.getAscendant( 'img', true );

            // Create a new <img> element if it does not exist.
            if ( !element || element.getName() != 'img' ) {
                element = editor.document.createElement( 'img' );

                // Flag the insertion mode for later use.
                this.insertMode = true;
            }
            else
                this.insertMode = false;

            // Store the reference to the <img> element in an internal property, for later use.
            this.element = element;

            // Invoke the setup methods of all dialog elements, so they can load the element attributes.
            if ( !this.insertMode )
                this.setupContent( this.element );
            else
                id_image_clear.fire('click');
        },
        // This method is invoked once a user clicks the OK button, confirming the dialog.
        onOk: function() {
            // The context of this function is the dialog object itself.
            // http://docs.ckeditor.com/#!/api/CKEDITOR.dialog
            var dialog = this;

            // Creates a new <img> element.
            var img = this.element;

            dialog = CKEDITOR.dialog.getCurrent();
            var document = this.getElement().getDocument();
            // document = CKEDITOR.dom.document
            var id_image = document.getById( 'id_image' );
            img.setAttribute("filer_id", id_image.getValue());

            // Invoke the commit methods of all dialog elements, so the <img> element gets modified.
            this.commitContent( img );

            // Finally, in if insert mode, inserts the element at the editor caret position.
            if ( this.insertMode )
                editor.insertElement( img );
        },

        contents: [
            {
                id: 'tab-basic',
                label: 'Basic Settings',
                elements: [
                    {
                        type: 'html',
                        html:
                            '<div class="field-box field-image">' +
                                '<label for="id_image">Image:</label>' +
                                '<img alt="no file selected" class="quiet" src="http://media.uninp.edu.rs/static/filer/icons/nofile_48x48.png" id="id_image_thumbnail_img">' +
                                '&nbsp;<span id="id_image_description_txt"></span>' +
                                '<a onclick="return showRelatedObjectLookupPopup(this);" title="Pretraži" id="lookup_id_image" class="related-lookup" href="/admin/filer/folder/last/?t=file_ptr">' +
                                    '<img width="16" height="16" alt="Pretraži" src="http://media.uninp.edu.rs/static/admin/img/icon_searchbox.png">' +
                                '</a>' +
                                '<img width="10" height="10" style="display: none;" title="Očisti" alt="Očisti" src="http://media.uninp.edu.rs/static/admin/img/icon_deletelink.gif" id="id_image_clear">' +
                                '<br><input type="text" id="id_image" name="image" class="vForeignKeyRawIdAdminField">' +
                            '</div>',
                    },
                    {
                        type: 'text',
                        id: 'url',
                        label: 'Url',
                        setup: function( element ) {
                            this.setValue( element.getAttribute( "src" ) );
                        },
                        // Called by the main commitContent call on dialog confirmation.
                        commit: function( element ) {
                            element.setAttribute( "src", this.getValue() );
                        }
                    },
                    {
                        type: 'text',
                        id: 'caption',
                        label: 'Caption',
                        setup: function( element ) {
                            this.setValue( element.getAttribute( "title" ) );
                        },
                        // Called by the main commitContent call on dialog confirmation.
                        commit: function( element ) {
                            element.setAttribute( "title", this.getValue() );
                        }
                    },
                    {
                        type: 'text',
                        id: 'alt_text',
                        label: 'Alt',
                        setup: function( element ) {
                            this.setValue( element.getAttribute( "alt" ) );
                        },
                        // Called by the main commitContent call on dialog confirmation.
                        commit: function( element ) {
                            element.setAttribute( "alt", this.getValue() );
                        }
                    },
                    {
                        type: 'hbox',
                        widths: [ '50%', '50%', ],
                        children: [
                            {
                                type: 'checkbox',
                                id: 'use_original_image',
                                label: 'Use original image',
                                setup: function( element ) {
                                    this.setValue( element.getAttribute( "original_image" ) );
                                },
                                // Called by the main commitContent call on dialog confirmation.
                                commit: function( element ) {
                                    element.setAttribute( "original_image", this.getValue() );
                                }
                            },
                            {
                                type: 'select',
                                id: 'thumbnail_option',
                                items : [ ['--- Thumbnail ---',0] ],
                                onLoad : function() {
                                    var element_id = '#' + this.getInputElement().$.id;
                                    $.ajax({
                                        type: 'GET',
                                        url: '/ckeditor_filer/thumbnail_options/',
                                        contentType: 'application/json; charset=utf-8',
                                        dataType: 'json',
                                        async: false,
                                        success: function(data) {
                                            $.each(data, function(index, item) {
                                                $(element_id).get(0).options[$(element_id).get(0).options.length] = new Option(item.name, item.id);
                                            });
                                        },
                                        error:function (xhr, ajaxOptions, thrownError){
                                            alert(xhr.status);
                                            alert(thrownError);
                                        }
                                    });
                                },
                                onChange: function() {
                                    getImageUrl();
                                },
                                setup: function( element ) {
                                    this.setValue( element.getAttribute( "thumb_option" ) );
                                },
                                // Called by the main commitContent call on dialog confirmation.
                                commit: function( element ) {
                                    element.setAttribute( "thumb_option", this.getValue() );
                                }
                            },
                        ]
                    },
                    {
                        type: 'hbox',
                        widths: [ '50%', '50%', ],
                        children: [
                            {
                                type: 'text',
                                id: 'width',
                                label: 'Width',
                                onChange: function () {
                                    if (this.getValue() != "") {
                                        ratio = this.getValue() / imageWidth;   // get ratio for scaling image
                                        dialog.getContentElement("tab-basic", "height").setValue(Math.ceil(imageHeight * ratio));
                                    }

                                    //getImageUrl();
                                },
                                setup: function( element ) {
                                    this.setValue( element.getAttribute( "width" ) );
                                },
                                // Called by the main commitContent call on dialog confirmation.
                                commit: function( element ) {
                                    element.setAttribute( "width", this.getValue() );
                                }
                            },
                            {
                                type: 'text',
                                id: 'height',
                                label: 'Height',
                                onChange: function () {
                                    getImageUrl();
                                },
                                setup: function( element ) {
                                    this.setValue( element.getAttribute( "height" ) );
                                },
                                // Called by the main commitContent call on dialog confirmation.
                                commit: function( element ) {
                                    element.setAttribute( "height", this.getValue() );
                                }
                            },
                        ]
                    },
                    {
                        type: 'hbox',
                        widths: [ '33%', '33%', '33%' ],
                        children: [
                            {
                                type: 'checkbox',
                                id: 'crop',
                                label: 'Crop',
                            },
                            {
                                type: 'checkbox',
                                id: 'upscale',
                                label: 'Upscale',
                            },
                            {
                                type: 'checkbox',
                                id: 'use_autoscale',
                                label: 'Autoscale',
                            },
                        ]
                    },
                    {
                        type: 'select',
                        id: 'alignment',
                        label : 'Alignment',
                        items: [ ["left"], ["right"] ],
                        setup: function( element ) {
                            this.setValue( element.getAttribute( "align" ) );
                        },
                        // Called by the main commitContent call on dialog confirmation.
                        commit: function( element ) {
                            element.setAttribute( "align", this.getValue() );
                        }
                    },
                    {
                        type: 'hbox',
                        widths: [ '33%', '33%', '33%' ],
                        children: [
                            {
                                type: 'checkbox',
                                id: 'target_blank',
                                label: 'Target blank',
                            },
                            {
                                type: 'checkbox',
                                id: 'front_image',
                                label: 'Front image',
                                setup: function( element ) {
                                    this.setValue( element.getAttribute( "front_image" ) );
                                },
                                // Called by the main commitContent call on dialog confirmation.
                                commit: function( element ) {
                                    element.setAttribute( "front_image", this.getValue() );
                                }
                            }
                        ]
                    },
                ]
            },
            {
                id: 'tab-adv',
                label: 'Advanced Settings',
                elements: [
                    {
                        type: 'text',
                        id: 'css_style',
                        label: 'CSS',
                    },
                ]
            }
        ]
    };
});
