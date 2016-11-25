export var DownloadButtonItems;

DownloadButtonItems = function(refs, layout) {
    var uiManager = refs.uiManager,
        i18n = refs.i18nManager.get();

    return [
        {
            xtype: 'label',
            text: i18n.table_layout,
            style: 'padding:7px 5px 5px 7px; font-weight:bold; border:0 none'
        },
        {
            text: 'Microsoft Excel (.xls)',
            iconCls: 'ns-menu-item-tablelayout',
            handler: function() {
                uiManager.openTableLayoutTab(layout, 'xls');
            }
        },
        {
            text: 'CSV (.csv)',
            iconCls: 'ns-menu-item-tablelayout',
            handler: function() {
                uiManager.openTableLayoutTab(layout, 'csv');
            }
        },
        {
            text: 'HTML (.html)',
            iconCls: 'ns-menu-item-tablelayout',
            handler: function() {
                uiManager.openTableLayoutTab(layout, 'html+css', true);
            }
        }
    ];
};
