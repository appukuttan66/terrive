addEventListener("message", event => {
  const [rpc, username] = event.data;
  var counter = 0;
  
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url);

  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onreadystatechange = function () {
     if (xhr.readyState === 4) {
       console.log(xhr.status);
       var json = JSON.parse(xhr.responseText);
       while (counter < json.result.length) {
         var not = json.result[counter];
         if(not !== undefined) {
           let x;
           if ( not.type == "reply" ) {
            x = "&reply";
           } else {
            x = "";
           }
           var notifymsg += '<a class="nav-link p-0" href="/'+not.url.replace("@","?u=").replace("/","&p=")+x+'"><div class="alert rounded-0 border-0 alert-light my-0 d-flex align-item-center d-flex"><img src="https://images.ecency.com/u/'+not.msg.split(" ")[0].replace("@","")+'/avatar/small" width="36" height="36" class="rounded-circle flex-shrink-0 me-2" viewBox="0 0 16 16"><div>'+not.msg+'</div></div></a>';
           postMessage(notifymsg)
         }
         
       counter = counter + 1;
       }
     }
 }; 
  var data = '{"jsonrpc":"2.0", "method":"bridge.account_notifications", "params":{"account": "'+username+'","limit":10}, "id":1}';

  xhr.send(data);
});
