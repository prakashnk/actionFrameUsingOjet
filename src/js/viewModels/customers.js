/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your customer ViewModel code goes here
 */

define(['ojs/ojcore', 'knockout', 'jquery', 'actionRepo', 'ojs/ojtable', 'ojs/ojbutton', 'ojs/ojformlayout', 'ojs/ojlabel',
        'ojs/ojinputtext', 'ojs/ojdialog', 'ojs/ojcore', 'ojs/ojselectcombobox'
    ],
    function(oj, ko, $) {
        function DashboardViewModel() {
            var self = this;
            self.leadList = ko.observableArray([{
                Name: "Fetching data"
            }]);
            self.leadData;
            self.leadDataSource = new oj.ArrayTableDataSource(self.leadList);
            self.currentRowIndex = 0;
            self.columnArray = [{
                    "headerText": "Name",
                    "renderer": oj.KnockoutTemplateUtils.getRenderer("name", true),
                    "field": "Name",
                    "sortable": "disabled"
                },
                {
                    "headerText": "Score",
                    "renderer": oj.KnockoutTemplateUtils.getRenderer("score", true),
                    "field": "Score",
                    "sortProperty": "Score"
                },
                {
                    "headerText": "Status",
                    "renderer": oj.KnockoutTemplateUtils.getRenderer("status", true),
                    "field": "StatusCode",
                    "sortProperty": "StatusCode"
                },
                {
                    "headerText": "Rank",
                    "field": "Rank",
                    "renderer": oj.KnockoutTemplateUtils.getRenderer("rank", true)
                },
                {
                    "headerText": "Actions",
                    "sortable": "disabled",
                    "renderer": oj.KnockoutTemplateUtils.getRenderer("actions", true)
                }
            ];
            
            self.val = ko.observable("CH");
            
            // Below are a subset of the ViewModel methods invoked by the ojModule binding
            // Please reference the ojModule jsDoc for additionaly available methods.

            /**
             * Optional ViewModel method invoked when this ViewModel is about to be
             * used for the View transition.  The application can put data fetch logic
             * here that can return a Promise which will delay the handleAttached function
             * call below until the Promise is resolved.
             * @param {Object} info - An object with the following key-value pairs:
             * @param {Node} info.element - DOM element or where the binding is attached. This may be a 'virtual' element (comment node).
             * @param {Function} info.valueAccessor - The binding's value accessor.
             * @return {Promise|undefined} - If the callback returns a Promise, the next phase (attaching DOM) will be delayed until
             * the promise is resolved
             */
            self.handleActivated = function(info) {
                
            };
            
            /**
             * Optional ViewModel method invoked after the View is inserted into the
             * document DOM.  The application can put logic that requires the DOM being
             * attached here.
             * @param {Object} info - An object with the following key-value pairs:
             * @param {Node} info.element - DOM element or where the binding is attached. This may be a 'virtual' element (comment node).
             * @param {Function} info.valueAccessor - The binding's value accessor.
             * @param {boolean} info.fromCache - A boolean indicating whether the module was retrieved from cache.
             */
            self.handleAttached = function(info) {
                // Implement if needed
                
            };


            /**
             * Optional ViewModel method invoked after the bindings are applied on this View. 
             * If the current View is retrieved from cache, the bindings will not be re-applied
             * and this callback will not be invoked.
             * @param {Object} info - An object with the following key-value pairs:
             * @param {Node} info.element - DOM element or where the binding is attached. This may be a 'virtual' element (comment node).
             * @param {Function} info.valueAccessor - The binding's value accessor.
             */
            self.handleBindingsApplied = function(info) {
                
            };

            /*
             * Optional ViewModel method invoked after the View is removed from the
             * document DOM.
             * @param {Object} info - An object with the following key-value pairs:
             * @param {Node} info.element - DOM element or where the binding is attached. This may be a 'virtual' element (comment node).
             * @param {Function} info.valueAccessor - The binding's value accessor.
             * @param {Array} info.cachedNodes - An Array containing cached nodes for the View if the cache is enabled.
             */
            self.handleDetached = function(info) {
                // Implement if needed
            };


      // Below are a set of the ViewModel methods invoked by the oj-module component.
      // Please reference the oj-module jsDoc for additional information.

      /**
       * Optional ViewModel method invoked after the View is inserted into the
       * document DOM.  The application can put logic that requires the DOM being
       * attached here. 
       * This method might be called multiple times - after the View is created 
       * and inserted into the DOM and after the View is reconnected 
       * after being disconnected.
       */
      self.connected = function() {
        // Implement if needed
        var table = document.getElementById('leadTable');
                table.addEventListener('ojBeforeCurrentRow', self.currentRowListener);
                self.actionFramework = new ActionInteractionFramework();
                var hostname = "https://fuscdrmsmc225-fa-ext.us.oracle.com";
                var queryString = "/crmRestApi/searchResources/latest/custom-actions/queries/f786f657-1e14-4487-aa6c-755725315417/results?onlyData=true&entity=Lead&limit=10&sort=LeadId:asc&offset=10";

                return new Promise(function() {
                    $.ajax(hostname + queryString, {
                        method: "GET",
                        dataType: "json",
                          headers: {
                              "Authorization": "Basic " + btoa("mhoope:Welcome1")
                          },
                        success: function(restData) {
                            var leadIdMap = 
                            {
                                300100149043725: 300100005482186,
                                300100149064200: 300100033573901,
                                300100149868057: 300100005482166,
                                300100150077528: 300100033573851,
                                300100150077544: 300100033339620,
                                300100150077547: 300100032852552,
                                300100150077581: 300100031571691,
                                300100150077613: 300100032852655,
                                300100150077615: 300100032352815,
                                300100168868392: 300100032852673 
                            };
                            
                            var data = restData.items;
                            var query = "(";  
                            for(var i in data){
                                var leadId = data[i].LeadId;
                                if(leadIdMap.hasOwnProperty(leadId))
                                    query += leadIdMap[leadId]+","; 
                                else
                                    query += leadId+","; 
                            }
                            query = query.replace(/.$/,")");
                          
                            var settings = {
                               "async": true,
                               "crossDomain": true,
                               "url": "http://slc05mij.us.oracle.com:7001/crmRestApi/resources/latest/leads?onlyData=true&fields=Actions:ActionMetadata;LeadId&limit=10&offset=0&q=LeadId IN "+query,
                               "method": "GET",
                               "headers": {
                                 "authorization": "Basic bWhvb3BlOldlbGNvbWUx",
                                 "rest-framework-version": "2"
                               }
                             };
                             
                            $.ajax(settings).done(function (response) {
                                var actionsList = response.items;
                                var data = self.leadData;
                                for(var i in data)
                                {
                                    data[i].ButtonStyle = '';
                                    for(var j in actionsList)
                                    {   
                                        var leadId = data[i].LeadId;
                                        if(leadIdMap.hasOwnProperty(leadId))
                                            leadId = leadIdMap[data[i].LeadId];
                                    
                                        if(leadId === actionsList[j].LeadId)
                                        {
                                            var actions = actionsList[j].Actions; 
                                            data[i].Actions = actions;
                                            for(var k in actions)
                                            {   
                                                var actionData = actions[k].ActionMetadata;
                                                var actionJSONData = JSON.parse(actionData);
                                                data[i].ButtonName = actionJSONData.name;
                                                data[i].ButtonDisplayName = actionJSONData.label;
                                                break;
                                            }
                                        }
                                    }

                                    if(typeof data[i].ButtonName === 'undefined'){
                                        data[i].ButtonStyle = 'none';
                                    }
                                }
                              
                                for(var j in data){
                                    if(data[j].Rank === null)
                                        data[j].Rank = '';
                                    if(typeof data[j].ButtonDisplayName !== 'undefined')
                                        data[j] = JSON.parse('{ "Name":"'+data[j].Name+'", "StatusCode":"'+data[j].StatusCode+'","LeadId":'+data[j].LeadId+', "Rank":"'+data[j].Rank+'", "Score":'+data[j].Score+', "ButtonStyle":"'+data[j].ButtonStyle+'","ButtonDisplayName":"'+data[j].ButtonDisplayName+'", "Actions":'+JSON.stringify(data[j].Actions)+'}');
                                   else
                                        data[j] = JSON.parse('{ "Name":"'+data[j].Name+'", "StatusCode":"'+data[j].StatusCode+'","LeadId":'+data[j].LeadId+', "Rank":"'+data[j].Rank+'", "Score":'+data[j].Score+'}');
                                }
                                
                                self.leadList(data);
                             }); 

                            self.leadList(data);
                            self.leadData = data;
                            
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            console.log(textStatus, errorThrown);
                        }
                    });
                });
      };

      /**
       * Optional ViewModel method invoked after the View is disconnected from the DOM.
       */
      self.disconnected = function() {
        // Implement if needed
      };

      /**
       * Optional ViewModel method invoked after transition to the new View is complete.
       * That includes any possible animation between the old and the new View.
       */
      self.transitionCompleted = function() {
        // Implement if needed
      };
    







            
            self.clearData = function() {
                self.leadList([]);
            };

            self.currentRowListener = function(event) {
                var actionColumns = document.getElementsByName('actionLauncher');
                actionColumns.forEach(function(action) {
                    action.addEventListener('click', self.handleActionsMenu);
                });
                
                var buttonColumns = document.getElementsByName('buttonAction');
                buttonColumns.forEach(function(button) {
                    button.addEventListener('click', self.actionColumnExecute);
                });

                var data = event.detail;
                var newCurrentRow = data.currentRow;
                self.currentRowIndex = newCurrentRow['rowIndex'];
                self.leadDataSource.at(self.currentRowIndex).then(function(rowObj) {
                    var obj = rowObj['data'];
                    $('#LeadNumber').text(obj.LeadNumber);
                    $('#Description').text(obj.Description);
                    $('#ChannelType').text(obj.ChannelType);
                    $('#CustomerPartyName').text(obj.CustomerPartyName);
                    $('#ProductGroupName').text(obj.ProductGroupName);
                    $('#LeadName').text(obj.Name);
                    
                    
                    var actions = obj.Actions;
                    var buttonDetailContainer = document.getElementById('DetailsButtons');
                    while (buttonDetailContainer.firstChild) 
                    {
                        buttonDetailContainer.removeChild(buttonDetailContainer.firstChild);
                    }        
                            
                    for(var k in actions)
                    {   
                        var actionData = actions[k].ActionMetadata;
                        var actionJSONData = JSON.parse(actionData);
                        var oJbutton = document.createElement("oj-button");
                        var button = document.createElement("button");
                        var div = document.createElement("div");
                        var span = document.createElement("span");
                        span.setAttribute("class", "oj-button-text");
                        span.innerHTML = actionJSONData.label;
                        span.setAttribute("style", "width: 100px");
                        span.setAttribute("title", actionJSONData.label);
                        div.setAttribute("class", "oj-button-label");
                        button.setAttribute("class", "oj-button-button");
                        button.addEventListener('click', self.actionExecute);
                        
                        if(k === "0"){
                            oJbutton.setAttribute("class", "oj-button oj-button-primary oj-component oj-enabled oj-button-full-chrome oj-button-text-only oj-complete oj-default");
                            button.setAttribute("style", "color: white");
                        }else
                            oJbutton.setAttribute("class", "oj-button oj-component oj-enabled oj-button-full-chrome oj-button-text-only oj-complete oj-default");
                        span.setAttribute("id", actionJSONData.name+"##"+actionJSONData.name);
                        button.setAttribute("id", actionJSONData.name);
                        div.appendChild(span);
                        button.appendChild(div);
                        oJbutton.appendChild(button);
                        buttonDetailContainer.appendChild(oJbutton);
                        
                        if(k < (actions.length - 1))
                        {
                            var span = document.createElement("span");
                            span.setAttribute('style', "display:inline-block;width: 0.5vh;");
                            buttonDetailContainer.appendChild(span);
                        }
                    }

                });

            };

            self.handleActionsMenu = function(event) 
            {
                self.leadDataSource.at(self.currentRowIndex).then(function(rowObj) 
                {
                    var actions = rowObj['data'].Actions;// self.actionFramework.getActionsForContext(rowObj['data']);
                    var menuElement = document.getElementById("myMenu");
                    while (menuElement.firstChild) 
                    {
                        menuElement.removeChild(menuElement.firstChild);
                    }
                  
                    for(var k in actions)
                    {   
                        if(k === "0")
                            continue;
                        
                        var option = document.createElement("oj-option");
                        var aHref = document.createElement("a");
                        var actionData = actions[k].ActionMetadata;
                        var actionJSONData = JSON.parse(actionData);
                        
                        option.setAttribute("value", actionJSONData.name);
                        option.setAttribute("class", "oj-menu-item oj-complete");
                        option.setAttribute("role", "presentation");
                        aHref.setAttribute("href", "#");
                        aHref.setAttribute("ojmenu", "opt");
                        aHref.setAttribute("tabindex", "-1");
                        aHref.setAttribute("role", "menuitem");
                        aHref.innerText = actionJSONData.label;
                        option.setAttribute("id", actionJSONData.name+'##'+event.path[3].id);
                        option.appendChild(aHref);
                        menuElement.appendChild(option);
                    }
                    
                    event.path[0].id = 'img_' + event.path[3].id;
                    menuElement.setAttribute('open-options.launcher', event.path[0].id);
                    menuElement.open(event);
                });
            };

            self.actionColumnExecute = function(event) 
            {
                var idSplit = event.target.id.split("##");
                var actionName = idSplit[0];
                var actionLaunchedFrom = event.target.id;
                var userInput = null;
                
                self.leadDataSource.at(self.currentRowIndex).then(function(rowObj) 
                {
                    userInput = self.actionFramework.executeAction(actionName, rowObj['data'].Actions, self.restApiResponse);
                    
                    if(userInput !== null){
                        self.inList = [];
                        self.needUserInput(actionName, actionLaunchedFrom, userInput);
                    }
                });
            };
            
            self.actionExecute = function(event) 
            {
                var idSplit = event.target.id.split("##");
                var actionName = idSplit[0];
                var actionLaunchedFrom = idSplit[1];
                var userInput = null;
                
                self.leadDataSource.at(self.currentRowIndex).then(function(rowObj) 
                {
                    userInput = self.actionFramework.executeAction(actionName, rowObj['data'].Actions, self.restApiResponse);
                    
                    if(userInput !== null){
                        self.inList = [];
                        self.needUserInput(actionName, actionLaunchedFrom, userInput);
                    }
                });
            };
            
            
            self.listOfValues = function(input){
                
                return new Promise(function(resolve){
                    var hostname = "http://localhost:3000";
                    var queryString = "/RejectReasonCodeList";
                    $.ajax(hostname + queryString, {
                        method: "GET",
                        dataType: "json",
                        success: function(data) {
                            var valueData = {};
                            valueData.input = input;
                            valueData.listData = data;
                            resolve(valueData);
                        }
                    });
                });
            };
            
            
            self.typeAheadList = function(input){
                return new Promise(function(resolve){
                    var value = 'Josh';
                    var hostname = self.actionFramework.hostname();
                    var queryString = input.validValues.href; 
                    var fields = input.validValues.fields;
                    if(typeof fields !== 'undefined')
                        queryString += '?fields='+fields;
                    
                    var q = input.validValues.q;
                    if(typeof q !== 'undefined'){
                        var qString = '&q=';
                        for(var i in q){
                            qString += q[i].field+" "+q[i].operator+" "+value+"%";
                        }
                        queryString += qString+"&limit=10";
                    }
                    
                    $.ajax(hostname + queryString, {
                        method: input.validValues.method,
                        contentType: input.validValues.contentType,
                        headers: {
                            "Authorization": self.actionFramework.authorization()
                        },
                        success: function(data) {
                            var valueData = {};
                            valueData.input = input;
                            valueData.listData = data;
                            resolve(valueData);
                        }
                    });
                });
            };
            
            self.needUserInput = function(action, actionLaunchedFrom, userInput){
                
                var userInputContent = document.getElementById('UserInputContent');
                self.userInput = userInput;
                if(self.inList.length === 0)
                {   
                    var searchContact = document.getElementById("searchContact");
                    searchContact.setAttribute('style', "display: none");
                    var container = document.getElementById("container");
                    container.appendChild(searchContact);       
                            
                    while (userInputContent.firstChild) 
                    {   
                        userInputContent.removeChild(userInputContent.firstChild);
                    }  
                }
                
                for(var i in userInput){
                    var input = userInput[i];
                    self.input = input;
                    
                    if(self.inList.includes(input.name))
                        continue;
                    
                    var requiredHtml = input.mandatory ? '<span class="oj-label-required-icon oj-component-icon" role="img" title="Required" aria-label="Required"></span>' : '';
                    
                    if(typeof input.validValues !== 'undefined'){
                        
                        if(input.type === 'string'){
                            self.listOfValues(input).then(function(data){
                                var selectOneMap = data.listData;
                                var input = data.input;
                                var ojflex = document.createElement("div");
                                ojflex.setAttribute("class", "oj-flex");

                                var selectHtml = '<select name="selectOne" id="'+action+'_selectOne">';
                                Object.keys(selectOneMap).forEach(function(key) {
                                    selectHtml += '<option value="'+key+'">'+selectOneMap[key]+'</option>';
                                });

                                ojflex.innerHTML = '<div class="oj-flex-item"><oj-label for="control1" class="oj-label oj-component oj-complete"><div class="oj-label-group">'+requiredHtml+'<label data-oj-internal="" id="ui-id-17" for="control1" class="oj-component-initnode">'+input.displayLabel+'</label></div></oj-label></div>'+selectHtml;
                                userInputContent.appendChild(ojflex);
                                var span = document.createElement("span");
                                span.setAttribute('style', "display:inline-block;height: 0.5vh;");
                                userInputContent.appendChild(span);
                                self.inList.push(input.name);
                                self.needUserInput(action, actionLaunchedFrom, userInput);
                            });
                            break;
                        } else if(input.type === 'integer'){
                            
                            var ojflex = document.createElement("div");
                            ojflex.setAttribute("class", "oj-flex");
                            ojflex.innerHTML =  '<div class="oj-flex-item"><oj-label for="control1" class="oj-label oj-component oj-complete"><div class="oj-label-group">'+requiredHtml+'<label data-oj-internal="" id="ui-id-17" for="control1" class="oj-component-initnode">'+input.displayLabel+'</label></div></oj-label></div>';
                            var searchContact = document.getElementById("searchContact");
                            searchContact.setAttribute('style', "");
                            var value = searchContact.firstChild.value;
                            if(value !== ''){
                                searchContact.firstChild.value = '';
                            }
                            ojflex.appendChild(searchContact);
                            userInputContent.appendChild(ojflex);
                            var span = document.createElement("span");
                            span.setAttribute('style', "display:inline-block;height: 0.5vh;");
                            userInputContent.appendChild(span);
                            self.inList.push(input.name);
                            self.needUserInput(action, actionLaunchedFrom, userInput);
                            break;
                        }
                    }else if(input.type === 'string'){
                        var ojflex = document.createElement("div");
                        ojflex.setAttribute("class", "oj-flex");
                        ojflex.innerHTML = '<div class="oj-flex-item"><oj-label for="control2" class="oj-label oj-component oj-complete"><div class="oj-label-group">'+requiredHtml+'<label data-oj-internal="" id="ui-id-18" for="control2|input" class="oj-component-initnode">'+input.displayLabel+'</label></div></oj-label></div>\n\
                                            <div class="oj-flex-item"><oj-text-area id="control2" rows="6" class="oj-textarea oj-form-control oj-component oj-complete"><textarea data-oj-internal="" rows="6" placeholder="" class="oj-textarea-input oj-component-initnode" id="'+action+'_textArea"></textarea></oj-text-area></div>';               
                        userInputContent.appendChild(ojflex);
                        self.inList.push(input.name);
                    } 
                    
                    var span = document.createElement("span");
                    span.setAttribute('style', "display:inline-block;height: 0.5vh;");
                    userInputContent.appendChild(span);
                }
                
                self.action = action;
                var dialog = document.getElementById('modelessDialog1');
                $("#modelessDialog1").ojDialog("option", "position", {
                    "of": document.getElementById(actionLaunchedFrom),
                    "at": "right bottom",
                    "my": "right top"
                });
                dialog.open();
                
            };

            self.handleOKClose = function(event) {
                var userInputWithData = {};
                var errorAttributes = '';
                for(var i in self.userInput){
                    var input = self.userInput[i];
                    if(input.type === 'string' && typeof input.validValues === 'undefined'){
                        var value = $("#"+self.action+"_textArea").val();
                        if(input.mandatory && value === ''){
                           
                            errorAttributes += input.displayLabel+', ';
                        }
                        userInputWithData[input.name] =  btoa(value);
                    } else{
                        if(input.mandatory && value === ''){
                            
                            errorAttributes += input.displayLabel+', ';
                        }
                        if(typeof self.partyId !== 'undefined')
                            userInputWithData[input.name] = self.partyId;
                        else
                            userInputWithData[input.name] = $("#"+self.action+"_selectOne :selected").val();
                    }
                }
                
                if(errorAttributes !== ''){
                    var userInputContent = document.getElementById('UserInputContent');
                    var errorTextElement = document.createElement("p");
                    errorTextElement.innerHTML = '<font color="red">Enter mandatory values! '+errorAttributes.trim().replace(/.$/,'.')+'</font>';
                    userInputContent.appendChild(errorTextElement);
                    return;
                }
                
                document.querySelector("#modelessDialog1").close();
                self.leadDataSource.at(self.currentRowIndex).then(function(rowObj) 
                {
                    self.actionFramework.executeActionWithUserInput(self.action, rowObj['data'], userInputWithData, self.restApiResponse);
                });
            };
            
            self.handleCancelClose = function(event) {
                document.querySelector("#modelessDialog1").close();
            };
            
            self.restApiResponse = function(data){
                alert('Rest Response successful');
            };
            
            self.handleRawValueChanged = function(event){
                if(event.detail.value.length >= 3)
                    self.handleContactList(event);
            };
            
            self.selectContact = function(event){
                
                var idSplit = event.target.id.split("##");
                var name = idSplit[1];
                var searchContact = document.getElementById("searchContact");
                searchContact.setAttribute('style', 'display: none');
                var text = document.createElement('div');
                text.setAttribute('id', 'valueText');
                text.innerText =  name;
                searchContact.parentElement.appendChild(text);
                self.partyId = idSplit[0];
            };
            
            self.handleContactList = function(event) 
            {   
                var value = event.detail.value;
                var input = self.input;
                var hostname = self.actionFramework.hostname();
                var queryString = input.validValues.href; 
                    var fields = input.validValues.fields;
                    if(typeof fields !== 'undefined')
                        queryString += '?fields='+fields;
                    
                    var q = input.validValues.q;
                    if(typeof q !== 'undefined'){
                        var qString = '&q=';
                        for(var i in q){
                            qString += q[i].field+" "+q[i].operator+" "+value+"%";
                        }
                        queryString += qString+"&limit=10";
                    }
                    

                $.ajax(hostname + queryString, {
                    method: input.validValues.method,
                    contentType: input.validValues.contentType,
                    headers: {
                        "Authorization": self.actionFramework.authorization()
                    },
                    success: function(contactData) {
                        
                        var menuElement = document.getElementById("contactListMenu");
                        while (menuElement.firstChild) 
                        {
                            menuElement.removeChild(menuElement.firstChild);
                        }
                        
                        var data = contactData.items;

                        for(var k in data)
                        {   
                            var option = document.createElement("oj-option");
                            var aHref = document.createElement("a");

                            option.setAttribute("value", data[k].PartyId);
                            option.setAttribute("class", "oj-menu-item oj-complete");
                            option.setAttribute("role", "presentation");
                            aHref.setAttribute("href", "#");
                            aHref.setAttribute("ojmenu", "opt");
                            aHref.setAttribute("tabindex", "-1");
                            aHref.setAttribute("role", "menuitem");
                            aHref.innerText = data[k].ContactUniqueName;
                            option.setAttribute("id", data[k].PartyId+'##'+data[k].ContactUniqueName);
                            option.appendChild(aHref);
                            menuElement.appendChild(option);
                        }
                        event.path[0].id = 'img_' + event.path[3].id;
                        menuElement.setAttribute('open-options.launcher', event.path[0].id);
                        menuElement.open(event);
                    }
                });
            };
         
        }
       
        return DashboardViewModel;
    }
);