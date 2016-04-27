(function(jQuery){
    CKEDITOR.plugins.add( 'filerimage', {
        lang: 'en,it',
        icons: 'filerimage',
        init: function( editor ) {
            that = this,
            lang = editor.lang.filerimage,
            editor.addCommand( 'filerImageDialog', new CKEDITOR.dialogCommand( 'filerImageDialog' ) );

            editor.ui.addButton( 'FilerImage', {
                label: lang.name,
                command: 'filerImageDialog',
                toolbar: 'insert',
                icon: 'filerimage'
            });

            if ( editor.contextMenu ) {
                editor.addMenuGroup( 'Filer' );
                editor.addMenuItem( 'imageItem', {
                    label: lang.edit,
                    icon: this.path + 'icons/filerimage.png',
                    command: 'filerImageDialog',
                    group: 'Filer'
                });

                editor.contextMenu.addListener( function( element ) {
                    if ( element.getAscendant( 'img', true ) ) {
                        return { imageItem: CKEDITOR.TRISTATE_OFF };
                    }
                });
            }
            jQuery.get('/filebrowser_filer/filer_version/', { }, function(data) {
                editor.filer_version = data;
                if(data == '1.1' || data == '1.2') {
                    CKEDITOR.scriptLoader.load( that.path + '../../../../filer/js/addons/popup_handling.js' );
                }
                else if(data == '1.0') {
                    CKEDITOR.scriptLoader.load( that.path + '../../../../filer/js/popup_handling.js' );
                }
                CKEDITOR.dialog.add( 'filerImageDialog', that.path + 'dialogs/filerImageDialog.js' );
            });
            
            jQuery.get('/filebrowser_filer/use_thumbnailoptions_only/', { }, function(data) {
                editor.use_thumbnailoptions_only = data
            });

            jQuery.get('/filebrowser_filer/url_reverse/',
                { url_name: 'admin:filer-directory_listing-last' },
                function(data) {

            });

            var dialog = CKEDITOR.dialog.getCurrent();
        }
    });
})($||django.jQuery||jQuery);
