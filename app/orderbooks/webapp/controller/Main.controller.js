sap.ui.define(
  [
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (BaseController, JSONModel, Filter, FilterOperator) {
    "use strict";

    return BaseController.extend("ns.orderbooks.controller.App", {
      onInit: function () {
        this.getView().setModel(
          new JSONModel({ selectedQuantity: 1, itemSelected: true }),
          "userSelection"
        );
      },
      onSelect: function (oEvent) {
        let oModel = this.getView().getModel("userSelection");
        let selectedModelPath = oEvent
          .getSource()
          .getBindingContext()
          .getPath();

        this.getView()
          .getModel()
          .bindContext(selectedModelPath)
          .requestObject()
          .then(function (value) {
            oModel.setProperty("/selectedModelPath", selectedModelPath);
            oModel.setProperty("/selectedModelData", value);
            oModel.setProperty("/itemSelected", true);
          });
      },
      onSubmitOrder: function () {
        let oView = this.getView();
        let oModel = oView.getModel();
        let userSelectionData = oView.getModel("userSelection").getData();
        if (!userSelectionData.selectedModelData) {
          oView.byId("orderStatus").setText("Select a line!");
          oView.byId("orderStatus").setState("Error");
          return;
        }
        let oObjectBinding = oView.byId("orderFlexBox").getObjectBinding();

        oObjectBinding.setParameter(
          "book",
          userSelectionData.selectedModelData.ID
        );
        oObjectBinding.setParameter(
          "quantity",
          userSelectionData.selectedQuantity
        );
        oObjectBinding.execute().then(
          function () {
            oModel.refresh();
            oView.byId("orderStatus").setText(
              `Order successful 
                              (${userSelectionData.selectedModelData.title}, 
                              ${userSelectionData.selectedQuantity} pcs.)`
            );
            oView.byId("orderStatus").setState("Success");
          },
          function (oError) {
            oView.byId("orderStatus").setText(oError.message);
            oView.byId("orderStatus").setState("Error");
          }
        );

      },
      onSearch: function (oEvent) {
        var aFilter = [];
        var sQuery = oEvent.getParameter("newValue");
        if (sQuery) {
          aFilter.push(new Filter("title", FilterOperator.Contains, sQuery));
        }
        var oList = this.byId("booksTable");
        var oBinding = oList.getBinding("items");
        oBinding.filter(aFilter);

        let oModel = this.getView().getModel("userSelection");
        oModel.setProperty("/selectedModelPath", {});
        oModel.setProperty("/selectedModelData", {});
        this.getView().byId("orderStatus").setText("");
        oModel.setProperty("/itemSelected", false);
      },
    });
  }
);
