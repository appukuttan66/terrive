var client = new hivesigner.Client({
  app: 'terrive',
  callbackURL: 'https://terrive.one/auth.html',
});
var loginType = localStorage.getItem('type')
var accessToken = localStorage.getItem('token')
var rpc = "https://api.hive.blog"

var imgHoster = "https://images.ecency.com"

client.setAccessToken(accessToken)

hive.api.setOptions({ url: rpc });

var username = localStorage.getItem("username");
var eleHome = document.getElementById("home");
var eleDiscover= document.getElementById("discover");
var eleProfileGrid = document.querySelector("#profile-grid .row");
var eleProfileVideo = document.querySelector("#profile-video .row");
var md = new remarkable.Remarkable({html: true,})
md.use(remarkable.linkify)

function toolip () {
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
  })
}

var toastEl = document.querySelector('.toast');
var toast = new bootstrap.Toast(toastEl)

function notify(body,fill) {
  var biInfo = document.querySelector(".bi-info")
  if (fill) {
    biInfo.setAttribute("fill",fill)
  } else {
    biInfo.setAttribute("fill","var(--bs-success)"); 
  }
  document.querySelector("#update-notify-body").innerHTML = body;
  toast.show()
  setTimeout(toast.hide(),3000)
}

function keychainLogin(){
  var keychainUser = prompt("username")
  hive_keychain.requestEncodeMessage( keychainUser, keychainUser, "#login-true", "Posting",
    function (response) {
      console.log("endoding key ...");
      console.log(response);
      if ( response.success == true ) {
        hive_keychain.requestVerifyKey( keychainUser, response.result, "Posting",
        function (res) {
          console.log("verifying key ...");
          console.log(res);
          if (res.result == "#login-true") {
            localStorage.setItem("username",keychainUser);
            localStorage.setItem("type","keychain");
            window.setTimeout(location.reload(),500);
          } else { notify("error while login","var(--bs-danger)") }
        }
        );
      }
    }
  );
}

function logOut () {
  localStorage.clear()
  setTimeout(location.reload(),500)
}


function postTypeSelector(type) {
  if (type == 'image') {
    document.getElementById("upload-input-wrap").innerHTML = '<input id="input-image-ele" type="file" accept="image/*" hidden><div class="position-relative"><label class="position-absolute end-0 m-1-5" for="input-image-ele"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="var(--bs-primary)" class="bi bi-plus-square-fill" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0z"/></svg></label><input id="upload-image-url" onchange="loadPostPreview(this.value)" type="text" class="form-control" placeholder="URLs ( Seperated by Space )"></div><br>'; 
  } else if (type == 'video') {
    document.getElementById("upload-input-wrap").innerHTML = '<input id="input-video-ele" type="file" accept="video/*" hidden><div class="position-relative"><label class="position-absolute end-0 m-1-5" for="input-video-ele"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="var(--bs-primary)" class="bi bi-plus-square-fill" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0z"/></svg></label><input id="upload-video-url" onchange="loadPostPreview(this.value,this.id)" type="text" class="form-control" placeholder="URL of Video"></div><br><input id="upload-video-url-cover" type="text" class="form-control" placeholder="URL of Cover Image"><br>';
  }
}

function loadPostPreview(src,id){
  document.getElementById("upload-preview").innerHTML = '<div class="text-center"><div class="spinner-grow text-primary" role="status"></div></div>';
  if (id == 'upload-video-url') {
    document.getElementById("upload-preview").innerHTML = '<video id="upload-video-preview" src="'+src+'" class="w-100" preload="metadata" controls></video>';
    window.setTimeout(function(){
      var d = document.getElementById("upload-video-preview").duration.toFixed(0);
      if (d > 60) {
        document.getElementById("upload-video-url").value = "";
        document.getElementById("upload-preview").innerHTML = "";
        notify("Video should be less than 60sec","var(--bs-danger)")
      }
    } ,500)
  }
  else {
    var images = src.split(' ')
    if (images.length == 1) {
      document.getElementById("upload-preview").innerHTML = '<img src="'+images[0]+'" class="w-100 rounded mb-3">'
    } 
    else if (images.length > 1) {
      document.getElementById("upload-preview").innerHTML = '<div id="carouselPreviewControls" class="carousel slide mb-3" data-bs-ride="carousel"><div class="carousel-inner"></div><button class="carousel-control-prev" type="button" data-bs-target="#carouselPreviewControls" data-bs-slide="prev"><span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="visually-hidden">Previous</span></button><button class="carousel-control-next" type="button" data-bs-target="#carouselPreviewControls" data-bs-slide="next"><span class="carousel-control-next-icon" aria-hidden="true"></span><span class="visually-hidden">Next</span></button></div>'
      var i = 0;
      while ( i < images.length ) {
        document.querySelector("#carouselPreviewControls .carousel-inner").innerHTML += '<div class="carousel-item"><img src="'+images[i]+'" class="d-block w-100 rounded" alt="ERROR: Image Not Found !!!"></div>'
        i = i + 1;
      }
      document.querySelector("#carouselPreviewControls .carousel-inner .carousel-item:first-child").classList.add("active")
    }
  }
}

var fi = document.getElementById('input-image-ele');

fi.addEventListener("change", function(e){
  var txt = document.getElementById('upload-image-url')
  var x = "";
  
  if (txt.value) {
    x = " ";
  }
  
  var f = e.target.files[0]
  f.arrayBuffer().then(function (arrayBuffer) {
    var b = new Blob([new Uint8Array(arrayBuffer)], {type: "application/octet-stream" });
    var fd = new FormData();
    fd.append('file', b, f.name);
    fetch('https://ipfs.infura.io:5001/api/v0/add', {
      method: 'POST',
      body: fd,
      mode: 'cors'
    }).then(function(r){
      r.json().then(function(d){
        console.log(d)
        txt.value += x + "https://ipfs.infura.io/ipfs/" + d.Hash;
        window.setTimeout(loadPostPreview(txt.value),500);
      }).catch(function(err){
        console.log(err);
        notify("Error while uploading","var(--bs-danger)")
      })
    }).catch(function(er){
      console.log(er);
      notify("Error while uploading","var(--bs-danger)")
    })
  });
});

document.querySelector('input[type="radio"][value="video"]').addEventListener("click", function(){
  var fv = document.getElementById("input-video-ele")
  fv.onchange = function (e) {
    var f = e.target.files[0]

    console.log(f.size)
    if (f.size < 15000000) {
      document.getElementById('upload-preview').innerHTML = '<div class="text-center"><div class="spinner-grow text-primary" role="status"></div></div>'
      f.arrayBuffer().then(function (arrayBuffer) {
        var b = new Blob([new Uint8Array(arrayBuffer)], {type: "application/octet-stream" });
        var fd = new FormData();
        fd.append('file', b, f.name);
        fetch('https://ipfs.infura.io:5001/api/v0/add', {
          method: 'POST',
          body: fd,
          mode: 'cors'
        }).then(function(r){
          r.json().then(function(d){
            var uvuin = document.getElementById("upload-video-url") 
            uvuin.value = "https://ipfs.infura.io/ipfs/" + d.Hash;
            window.setTimeout(loadPostPreview(uvuin.value,'upload-video-url'),500)
            notify("Uploaded video !!")
          }).catch(function(e){
            console.log(e);
            notify("Error while uploading","var(--bs-danger)")
          })
        }).catch(function(er){notify(er,"var(--bs-danger)");})
      }).catch(function(err){notify(err,"var(--bs-danger)");})
    } else {
      notify("File Size is too Big","var(--bs-danger)")
    }
  }
})


function submitPost(){
  var descBody = document.getElementById('textbox').value
  var title = reg(descBody,3);
  var eleTags = document.getElementsByClassName('tag-wrap')
  var taglist = Array.prototype.slice.call(eleTags).map(function(tag){return tag.innerHTML;});
  
  
  if(document.getElementById('upload-image-url') && document.getElementById('upload-image-url').value) {
    var imagelink = document.getElementById('upload-image-url').value.split(" ");
    var body = "[![]("+imagelink[0]+")](https://terrive.one/?u="+username+"&p="+title.replaceAll(" ","-").toLowerCase()+") <br><br>"+descBody+" <br><br> Posted using [Terrive](https://terrive.one)";
    var jsonMetadata = JSON.stringify({app: "terrive/0.0.0", format: "markdown", description: descBody, tags: taglist, image: imagelink})
    broadcastPost(username,body,jsonMetadata,'trhome',title)
  }
  else if (document.getElementById('upload-video-url').value && document.getElementById('upload-video-url-cover').value ) {
    taglist.push("trhome")
    var coverV = document.getElementById('upload-video-url-cover').value;
    var bodyVC = "[![]("+coverV+")](https://terrive.one/?u="+username+"&p="+title.replaceAll(" ","-").toLowerCase()+"&video) <br><br>"+descBody+" <br><br> Posted using [Terrive](https://terrive.one)";
    var videolinkC = document.getElementById('upload-video-url').value;
    var jsonMetadataVC = JSON.stringify({app: "terrive/0.0.0", format: "markdown", description: descBody, tags: taglist, image: [coverV], video: [videolinkC],})
    broadcastPost(username,bodyVC,jsonMetadataVC,'trvideo',title)
  }
  else if (document.getElementById('upload-video-url').value) {
    taglist.push("trhome")
    var alt = imgHoster + "/u/" + username + "/avatar/large"
    var bodyV = "[![]("+alt+")](https://terrive.one/?u="+username+"&p="+title.replaceAll(" ","-").toLowerCase()+"&video) <br><br>"+descBody+" <br><br> Posted using [Terrive](https://terrive.one)";
    var videolink = document.getElementById('upload-video-url').value;
    var jsonMetadataV = JSON.stringify({app: "terrive/0.0.0", format: "markdown", description: descBody, tags: taglist, image: [alt], video: [videolink],})
    broadcastPost(username,bodyV,jsonMetadataV,'trvideo',title)
  }
  
}
function reg(s, n) {
  //Thank you StackOverflow !!
  var a = s.match(new RegExp('[\\w\\.]+' + '(?:[\\s-]*[\\w\\.]+){0,' + (n - 1) + '}')); 
  return  (a === undefined || a === null) ? '' : a[0];
}

function broadcastPost(u,body,jsonMetadata,type,title){
  if (accessToken) {
    client.comment('',type,u,title.replaceAll(" ","-").toLowerCase(),title,body,jsonMetadata, function (err,res) {
      if (err === null || err.error_description === undefined){
        console.log(res)
        clearUploadTray();
        notify("Successfully Posted")
      }else {
        notify(err.error_description,"var(--bs-danger)")
      }
    })
  } else if (loginType == "keychain") {
    hive_keychain.requestPost(u, title, body, type, '', jsonMetadata, title.replaceAll(" ","-").toLowerCase(), '',
    function (response) {
      if(response.success == true) {
        clearUploadTray();
        notify("Successfully Posted")
      } else {notify("Failed to Post","var(--bs-danger)"); } 
    }
  );
  }
}

function clearUploadTray() {
  document.getElementById("upload-preview").innerHTML = "";
  document.getElementById("upload-input-wrap").innerHTML = "";
  document.getElementById("textbox").value = "";
  document.getElementById("tagTray").innerHTML = "";
}

document.getElementById('reblogPop').addEventListener('show.bs.modal', function (event) {
  var permlink = event.relatedTarget.getAttribute("data-tr-permlink");
  var author = event.relatedTarget.getAttribute("data-tr-author");
  document.getElementById("reblog-pop-permlink").innerHTML = permlink;
  document.getElementById("reblog-pop-yes").addEventListener('click', function() {
    if (accessToken) {
      client.reblog( username, author, permlink, function(err,res) {
        if (err === null) {
          console.log(res);
          notify("Reblogged")
       }else{notify(err.error_description);}
      });
    } else if (loginType == "keychain"){
      var json = JSON.stringify([
        'reblog',
        {
          account: username,
          author: author,
          permlink: permlink,
        },
      ]);
      hive_keychain.requestCustomJson( username, 'follow', 'Posting', json, 'Reblog a Post',
          function (response) {
            console.log(response);
            notify("Reblogged")
          }
       );
    }
  })
});

function filterType (res,type) {
  let rTarg = document.getElementById("post-tray");
  
  rTarg.setAttribute("data-tr-vote",res.active_votes.length);
  rTarg.setAttribute("data-tr-children",res.children);
  
  if (type == "re") {
    rTarg.setAttribute("data-tr-body",res.body)
  } else if (type == "vid") {
    rTarg.setAttribute("data-tr-body",JSON.parse(res.json_metadata).description)
    rTarg.setAttribute("data-tr-src",JSON.parse(res.json_metadata).video[0])
  } else {
    rTarg.setAttribute("data-tr-body",JSON.parse(res.json_metadata).description)
    rTarg.setAttribute("data-tr-src",JSON.parse(res.json_metadata).image.toString())
   }
}

document.getElementById('post-tray').addEventListener('hide.bs.modal', function(){
  document.querySelector('#post-like use').setAttribute("href","#bi-heart")
  document.querySelector('#post-like').style.fill = "var(--tr-color)";
})

document.getElementById('post-tray').addEventListener('show.bs.modal',function(event){
  const rTarg = event.relatedTarget,
        author = rTarg.getAttribute("data-tr-author"),
        permlink = rTarg.getAttribute("data-tr-permlink"),
        type = rTarg.getAttribute("data-tr-type"),
        body = rTarg.getAttribute("data-tr-body"),
        images = rTarg.getAttribute("data-tr-src"),
        lc = rTarg.getAttribute('data-tr-vote'),
        children = rTarg.getAttribute("data-tr-children");
  
  if (type == "vid") {
    pushPost(author,permlink,body,"",lc,children);
    document.querySelector("#post-tray .modal-body .post-img").innerHTML = '<video id="upload-video-post" src="'+images+'" class="w-100" preload="metadata" controls></video>'
  }
  else {
    pushPost(author,permlink,body,images,lc,children);
  }
})
function pushPost(author,permlink,body,image,lc,children) {
  var images = image.split(",")
  var likeCountPost = document.getElementById('like-count-post')
  likeCountPost.innerHTML = lc;
  document.getElementById("post-body").innerHTML = md.render(body).replaceAll("<p>","").replaceAll("</p>","")
  var postTray = document.getElementById("post-tray")
  postTray.setAttribute("data-tr-author",author)
  postTray.setAttribute("data-tr-permlink",permlink)
  document.getElementById("children-post").innerHTML = children;
  document.querySelector("#post-tray .modal-title").textContent = author;
  var imgTray = document.querySelector("#post-tray .modal-body .post-img")
  imgTray.innerHTML = "";
  if (images.length == 1) {
    imgTray.innerHTML += '<img src="'+imgHoster+'/p/'+b58(images[0])+'?format=webp&mode=fit">'

  } 
  else if (images.length > 1) {
    imgTray.innerHTML += '<div id="carouselPostControls" class="carousel slide mb-3" data-bs-ride="carousel"><div class="carousel-inner"></div><button class="carousel-control-prev" type="button" data-bs-target="#carouselPostControls" data-bs-slide="prev"><span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="visually-hidden">Previous</span></button><button class="carousel-control-next" type="button" data-bs-target="#carouselPostControls" data-bs-slide="next"><span class="carousel-control-next-icon" aria-hidden="true"></span><span class="visually-hidden">Next</span></button></div>'
    var i = 0;
    while ( i < images.length ) {
      document.querySelector("#carouselPostControls .carousel-inner").innerHTML += '<div class="carousel-item"><img src="'+imgHoster+'/p/'+b58(images[i])+'?format=webp&mode=fit" class="d-block" alt="ERROR: Image Not Found !!!"></div>'
      i = i + 1;
    }
    document.querySelector("#carouselPostControls .carousel-inner .carousel-item:first-child").classList.add("active")
  }
  
  if (author == username) {
    document.querySelector("#post-tray .bi-pencil").classList.replace("invisible","visible")
  } else {
    document.querySelector("#post-tray .bi-pencil").classList.replace("visible","invisible")
  }

  document.querySelector("#post-tray .modal-header img").setAttribute("src",imgHoster+"/u/"+author+"/avatar/small");

  getReplies(author,permlink);
  document.querySelector('#edit-post textarea').value = body;
}

function postLike(){
  var rTarg = document.getElementById('post-tray');
  var author = rTarg.getAttribute("data-tr-author")
  var permlink = rTarg.getAttribute("data-tr-permlink")
  var likeCountPost = document.getElementById('like-count-post')
  var postLikeEle = document.querySelector('#post-like');
    if (accessToken && postLikeEle.style.fill !== "#ff0000" ) {
      client.vote(username,author,permlink,10000,function(err,res){
        if(err === null && postLikeEle.style.fill !== "#ff0000"){ 
          console.log(res);
          document.querySelector('#post-like use').setAttribute("href","#bi-heart-fill");
          postLikeEle.style.fill = "#ff0000";
          likeCountPost.innerHTML = +likeCountPost.innerHTML + 1;
          notify("Successfully Voted")
        }
        else {notify(err.error_description);}
      })
    } else if (loginType == "keychain" && postLikeEle.style.fill !== "#ff0000" ){
      hive_keychain.requestVote( username, permlink, author, 10000,
        function (response) {
          if (response.success == true){
            document.querySelector('#post-like use').setAttribute("href","#bi-heart-fill");
            postLikeEle.style.fill = "#ff0000";
            likeCountPost.innerHTML = +likeCountPost.innerHTML + 1;
            notify("Successfully Voted")
          } else {notify("Error while Voting","var(--bs-danger)")}
        }
      );
    } else { notify("Failed to vote","var(--bs-danger)") }
  }

function editPost() {
  const rTarg = document.getElementById('post-tray'),
        pa = rTarg.getAttribute("data-tr-author"),
        pp = rTarg.getAttribute("data-tr-permlink"),
        body = document.querySelector("#edit-post .modal-body textarea"),
        editele = new bootstrap.Modal(document.getElementById("edit-post"));
  
  hive.api.getContent(pa,pp,function(e,r){
    if (e === null) {
    var json = JSON.parse(r.json_metadata);
    
      json.description = body.value;
      
      if(accessToken) {
        client.comment('',r.category,r.author,r.permlink,r.title,body.value, JSON.stringify(json),function(err,res){
          if (err === null) {
            editele.hide();
            notify("Successfully edited !")
          } else {
            notify(err,"var(--bs-danger)")
            console.log(err)
          }
        })
      }else if (loginType = "keychain"){
        hive_keychain.requestPost( r.author, r.title, body.value, r.category, '', JSON.stringify(json), r.permlink, '', function(rs){
          if ( rs.success == true ) {
            editele.hide("Successfully edited !");
            notify("Successfully edited !")
          } else {
            notify("Could not edit","var(--bs-danger)")
            console.log(rs)
          }
        })
      } else {
        notify("not logged in","var(--bs-danger)")
      }
    } else {
      notify(e,"var(--bs-danger)")
    }
  })
}
                     
function postComment(){
  const rTarg = document.getElementById('post-tray'),
        parentAuthor = rTarg.getAttribute("data-tr-author"),
        parentPermlink = rTarg.getAttribute("data-tr-permlink"),
        permlink = Math.random().toString(36).substring(2),
        body = document.querySelector("#post-tray .modal-footer input"),
        json = JSON.stringify({app: "terrive/0.0.0"})
  
  if(accessToken){
    client.comment(parentAuthor, parentPermlink, username, permlink, '', body.value, json, function (err, res) {
      if ( err === null ){
        console.log(res)
        body.value = "";
        notify("Successfully Commented")
      }else {notify(err.error_description,"var(--bs-danger)");}
    });
  } else if (loginType == "keychain") {
        hive_keychain.requestPost( username, '', body.value, parentPermlink, parentAuthor, json, permlink, '',
          function (response) {
            console.log(response);
            if (response.success == true){
              body.value = "";
              notify("Successfully Commented")
            }else {notify("Error while commenting","var(--bs-danger)")}
          }
        );
  }
}

function addReaction (reaction) {
  let sticker;
  
  if (reaction == '!LUV') {
    sticker = "![love.webp](https://images.ecency.com/p/5bEGgqZEHBMe6s3wiPgGFTi3naqHERgdwJew6rJYRaB3RR7sSAdZKnpM5EfB7haZJRqrK9eHDfaxfKmryUDHQ7jC7FQfWdCH.webp)";
  } else if (reaction == '!PIZZA') {
    sticker = "![pizza.webp](https://images.ecency.com/p/7DceLgR4szFwuz7CAHs19JsfqtMKwxDmgzo1nicPT5tDgv48VYtNCWLUEcb9kRvnGVoVv5qmQZFm7yFHMa6NA.webp)";
  } else {
    sticker = "";
  }
  
  const ele = document.getElementById("post-tray"),
        parentAuthor = ele.getAttribute("data-tr-author"),
        parentPermlink = ele.getAttribute("data-tr-permlink"),
        permlink = "re-" + parentPermlink + "-" + Math.random().toString(36).substring(2),
        meta = JSON.stringify({ reaction: reaction,app: "terrive/0.0.0"}),
        body = 'Here is some ' + reaction + '<br> '+ sticker +'<br> Reactions added using [Terrive](https://terrive.one)';
  
  if(accessToken){
    client.comment(parentAuthor, parentPermlink, username, permlink, '', body, meta, function (err, res) {
      if ( err === null ){
        console.log(res)
        notify("Successfully Added Reaction")
      }else {notify(err.error_description,"var(--bs-danger)");}
    });
  } else if (loginType == "keychain") {
        hive_keychain.requestPost(username,'', body, parentPermlink, parentAuthor, meta, permlink, '', function (response) {
            console.log(response);
            if (response.success == true){
              notify("Successfully Added Reaction")
            }else {notify("Error adding Reaction","var(--bs-danger)")}
          }
        );
  }
}

document.getElementById('sharePop').addEventListener('show.bs.modal',function(event){
  var url = event.relatedTarget.getAttribute('data-tr-url');
  document.getElementById("share-facebook").setAttribute("href","https://facebook.com/sharer.php?u=https://terrive.one"+url.replace("/","").replace("trhome","").replace("trtestvid","").replace("/@","?u=").replace("/","&p="))
  document.getElementById("share-twitter").setAttribute("href","https://twitter.com/intent/tweet?url=https://terrive.one"+url.replace("/","").replace("trhome","").replace("trtestvid","").replace("/@","?u=").replace("/","&p="))
  document.getElementById("share-reddit").setAttribute("href",'https://reddit.com/submit?url=https://terrive.one'+url.replace("/","").replace("trhome","").replace("trtestvid","").replace("/@","?u=").replace("/","&p="))
  var txtbx = document.getElementById("share-copy-txtbx")
  txtbx.setAttribute("value", "https://terrive.one"+url.replace("/","").replace("trhome","").replace("trtestvid","").replace("/@","?u=").replace("/","&p="))
  document.getElementById("share-link").addEventListener("click",function(){
    txtbx.select();
    txtbx.setSelectionRange(0,99999);
    document.execCommand("copy");
    notify("Successfully copied")
  })
})

calcURL()
function calcURL(){
  var query = location.search;
  var params = new URLSearchParams(query);
  if (params.has("p") && params.has("u") && params.has("reply")) {
    var p = params.get("p")
    var u = params.get("u")
    document.title = p + " by " + u + " on Terrive"
    var ele = document.querySelector('#post-tray')
    ele.setAttribute("data-tr-author",u)
    ele.setAttribute("data-tr-permlink",p)
    ele.setAttribute("data-tr-type","re")
    var tab = new bootstrap.Modal(ele)
    tab.show()
    getContent(u,p,"reply")
  }
  else if (params.has("p") && params.has("u") && params.has("video")) {
    var p = params.get("p")
    var u = params.get("u")
    document.title = p + " by " + u + " on Terrive"
    var ele = document.querySelector('#post-tray')
    ele.setAttribute("data-tr-author",u)
    ele.setAttribute("data-tr-permlink",p)
    ele.setAttribute("data-tr-type","vid")
    var tab = new bootstrap.Modal(ele)
    tab.show()
    getContent(u,p,"video")
  }
  else if (params.has("p") && params.has("u")) {
    var p = params.get("p")
    var u = params.get("u")
    document.title = p + " by " + u + " on Terrive"
    var ele = document.getElementById('post-tray')
    ele.setAttribute("data-tr-author",u)
    ele.setAttribute("data-tr-permlink",p)
    var tab = new bootstrap.Modal(ele)
    tab.show()
    getContent(u,p)
  }
  else if (params.has("u")) {
    var u = params.get('u')
    document.title = u + "'s Posts on Terrive"
    var ele = document.querySelector('a[href="#profile"]')
    var tab = new bootstrap.Tab(ele)
    tab.show()
    getBlog(u)
    getProfileInfo(u)
    getFollowers(u)
  }
  else if (username === null) {
    document.getElementById("login").classList.replace("invisible","visible")
  }
}

function getContent(u,p,type) {
  hive.api.getContent(u,p,function(e,r){
    if( e === null ){
      var lc = r.active_votes.length
      var children = r.children
      if (type == "reply") {
        var body = r.body;
        pushPost(u,p,'','',lc,children)
        document.querySelector("#post-tray .modal-body .post-img").innerHTML = '<div class="w-100 text-center">'+md.render(body)+'</div>'
      }
      else if (type == "video") {
        var video = JSON.parse(r.json_metadata).video[0]
        pushPost(u,p,body,'',lc,children)
        document.querySelector("#post-tray .modal-body .post-img").innerHTML = '<video id="upload-video-preview" src="'+video+'" preload="metadata" controls></video>'
      }
      else {
        var json = JSON.parse(r.json_metadata)
        pushPost(u,p,json.description,json.image.toString(),lc,children)
      }
    }else{notify(e,"var(--bs-danger)")}
  })
}

darken()
function darken () {
  if (localStorage.getItem("theme") == "dark") {
    document.body.classList.add("dark")
  }
}
function dark() {
  var pref = window.matchMedia("(prefer-color-scheme: dark)")
  
  if (!pref.matches) {
    document.body.classList.toggle("dark")
    
    if (document.body.classList.contains("dark")) {
      localStorage.setItem("theme","dark")
    } else {
      localStorage.removeItem("theme")
    }
  }
}

function calcLength () {
  var txtL = document.getElementById("text-length");
  var txtBx = document.getElementById("textbox");
  txtL.innerHTML = txtBx.value.length;
  if (150 <= txtBx.value.length) {
    txtBx.setAttribute("class","form-control btn-outline-danger")
  } else {
    txtBx.setAttribute("class","form-control");
  }
}

function calcTag(e) {
  if (e.keyCode == 13 || e.keyCode == 32) {
    var newtag = document.getElementById("tag");
    document.getElementById("tagTray").innerHTML += '<span class="alert d-inline alert-primary ms-3 p-1"><span class="d-inline tag-wrap me-1">'+newtag.value.replace(" ","")+'</span><button type="button" class="d-inline btn-close p-0 m-0 align-middle newtag" data-bs-dismiss="alert" aria-label="Close"></button></span>'
    newtag.value = "";
  }
}

function getSearch(id) {
  document.getElementById("search-tray").innerHTML = "";
  var val = document.getElementById(id).value;
  hive.api.callAsync('condenser_api.lookup_accounts',[val,10]).then(function(res){
    var counter = 0;
    while(counter < res.length){
     document.getElementById("search-tray").innerHTML += '<a class="list-group-item list-group-item-action mx-auto" href="/?u='+res[counter]+'"><img class="rounded-circle float-start" src="'+imgHoster+'/u/'+res[counter]+'/avatar/small" height="48" width="48"><p class="fs-5 fw-bold float-start mt-2 ms-3">'+res[counter]+'</p></a>';
     counter = counter + 1;
    }
  })
}

function getReplies(u,p){
  document.querySelector("#post-tray .modal-body p").innerHTML = "";
  hive.api.getContentReplies(u,p,function(e,r) {
    if(e === null){
      let counter = 0,
          reactions = {"LUV": 0,"PIZZA": 0,"BEER": 0};
      
      while (counter < r.length){
        if (JSON.parse(r[counter].json_metadata).reaction) {
          const react = JSON.parse(r[counter].json_metadata).reaction.replace("!","")
          reactions[react] = reactions[react] + 1;
        } else {
          document.querySelector("#post-tray .modal-body .post-comment").innerHTML += '<br><div class="mx-3 shadow alert-light rounded p-3 mx-auto position-relative" style="max-width: 36em;"><img src="'+imgHoster+'/u/'+r[counter].author+'/avatar/small" class="rounded-circle me-2" height="24" width="24"><a class="fw-bold link-dark text-decoration-none" href="?u='+r[counter].author+'">'+r[counter].author+'</a><br><br><span class="reply-body">'+md.render(r[counter].body)+ '</span><a href="?u='+r[counter].author+'&p='+r[counter].permlink+'&reply" class="link-dark satisfy">reply</a><svg width="16" height="16" fill="#d3d3d3" class="bi bi-star-fill position-absolute mt-3 me-3 top-0 end-0" data-tr-author="'+r[counter].author+'" data-tr-permlink="'+r[counter].permlink+'" onclick="likeReplies(this)"><use href="#bi-star-fill"/></svg><a data-tr-author="'+r[counter].author+'" data-tr-permlink="'+r[counter].permlink+'" onclick="getChildReplies(this)"><svg width="16" height="16" fill="var(--tr-color)" class="bi bi-chevron-down position-absolute end-0 bottom-0 me-3 mb-3"><use href="#bi-chevron-down"/></svg></a></div><br><div id="child-replies-'+r[counter].permlink+'"></div>';
        }
        counter = counter + 1;
      }
      
      document.querySelector("#post-tray .modal-body .luv-count").innerHTML = reactions.LUV;
      document.querySelector("#post-tray .modal-body .pizza-count").innerHTML = reactions.PIZZA;
      document.querySelector("#post-tray .modal-body .beer-count").innerHTML = reactions.BEER;
      
      const luv = document.querySelector("#post-tray .modal-body .luv"),
            pizza = document.querySelector("#post-tray .modal-body .pizza"),
            beer = document.querySelector("#post-tray .modal-body .beer");
      
      if (reactions.LUV !== 0) {
        luv.classList.replace("invisible","visible")
      } else {
        luv.classList.replace("visible","invisible")
      }
      
      if (reactions.PIZZA !== 0) {
        pizza.classList.replace("invisible","visible")
      } else {
        pizza.classList.replace("visible","invisible")
      }
      
      if (reactions.BEER !== 0) {
        beer.classList.replace("invisible","visible")
      } else {
        beer.classList.replace("visible","invisible")
      }
    
    }else{notify(e,"var(--bs-danger)");}
  })
}
function getChildReplies(ev) {
  var u = ev.getAttribute("data-tr-author")
  var p = ev.getAttribute("data-tr-permlink")
  var el = document.getElementById("child-replies-"+p);
  hive.api.getContentReplies(u,p,function(e,r){
    if (e === null){
      var c = 0;
      while (c < r.length) {
        el.innerHTML += '<div class="mx-3 shadow alert-light rounded p-3 mx-auto position-relative" style="max-width: 32em;"><img src="'+imgHoster+'/u/'+r[c].author+'/avatar/small" class="rounded-circle me-2" height="24" width="24"><a class="fw-bold link-dark text-decoration-none" href="?u='+r[c].author+'">'+r[c].author+'</a><br><span class="reply-body">'+md.render(r[c].body)+ '</span><a href="?u='+r[c].author+'&p='+r[c].permlink+'&reply" class="link-dark satisfy">reply</a><svg width="16" height="16" fill="#d3d3d3" class="bi bi-star-fill position-absolute mt-3 me-3 top-0 end-0" data-tr-author="'+r[c].author+'" data-tr-permlink="'+r[c].permlink+'" onclick="likeReplies(this)"><use href="#bi-star-fill"/></svg><svg data-tr-author="'+r[c].author+'" data-tr-permlink="'+r[c].permlink+'" onclick="getChildReplies(this)" width="16" height="16" fill="var(--tr-color)" class="bi bi-chevron-down position-absolute end-0 bottom-0 me-3 mb-3"><use href="#bi-chevron-down"/></svg></div><div id="child-replies-'+r[c].permlink+'"></div><br>';
        c = c + 1;
      }
      if(r.length = 0){ notify("No Replies","var(--bs-danger)") }
    } else { notify(e, "var(--bs-danger)") }
  })
}

function likeReplies(ev) {
  var auth = ev.getAttribute("data-tr-author")
  var perm = ev.getAttribute("data-tr-permlink")
  if(accessToken) {
    client.vote(username, auth, perm, 10000, function (e,r) {
      if(e === null) {
        ev.querySelector("use").style.fill = "#ff0000"
      } else { notify(e,"var(--bs-danger)"); }
    })
  } else if (loginType == "keychain") {
    hive_keychain.requestVote( username, perm, auth, 10000, function(res) {
      if (res.success == true) {
        ev.querySelector("use").style.fill = "#ff0000"
      } else { notify("Error Voting","var(--bs-danger)") }
    })
  }
}

function like(id) {
  var ele = document.getElementById(id).querySelector("use");
  var counter = id.replace("like-","");
  var eleLikeCount = document.getElementById("like-count-"+counter);
  var eleAuthor = document.getElementById("author-"+counter);
  var author = eleAuthor.innerHTML;
  var permlink = eleAuthor.getAttribute("data-tr-permlink");
   if (accessToken && ele.style.fill !== "#ff0000" ) {
    client.vote(username, author, permlink, 10000, function (err, res) {
      if(err === null && ele.style.fill !== "#ff0000") {
        ele.setAttribute("href","#bi-heart-fill");
        ele.style.fill = "#ff0000";
        eleLikeCount.innerHTML = +eleLikeCount.innerHTML + 1;
        notify("Successfully Voted")
      }else{notify(err.error_description,"var(--bs-danger)");}
    });
  } else if (loginType == "keychain" && ele.style.fill !== "#ff0000" ){
      hive_keychain.requestVote( username, permlink, author, 10000, function (response) {
          if (response.success == true){
            ele.setAttribute("href","#bi-heart-fill");
            ele.style.fill = "#ff0000";
            eleLikeCount.innerHTML = +eleLikeCount.innerHTML + 1;
            notify("Successfully Voted")
          } else { notify("Error while Voting","var(--bs-danger)") }
        }
      );
   } else { notify("Failed to vote","var(--bs-danger)") }
  
}

function followToggle(ele) {
  var account = document.getElementById("profile-info-username").innerHTML.replace("@","")
  if(account == username) {
    notify("Ehh!! Why do you want to follow yourself!!","var(--bs-danger)");
  }
  else {
    if (accessToken) {
      client.follow(username,account,function(err,res){
        if(err == null) {
          console.log(res);
          ele.innerHTML = "Followed";
          ele.classList.replace("btn-primary","btn-outline-primary")
        }else{notify(err.error_description,"var(--bs-danger)");}
      });
    }else if (loginType == "keychain") {
      var json = JSON.stringify([
        'follow',
        {
           follower: username,
           following: account,
           what: ['blog'],
        },
      ]);

       hive_keychain.requestCustomJson( username, 'follow', 'Posting', json, 'Follow a User',
          function (response) {
            console.log("following ...");
            console.log(response);
            if (response.success == true){
              ele.innerHTML = "Followed";
              ele.classList.replace("btn-primary","btn-outline-primary")
              notify("Successfully Followed")
            } else { notify("Error while following","var(--bs-danger)") }
          }
       );
    }
  }
}

function getFeed () {
  hive.api.getDiscussionsByFeed({ tag: username, limit: 100, truncate_body: 1,} , function(err,res){
    if ( err === null ) {
          filterTag(res,"feed");
      } else{console.log(err); notify("Failed to get Feed","var(--bs-danger)")}
  });
}
function getNew() {
  hive.api.getDiscussionsByCreated({tag: 'trhome', limit: 35, truncate_body: 1,} , function(err,res) {
    if ( err === null ) {
      filterTag(res,"new");
    } else {console.log(err);}
  });
}
document.querySelectorAll('a[href="#home"]').forEach(function(ele){
  ele.addEventListener('show.bs.tab', function (event) {
    getFeed();
    if (username === null) {
      document.getElementById("login").classList.replace("invisible","visible")
    }
});});

document.querySelectorAll('a[href="#profile"]').forEach(function(ele){
  ele.addEventListener('show.bs.tab', function (event) {
    document.getElementById("loader").classList.replace("invisible","visible")
    getBlog(username);
    getProfileInfo(username);
    getFollowers(username);
});});

function getBlog(u){
  hive.api.getDiscussionsByBlog({tag: u, limit: 100, truncate_body: 1,}, function(err,res) {
    if (err === null) {
      pushProfile(res);
    } else {console.log(err);}
  });
}

function getProfileInfo(u) {
  hive.api.getAccounts([u], function(err,res) {
    pushProfileInfo(res)
  })
}

var notifywrkr = new Worker("js/notify.js");

notifywrkr.addEventListener("message",function(e){
  document.getElementById("notify-body").innerHTML += e.data;
});

getNotifications();
function getNotifications() {
  document.getElementById("notify-body").innerHTML = "";
  notifywrkr.postMessage([rpc,username])
}

setInterval(function(){
  document.getElementById("notify-body").innerHTML = "";
  notifywrkr.postMessage([rpc,username])
},120000)

var filterwrkr = new Worker('js/filter.js')

filterwrkr.addEventListener("message",function(e){
  var [r,t] = e.data;
  push(r,t)
  
  var loader = document.getElementById("loader")
  
  if(loader.classList.contains("visible")) {
    loader.classList.replace("visible","invisible")
  }
})

function filterTag(r,type){
  if (type === "feed") {
    eleHome.innerHTML = "";
  }
  else if ( type === "new") { 
    eleDiscover.innerHTML = '';
  }
  filterwrkr.postMessage([r,type])
}

document.querySelectorAll('a[href="#discover"]').forEach(function(ele){
  ele.addEventListener('show.bs.tab', function (event) {
  getNew();
    document.getElementById("loader").classList.replace("invisible","visible")
    if (username === null) {
      document.getElementById("login").classList.replace("invisible","visible")
    }
});});

function getFollowers(u) {
  var piFollowers = document.getElementById("profile-info-followers");
  var piFollowing = document.getElementById("profile-info-following");
  hive.api.getFollowers( u, '', 'blog', 10, function(err, result) {
    if (err === null) {
      piFollowers.setAttribute("title","@"+result.map(function(item){return item.follower;}).toString().replaceAll(","," @"));
      toolip();
    }else{notify(err,"var(--bs-danger)");}
  });
  hive.api.getFollowing( u, '', 'blog', 10, function(err, result) {
    if (err === null) {
      piFollowing.setAttribute("title","@"+result.map(function(item){return item.following;}).toString().replaceAll(","," @"));
      toolip();
    }else{notify(err,"var(--bs-danger)");}
  });
  hive.api.getFollowCount( u, function(err, result) {
    if(err === null) {
      piFollowing.querySelector('span').innerHTML = result.following_count;
      piFollowers.querySelector('span').innerHTML = result.follower_count;
    }
    else{notify(err,"var(--bs-danger)");}
  });

}

var ProfileJsonMeta = "" , JsonMeta = "";

function saveProfile() {
  ProfileJsonMeta.profile.about = document.querySelector("#profile-edit textarea").value;
  ProfileJsonMeta.profile.location = document.querySelector('#profile-edit input[placeholder="Location"]').value;
  ProfileJsonMeta.profile.profile_image = document.querySelector('#profile-edit input[placeholder="Profile Image"]').value
  ProfileJsonMeta.profile.website = document.querySelector('#profile-edit input[placeholder="Website"]').value
  
  const ele = document.getElementById("profile-edit"),
        op = [
          [
            'account_update2', {
            'account': username,
            'json_metadata': JsonMeta,
            'posting_json_metadata': JSON.stringify(ProfileJsonMeta)
          }
        ]
       ];
  if (accessToken) {
    hivesigner.sendOperation(op, { 'callback': window.location.href }, function(e,r){
      console.log(e,r)
    })
  } else if (loginType == "keychain") {
    hive_keychain.requestBroadcast(username, op, 'Posting', function(r){
      console.log(r)
    })
  }
}

function pushProfileInfo (res) {
  if (res[0].posting_json_metadata !== "") {
    ProfileJsonMeta = JSON.parse(res[0].posting_json_metadata);
  } else { ProfileJsonMetadata = "" }
  if (res[0].json_metadata !== "") { 
    JsonMeta = res[0].json_metadata;
  } else { JsonMetadata = "" }
  
  var json = ProfileJsonMeta;
  document.getElementById("profile-info-username").innerHTML = res[0].name;
  document.getElementById("profile-info-about").innerHTML = json.profile.about;
  document.querySelector('#profile-edit textarea').value = json.profile.about;
  document.getElementById("profile-info-loc").innerHTML = json.profile.location;
  document.querySelector('#profile-edit input[placeholder="Location"]').value = json.profile.location;
  document.getElementById("profile-info-profile-pic").style.backgroundImage = 'url("' + imgHoster + '/u/' + res[0].name + '/avatar/medium' +'")';
  document.querySelector('#profile-edit input[placeholder="Profile Image"]').value = json.profile.profile_image;
  document.getElementById("profile-info-web").innerHTML = '<a class="text-secondary" target="_blank" rel="noopener" href="'+json.profile.website+'">'+json.profile.website+'</a>';
  document.querySelector('#profile-edit input[placeholder="Website"]').value = json.profile.website;
  document.getElementById("profile-info-created").innerHTML = res[0].created.replace("T"," | ");
  document.getElementById("profile-info-pst-count").innerHTML = res[0].post_count;
  document.getElementById("profile-info-last-up").innerHTML = res[0].last_account_update.replace("T"," | ");
  document.getElementById("profile-info-rep").innerHTML = hive.formatter.reputation(res[0].reputation);
  document.getElementById("profile-info-rec-acc").innerHTML = res[0].recovery_account;
  document.getElementById("profile-info-vp").style.width = res[0].voting_power / 100 + '%';
  document.getElementById("profile-info-vp").innerHTML = res[0].voting_power / 100 + '%';
  if (res[0].name == username) {
    document.getElementById("profile-info").innerHTML += '<button class="btn btn-outline-primary m-3" data-bs-target="#profile-edit" data-bs-toggle="modal">Edit Profile</button><button class="btn btn-outline-danger m-3" onclick="logOut()">Logout</button>'
  }
}

function pushProfile (res) {
  var counter = 0;
  eleProfileGrid.innerHTML = "";
  eleProfileVideo.innerHTML = "";
  while (counter < res.length) {
    var json = JSON.parse(res[counter].json_metadata);
    var img = json.image;
    if (img === undefined) {console.log(counter);}
    else if (res[counter].category == 'trhome') {
      eleProfileGrid.innerHTML += '<div id="trImg'+counter+'" class="col tr-profile-img" data-bs-toggle="modal" data-bs-target="#post-tray" data-tr-src="'+img.toString()+'" data-tr-author="'+res[counter].author+'" data-tr-permlink="'+res[counter].permlink+'" data-tr-children="'+res[counter].children+'" data-tr-vote="'+res[counter].active_votes.length+'" data-tr-body="'+json.description+'"></div>';
      document.querySelector('#trImg'+counter).style.backgroundImage = 'url("'+imgHoster+'/p/'+b58(img[0])+'")';
    }
    else if (res[counter].category === 'trvideo') {
      console.log(json.video)
      eleProfileVideo.innerHTML += '<div id="trVid'+counter+'" class="col bg-secondary rounded tr-profile-img tr-profile-video-gra" data-bs-toggle="modal" data-bs-target="#post-tray" data-tr-author="'+res[counter].author+'" data-tr-src="'+json.video[0]+'" data-tr-permlink="'+res[counter].permlink+'" data-tr-children="'+res[counter].children+'" data-tr-vote="'+res[counter].active_votes.length+'" data-tr-body="'+json.description+'" data-tr-type="vid"></div>';
      document.querySelector('#trVid'+counter).style.backgroundImage = 'url("'+imgHoster+'/p/'+b58(img[0])+'")';
    }
    document.getElementById("loader").classList.replace("visible","invisible")
    counter = counter + 1;
  }
}

function push(r,type) {
  document.getElementById(type).innerHTML += r
}

window.addEventListener("load",function(){
  document.getElementById("loader").classList.replace("visible","invisible");
  getNew();
  toolip();
  window.addEventListener("offline",function(){
    document.querySelector(".offline-notify").classList.add("offline");
  })
  window.addEventListener("online",function(){
    document.querySelector(".offline-notify").classList.remove("offline");
  })
})
