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
            if(data == '1.1') {
                CKEDITOR.scriptLoader.load( that.path + '../../../../filer/js/addons/popup_handling.js' );
            }
            else if(data == '1.0') {
                CKEDITOR.scriptLoader.load( that.path + '../../../../filer/js/popup_handling.js' );
            }
            CKEDITOR.dialog.add( 'filerImageDialog', that.path + 'dialogs/filerImageDialog.js' );
        });

        var dialog = CKEDITOR.dialog.getCurrent();

        jQuery.get(
            '/filebrowser_filer/url_reverse/',
            { url_name: 'admin:filer-directory_listing-last' },
            function(data) {
            
        });
    }
});