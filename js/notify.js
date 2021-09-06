addEventListener("message", event => {
  const [url, username] = event.data;
  var counter = 0;
  var lastRead = "";
  
  bridge(username,url,'',"unread_notifications",function(r) {
    lastRead = new Date(JSON.parse(r).result.lastread)
  })
  
  bridge(username,url, ',"limit": 20',"account_notifications",function(res){
   
    var json = JSON.parse(res);
    while (counter < json.result.length) {
    var not = json.result[counter];
    if(not !== undefined) {
       let x, alert;
       if ( not.type == "reply" || not.type == "reply_comment" ) {
        x = "&reply";
       } else {
        x = "";
       }
      var date = new Date(not.date)
      
      if(date > lastRead) {
        alert = "alert-primary";
      } else {
        alert = "alert-light";
      }
        
        var notifymsg = '<a class="nav-link p-0" href="/'+not.url.replace("@","?u=").replace("/","&p=")+x+'"><div class="alert rounded-0 border-0 '+alert+' my-0 d-flex align-item-center d-flex"><img src="https://images.ecency.com/u/'+not.msg.split(" ")[0].replace("@","")+'/avatar/small" width="36" height="36" class="rounded-circle flex-shrink-0 me-2" viewBox="0 0 16 16"><div>'+not.msg+'</div></div></a>';
        postMessage(notifymsg)
       }   
      counter = counter + 1;
    }
  })
});

function bridge(username,url,params,type,callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url);

  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onreadystatechange = function () {
     if (xhr.readyState === 4) {
       callback(xhr.responseText)
     }
 }; 
  var data = '{"jsonrpc":"2.0", "method":"bridge.'+type+'", "params":{"account": "'+username+'"'+params+'}, "id":1}';

  xhr.send(data);
}
