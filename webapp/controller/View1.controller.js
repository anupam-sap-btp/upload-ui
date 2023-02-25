sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (MessageToast, Controller) {
        "use strict";

        return Controller.extend("uploadxlsx.controller.View1", {
            onInit: function () {

            },

            handleUploadComplete: function(oEvent) {
                var sResponse = oEvent.getParameter("response"),
                    iHttpStatusCode = parseInt(/\d{3}/.exec(sResponse)[0]),
                    sMessage;
    
                if (sResponse) {
                    sMessage = iHttpStatusCode === 200 ? sResponse + " (Upload Success)" : sResponse + " (Upload Error)";
                    MessageToast.show(sMessage);
                }
            },
    
            handleUploadPress: function(oEvent) {
                
                debugger;
                //Get the model details which contains endpoint information
                var oModel = this.getView().getModel();
                
                
                var oFileUploader = this.getView().byId("fileUploader");
                var file = oFileUploader.oFileUpload.files[0];

                //In this part I was trying to read the excel data and send it to the CF service
                //via OData V4 call. But could not get the exact payload to be populated
                debugger;
                var reader = new FileReader();
                var that = this;    
                reader.onload = function(e) {
                    console.log('Debug here');
                    debugger;
                    var data = e.target.result;
                    
                    var oModel1 = that.getView().getModel();
                    var oAction1 = oModel1.bindContext('/uploadComputers(...)');

                    //Trying to populate the payload here. 
                    var data1 = new FormData();
                    data1.append('xlsx', e.target.result);
                    // oAction1.setParameter('xlsx', e.target.result);
                    oAction1.setParameter('data', data1);

                    oAction1.execute().then(
                        function(val1){
                            var oActionContext1 = oAction1.getBoundContext();
                            console.log(oActionContext1.getObject().value);
                            debugger;
                        }.bind(this)
                    ).catch(err1 => {
                        debugger;});
                };
                
                reader.readAsBinaryString(file);
                debugger;
                
                //In this part I tried to use the upload function of the 
                //FileUploader component of UI5. But seems it is trying the 
                //POST operation and we might need an action. 
                oFileUploader.checkFileReadable().then(function() {
                    debugger;
                    var oParam = new sap.ui.unified.FileUploaderParameter({
                        name: "xlsx",
                        value: file
                    });
                    oFileUploader.addHeaderParameter(oParam);
                    var sUrl = oModel.sServiceUrl + "uploadComputers";
                    oFileUploader.setUploadUrl(sUrl);
                    oFileUploader.upload();
                }, function(error) {
                    debugger;
                    MessageToast.show("The file cannot be read. It may have changed.");
                }).then(function() {
                    debugger;
                    oFileUploader.clear();
                });
            }
        });
    });
