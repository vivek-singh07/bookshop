sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],
  function (Controller, JSONModel, Filter, FilterOperator) {
    "use strict";
    return Controller.extend("sap.codejam.controller.App", {
      onInit: function () {
        this.getView().setModel(
          new JSONModel({ selectedQuantity: 1 , itemSelected: true}),
          "userSelection"
        );
      },
      onSelect: function (oEvent) {
        let oModel = this.getView().getModel("userSelection");
        let selectedModelPath = oEvent
          .getSource()
          .getBindingContext()
          .getPath();
        let selectedModelData = oEvent
          .getSource()
          .getModel()
          .getProperty(selectedModelPath);
        oModel.setProperty("/selectedModelPath", selectedModelPath);
        oModel.setProperty("/selectedModelData", selectedModelData);
        oModel.setProperty("/itemSelected", true)
      },
      onSubmitOrder: function () {
        let oView = this.getView();
        let userSelectionData = oView.getModel("userSelection").getData();
        if (!userSelectionData.selectedModelData) {
          oView.byId("orderStatus").setText("Select a line!");
          oView.byId("orderStatus").setState("Error");
          return;
        }
        let reqSettings = {
          url: "/browse/submitOrder",
          method: "POST",
          timeout: 0,
          headers: {
            "Content-type": "application/json",
          },
          data: JSON.stringify({
            book: userSelectionData.selectedModelData.ID,
            quantity: userSelectionData.selectedQuantity,
          }),
        };

        jQuery
          .ajax(reqSettings)
          .done(function (response) {
            oView.byId("orderStatus").setText(
              `Order successful 
                    (${userSelectionData.selectedModelData.title}, 
                    ${userSelectionData.selectedQuantity} pcs.)`
            );
            oView.byId("orderStatus").setState("Success");
            let userSelectedPath = oView
              .getModel("userSelection")
              .getProperty("/selectedModelPath");
            oView
              .getModel()
              .setProperty(userSelectedPath + "/stock", response.stock);
            oView
              .getModel("userSelection")
              .setProperty("/selectedModelData/stock", response.stock);
          })
          .fail(function (response) {
            oView.byId("orderStatus").setText("Error");
            oView.byId("orderStatus").setState("Error");
          });
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
        oModel.setProperty("/itemSelected", false)
      },
    });
  }
);
