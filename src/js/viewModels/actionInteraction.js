/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var actionFramework = (function ()
{
    var actionData = {};
    function loadActionForObjects(callback)
    {
        return new Promise(function() {

          //  var hostname = "http://rws66292fwks.us.oracle.com:7101/crmUI/actionResources";
          //  var queryString = "/1?object="+'Lead';
          //  var hostname = "https://my-json-server.typicode.com/prakashnk/demo";
              var hostname = "http://localhost:3000";
            var queryString = "/actions?object=" + 'Lead';

            $.ajax(hostname + queryString, {
                method: "GET",
                dataType: "json",
                headers: {
                    "Authorization": "none"
                },
                success: function(data) {
                    for(var i in data){
                        var eachAction = data[i];
                        var jsonAction = {};
                        jsonAction[eachAction.name] = eachAction;
                        actionData[eachAction.name] = jsonAction;
                    };
                    callback();
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(textStatus, errorThrown);
                }
            });
        });
    }
    
    function loadActionMetadata(){
        actionData[eachAction.name] = jsonAction;
    }


    function getActionsForContext(rowContext)
    {   
        var actions = [];
        for (var key in actionData) {
            var eachAction = actionData[key][key];
            if (eachAction.visibility) {
                var expression = eachAction.visibility.condition; //'StatusCode=="UNQUALIFIED"';
                var myfilter = compileExpression(expression.replace(/'/g, "__SINGLE_QUOTE__").replace(/"/g, /'/g).replace(/__SINGLE_QUOTE__/g, '"'));
                if (myfilter(rowContext) === 0)
                    continue;
            }
            actions.push(eachAction.name+'##'+eachAction.label);
        }
        return actions;
    }

    function executeAction(actionName, actionsList, restApiResponse)
    {   
        for(var k in actionsList)
        {   
            var actionData = actionsList[k].ActionMetadata;
            var actionJSONData = JSON.parse(actionData);
            if(actionName === actionJSONData.name){
                if(actionJSONData.api)
                {
                    if(actionJSONData.api.userInput){
                        var userInput = actionJSONData.api.userInput; 
                        var requestPayload = JSON.parse(JSON.stringify(actionJSONData.api.rest.requestPayload));
                        for(var i in userInput){
                            var input = userInput[i];
                            for(var j in requestPayload){
                                var payload = requestPayload[j];
                                if(payload.value === input.name){
                                    input.mandatory = payload.mandatory;
                                    requestPayload.splice(j, 1);
                                    break;
                                }
                            }
                        }
                        return userInput;
                    }

                    if(actionJSONData.api.rest)
                    { 
                        restApiCall(actionJSONData, processPayload(actionJSONData.api.rest.requestPayload), restApiResponse);           
                    }
                }
                break;
            }
        }
        return null;
    };

    function executeActionWithUserInput(actionName, rowContext, userInput, restApiResponse)
    {   
        var actionsList = rowContext.Actions;
        for(var k in actionsList)
        {   
            var actionData = actionsList[k].ActionMetadata;
            var actionJSONData = JSON.parse(actionData);
            if(actionName === actionJSONData.name){
                if(actionJSONData.api)
                {
                    if(actionJSONData.api.rest)
                    { 
                        restApiCall(actionJSONData, processPayload(actionJSONData.api.rest.requestPayload, userInput, rowContext), rowContext, restApiResponse);
                    }
                }
            }
        }
    };
    
    function processPayload(requestPayload, userInput, rowContext){
        var payload = {};
        for(var i in requestPayload){
            var name = requestPayload[i].name;
            var value = requestPayload[i].value;
            if(value.startsWith('$')){
                payload[name] = userInput[value];
            } else if(typeof rowContext[value] !== 'undefined')
            {
                payload[name] = rowContext[value];
            } else{
                payload[name] = value;
            }
        }
        return payload;
    }
    
    function getHostName(){
        return "http://slc05mij.us.oracle.com:7001"; //"https://fuscdrmsmc349-fa-ext.us.oracle.com";
    }
    
    function getAuthorization(){
        return "Basic " + btoa("mhoope:Welcome1");
    }

    function restApiCall(action, payload, rowContext, restApiResponse)
    {
        return new Promise(function() 
        {
            var url = getHostName()+action.api.rest.href;
            var urlBinding = action.api.rest.urlBinding;
            if(url.includes("$")){
              var uriConstructs =  url.split("/");
              for(var j in uriConstructs){
                  if(uriConstructs[j].startsWith('$')){
                      url = url.replace(uriConstructs[j], rowContext[urlBinding[uriConstructs[j]]]);
                  }
              }
            }
            
            var method = action.api.rest.method;
            var contentType = action.api.rest.contentType;
           
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": url,
                "method": method,
                "headers": {
                  "authorization":  getAuthorization(),
                  "content-type": contentType
                },
                "processData": false,
                "data": JSON.stringify(payload) 
            };

            $.ajax(settings).done(function (response) {
              restApiResponse(response);
            });
           
         /*   $.ajax(uri, 
            {
                method: method,
                dataType: dataType,
                headers: {
                    "Authorization": "Basic " + btoa("mhoope:Welcome1")
                },
                data: {  
                        "NoteTxt": btoa('Test It'),
                        "NoteTypeCode": "GENERAL"
                     },
                contentType: "application/json",
                success: function(data) {
                   restApiResponse(data);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(textStatus, errorThrown);
                    restApiResponse(textStatus);
                }
            });*/
        });
    };
    
    return {
        loadActionForObjects : function(objects){
            loadActionForObjects(objects);
        },
        getActionsForContext : function(rowContext){
            return getActionsForContext(rowContext);
        },
        executeAction : function(actionName, rowContext, restApiResponse){
            return executeAction(actionName, rowContext, restApiResponse);
        },
        executeActionWithUserInput : function(actionName, rowContext, userInput, restApiResponse){
            return executeActionWithUserInput(actionName, rowContext, userInput, restApiResponse);
        },hostname : function(){
            return getHostName();
        },authorization : function(){
            return getAuthorization();
        }
    };
})();
