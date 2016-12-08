export var LayoutButton;

LayoutButton = function(refs) {
    var uiManager = refs.uiManager;

    var i18n = refs.i18nManager.get();

    return Ext.create('Ext.button.Button', {
        text: i18n.layout,
        menu: {},
        handler: function() {
            var name = 'layoutWindow';
            (uiManager.get(name) || uiManager.reg(LayoutWindow(c), name)).show();
        }
    });
};
