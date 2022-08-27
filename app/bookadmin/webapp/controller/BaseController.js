sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/core/routing/History",
    "ns/bookadmin/model/formatter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, UIComponent, History, formatter) {
        "use strict";

        return Controller.extend("ns.bookadmin.controller.BaseController", {
            formatter: formatter,

            getModel: function (sName) {
                return this.getView().getModel(sName);
            },

            setModel: function (oModel, sName) {
                return this.getView().setModel(oModel, sName);
            },

            getResourceBundle: function() {
                return this.getOwnerComponent().getModel("i18n").getResourceBundle();
            },

            getRouter: function () {
                return UIComponent.getRouterFor(this);
            },

            navTo: function (sTarget, mParameters, sbReplace) {
                this.getRouter().navTo(sTarget, mParameters, sbReplace);
            },

            navBack: function () {
                let sPreviousHash = History.getInstance().getPreviousHash();
                if (sPreviousHash !== undefined) {
                    window.history.back();
                } else {
                    this.getRouter().navTo("appHome", {}, true);
                }
            }
        });
    });
