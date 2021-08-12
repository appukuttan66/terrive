var client = new hivesigner.Client({
  app: 'terrive',
  callbackURL: 'https://terrive.one/auth.html',
});
var loginType = localStorage.getItem('type')
var accessToken = localStorage.getItem('token')
var rpc = "https://api.hive.blog"

var imgHoster = "https://images.hive.blog"

client.setAccessToken(accessToken)

hive.api.setOptions({ url: rpc });

var username = localStorage.getItem("username");
var eleHome = document.getElementById("home");
var eleDiscover= document.getElementById("discover");
var eleProfileGrid = document.querySelector("#profile-grid .row");
var eleProfileVideo = document.querySelector("#profile-video .row");
var md = new remarkable.Remarkable({html: true,})

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
  hive_keychain.requestEncodeMessage(
    keychainUser,
    keychainUser,
    "#login-true",
    "Posting",
    function (response) {
      console.log("endoding key ...");
      console.log(response);
      if ( response.success == true ) {
        hive_keychain.requestVerifyKey(
        keychainUser,
        response.result,
        "Posting",
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
      document.getElementById("upload-preview").innerHTML += '<img src="'+images[0]+'" class="w-100 rounded mb-3">'
    } 
    else if (images.length > 1) {
      document.getElementById("upload-preview").innerHTML += '<div id="carouselPreviewControls" class="carousel slide mb-3" data-bs-ride="carousel"><div class="carousel-inner"></div><button class="carousel-control-prev" type="button" data-bs-target="#carouselPreviewControls" data-bs-slide="prev"><span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="visually-hidden">Previous</span></button><button class="carousel-control-next" type="button" data-bs-target="#carouselPreviewControls" data-bs-slide="next"><span class="carousel-control-next-icon" aria-hidden="true"></span><span class="visually-hidden">Next</span></button></div>'
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
  
  
  if(document.getElementById('upload-image-url').value) {
    var imagelink = document.getElementById('upload-image-url').value.split(" ");
    var body = "[![]("+imagelink[0]+")](https://terrive.one/?u="+username+"&p="+permlink+") <br><br>"+descBody+" <br><br> Posted using [Terrive](https://terrive.one)";
    var jsonMetadata = JSON.stringify({app: "terrive/0.0.0", format: "markdown", description: descBody, tags: taglist, image: imagelink})
    broadcastPost(username,body,jsonMetadata,'trhome',title)
  }
  else if (document.getElementById('upload-video-url').value && document.getElementById('upload-video-url-cover').value ) {
    taglist.push("trhome")
    var coverV = document.getElementById('upload-video-url-cover').value;
    var bodyVC = "[![]("+coverV+")](https://terrive.one/?u="+username+"&p="+permlink+"&video) <br><br>"+descBody+" <br><br> Posted using [Terrive](https://terrive.one)";
    var videolinkC = document.getElementById('upload-video-url').value;
    var jsonMetadataVC = JSON.stringify({app: "terrive/0.0.0", format: "markdown", description: descBody, tags: taglist, image: [coverV], video: [videolinkC],})
    broadcastPost(username,bodyVC,jsonMetadataVC,'trvideo',title)
  }
  else if (document.getElementById('upload-video-url').value) {
    taglist.push("trhome")
    var alt = imgHoster + "/u/" + username + "/avatar/large"
    var bodyV = "[![]("+alt+")](https://terrive.one/?u="+username+"&p="+permlink+"&video) <br><br>"+descBody+" <br><br> Posted using [Terrive](https://terrive.one)";
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
    client.comment('',type,u,title,title,body,jsonMetadata, function (err,res) {
      if (err === null || err.error_description === undefined){
        console.log(res)
        clearUploadTray();
        notify("Successfully Posted")
      }else {
        notify(err.error_description,"var(--bs-danger)")
      }
    })
  } else if (loginType == "keychain") {
    hive_keychain.requestPost(
    u,
    title,
    body,
    type,
    '',
    jsonMetadata,
    title,
    '',
    function (response) {
      if(response.success == true) {
        clearUploadTray();
        notify("Successfully Posted")
      }
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
      hive_keychain.requestCustomJson(
          username,
          'follow',
          'Posting',
          json,
          'Reblog a Post',
          function (response) {
            console.log(response);
            notify("Reblogged")
          }
       );
    }
  })
});


document.getElementById('post-tray').addEventListener('show.bs.modal',function(event){
  this.addEventListener('hide.bs.modal', function(){
    document.querySelector('#post-like path').setAttribute("d","m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z")
    document.querySelector('#post-like').style.fill = "var(--tr-color)";
  })
  var rTarg = event.relatedTarget;
  var author = rTarg.getAttribute("data-tr-author")
  var permlink = rTarg.getAttribute("data-tr-permlink")
  var body = rTarg.getAttribute("data-tr-body");
  var images = rTarg.getAttribute("data-tr-src")
  var lc = rTarg.getAttribute('data-tr-vote')
  var children = rTarg.getAttribute("data-tr-children")
  var type = rTarg.getAttribute("data-tr-type")
  if (type == "vid") {
    pushPost(author,permlink,body,'',lc,children);
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
    imgTray.innerHTML += '<img src="'+imgHoster+'/p/'+b58(images[0])+'?format=webp" class="w-100 mb-3">'

  } 
  else if (images.length > 1) {
    imgTray.innerHTML += '<div id="carouselPostControls" class="carousel slide mb-3" data-bs-ride="carousel"><div class="carousel-inner"></div><button class="carousel-control-prev" type="button" data-bs-target="#carouselPostControls" data-bs-slide="prev"><span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="visually-hidden">Previous</span></button><button class="carousel-control-next" type="button" data-bs-target="#carouselPostControls" data-bs-slide="next"><span class="carousel-control-next-icon" aria-hidden="true"></span><span class="visually-hidden">Next</span></button></div>'
    var i = 0;
    while ( i < images.length ) {
      document.querySelector("#carouselPostControls .carousel-inner").innerHTML += '<div class="carousel-item"><img src="'+imgHoster+'/p/'+b58(images[i])+'?format=webp" class="d-block w-100" alt="ERROR: Image Not Found !!!"></div>'
      i = i + 1;
    }
    document.querySelector("#carouselPostControls .carousel-inner .carousel-item:first-child").classList.add("active")
  }
  

  document.querySelector("#post-tray .modal-header img").setAttribute("src",imgHoster+"/u/"+author+"/avatar/small");

  getReplies(author,permlink);
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
          document.querySelector('#post-like path').setAttribute("d","M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z");
          postLikeEle.style.fill = "#ff0000";
          likeCountPost.innerHTML = +likeCountPost.innerHTML + 1;
          notify("Successfully Voted")
        }
        else {notify(err.error_description);}
      })
    } else if (loginType == "keychain" && postLikeEle.style.fill !== "#ff0000" ){
      hive_keychain.requestVote(
        username,
        permlink,
        author,
        10000,
        function (response) {
          if (response.success == true){
            document.querySelector('#post-like path').setAttribute("d","M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z");
            postLikeEle.style.fill = "#ff0000";
            likeCountPost.innerHTML = +likeCountPost.innerHTML + 1;
            notify("Successfully Voted")
          } else {notify("Error while Voting","var(--bs-danger)")}
        }
      );
    } else { notify("Failed to vote","var(--bs-danger)") }
  }

function postComment(){
  var rTarg = document.getElementById('post-tray');
  var parentAuthor = rTarg.getAttribute("data-tr-author")
  var parentPermlink = rTarg.getAttribute("data-tr-permlink")
  var permlink = Math.random().toString(36).substring(2);
  var body = document.querySelector("#post-tray .modal-footer input")
  var json = JSON.stringify({app: "terrive/0.0.0"})
  if(accessToken){
    client.comment(parentAuthor, parentPermlink, username, permlink, '', body.value, json, function (err, res) {
      if ( err === null ){
        console.log(res)
        body.value = "";
        notify("Successfully Commented")
      }else {notify(err.error_description,"var(--bs-danger)");}
    });
  } else if (loginType == "keychain") {
        hive_keychain.requestPost(
          username,
          '',
          body.value,
          parentPermlink,
          parentAuthor,
          json,
          permlink,
          '',
          function (response) {
            console.log("commenting ...");
            console.log(response);
            if (response.success == true){
              body.value = "";
              notify("Successfully Commented")
            }else {notify("Error while commenting","var(--bs-danger)")}
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
    var tab = new bootstrap.Modal(ele)
    tab.show()
    getContent(u,p,"reply")
  }
  else if (params.has("p") && params.has("u") && params.has("video")) {
    var p = params.get("p")
    var u = params.get("u")
    document.title = p + " by " + u + " on Terrive"
    var ele = document.querySelector('#post-tray')
    var tab = new bootstrap.Modal(ele)
    tab.show()
    getContent(u,p,"video")
  }
  else if (params.has("p") && params.has("u")) {
    var p = params.get("p")
    var u = params.get("u")
    document.title = p + " by " + u + " on Terrive"
    var ele = document.querySelector('#post-tray')
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
        pushPost(u,p,body,'',lc,children)
        document.querySelector("#post-tray .modal-body .post-img").innerHTML = '<div class="w-100 text-center">'+md.render(body)+'</div>'
      }
      else if (type == "video") {
        var video = JSON.parse(r.json_metadata).video[0]
        pushPost(u,p,body,'',lc,children)
        document.querySelector("#post-tray .modal-body .post-img").innerHTML = '<video id="upload-video-preview" src="'+video+'" class="w-100" preload="metadata" controls></video>'
      }
      else {
        var json = JSON.parse(r.json_metadata)
        pushPost(u,p,json.description,json.image.toString(),lc,children)
      }
    }else{notify(e,"var(--bs-danger)")}
  })
}

function dark() {
  var pref = window.matchMedia("(prefer-color-scheme: dark)")
  
  if (!pref.matches) {
    document.body.classList.toggle("dark")
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
  hive.api.getContentReplies(u,p,function(e,r){
    if(e === null){
      var counter = 0;
      while (counter < r.length){
        document.querySelector("#post-tray .modal-body .post-comment").innerHTML += '<br><div class="mx-3 shadow alert-light rounded p-3 mx-auto position-relative" style="max-width: 36em;"><img src="'+imgHoster+'/u/'+r[counter].author+'/avatar/small" class="rounded-circle me-2" height="24" width="24"><a class="fw-bold link-dark text-decoration-none" href="?u='+r[counter].author+'">'+r[counter].author+'</a><br><span class="reply-body mt-2">'+md.render(r[counter].body)+ '</span><a href="?u='+r[counter].author+'&p='+r[counter].permlink+'&reply" class="link-dark satisfy">reply</a><svg xmlns="https://www.w3.org/2000/svg" width="16" height="16" fill="#e8e8e8" class="bi bi-star-fill position-absolute m-2 top-0 end-0" viewBox="0 0 16 16"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/></svg></div><br><div class="child-replies-'+counter+'" data-tr-permlink="'+r[counter].permlink+'" data-tr-author="'+r[counter].author+'"></div>';
        counter = counter + 1;
      }
    }else{notify(e,"var(--bs-danger)");}
  })
}

function like(id) {
  var ele = document.getElementById(id).querySelector(".heartPath");
  var counter = id.replace("like-","");
  var eleLikeCount = document.getElementById("like-count-"+counter);
  var eleAuthor = document.getElementById("author-"+counter);
  var author = eleAuthor.innerHTML;
  var permlink = eleAuthor.getAttribute("data-tr-permlink");
   if (accessToken && ele.style.fill !== "#ff0000" ) {
    client.vote(username, author, permlink, 10000, function (err, res) {
      if(err === null && ele.style.fill !== "#ff0000") {
        console.log(res)
        ele.setAttribute("d","M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z");
        ele.style.fill = "#ff0000";
        eleLikeCount.innerHTML = +eleLikeCount.innerHTML + 1;
        notify("Successfully Voted")
      }else{alert(err.error_description,"var(--bs-danger)");}
    });
  } else if (loginType == "keychain" && ele.style.fill !== "#ff0000" ){
      hive_keychain.requestVote(
        username,
        permlink,
        author,
        10000,
        function (response) {
          console.log("voting ...");
          console.log(response);
          if (response.success == true){
            ele.setAttribute("d","M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z");
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

       hive_keychain.requestCustomJson(
          username,
          'follow',
          'Posting',
          json,
          'Follow a User',
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
},180000)

document.querySelectorAll('a[href="#discover"]').forEach(function(ele){
  ele.addEventListener('show.bs.tab', function (event) {
  getNew();
    document.getElementById("loader").classList.replace("invisible","visible")
    if (username === null) {
      document.getElementById("login").classList.replace("invisible","visible")
    }
});});

function filterTag(res,type) {
    counter = 0 ;
     if (type === "feed") {
          eleHome.innerHTML = "";
     }
     else if ( type === "new") { 
       eleDiscover.innerHTML = "";
     }
    
    while( counter < res.length ) {
      if(res[counter] === undefined || JSON.parse(res[counter].json_metadata).image === undefined){
        
      }
      else if (type === "feed" && res[counter].category == "trhome" || res[counter].category == "trvideo") {
          push(res,eleHome);
        }
      else if ( type === "new") { 
          push(res,eleDiscover);
        }
      else { console.log(counter); }

        document.getElementById("loader").classList.replace("visible","invisible")

        counter = counter + 1;
    }
 
}

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

function pushProfileInfo (res) {
  var json = JSON.parse(res[0].posting_json_metadata);
  document.getElementById("profile-info-username").innerHTML = res[0].name;
  document.getElementById("profile-info-about").innerHTML = json.profile.about;
  document.getElementById("profile-info-loc").innerHTML = json.profile.location;
  document.getElementById("profile-info-profile-pic").style.backgroundImage = 'url("' + imgHoster + '/u/' + res[0].name + '/avatar/medium' +'")';
  document.getElementById("profile-info-web").innerHTML = '<a class="text-secondary" target="_blank" rel="noopener" href="'+json.profile.website+'">'+json.profile.website+'</a>';
  document.getElementById("profile-info-created").innerHTML = res[0].created.replace("T"," | ");
  document.getElementById("profile-info-pst-count").innerHTML = res[0].post_count;
  document.getElementById("profile-info-last-up").innerHTML = res[0].last_account_update.replace("T"," | ");
  document.getElementById("profile-info-rep").innerHTML = hive.formatter.reputation(res[0].reputation);
  document.getElementById("profile-info-rec-acc").innerHTML = res[0].recovery_account;
  document.getElementById("profile-info-vp").style.width = res[0].voting_power / 100 + '%';
  document.getElementById("profile-info-vp").innerHTML = res[0].voting_power / 100 + '%';
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

function push (res,type) {
  var json = JSON.parse(res[counter].json_metadata);
  var x ;
  var src ;
  if (json.video) {
    src = json.video[0]
    x = 'vid'
  } else {
    src = json.image.toString()
  }
  type.innerHTML += '<div class="mx-auto card mb-3 bg-white shadow w-max-42"><div class="card-body"><img class="rounded-circle float-start" src="'+imgHoster+'/u/' + res[counter].author + '/avatar/small" alt="user image" height="36" width="36"><a href="?u='+res[counter].author+'" class="tr-username-link card-title fs-6 fw-bold float-start link-dark text-decoration-none" style="margin-left: 3vmin; margin-top: 5px;" id="author-'+counter+type.id+'" data-tr-permlink="'+res[counter].permlink+'">' + res[counter].author + '</a><div style="height: 36px; width: 36px;" class="dot rounded-circle float-end dropdown"><a href="#" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false" aria-haspopup="true"><svg xmlns="http://www.w3.org/2000/svg" width="36" height="26" fill="dark" viewBox="0 0 16 16" style="margin-top: 5px"><path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/></svg></a><ul class="dropdown-menu-end dropdown-menu"><li><a class="dropdown-item" target="_blank" href="https://buymeberri.es/@'+res[counter].author+'">Tip Author</a></li><li><a class="dropdown-item" href="#reblogPop" data-bs-toggle="modal" data-tr-permlink="'+res[counter].permlink+'" data-tr-author="'+res[counter].author+'">Reblog</a></li><li><a class="dropdown-item" href="#sharePop" data-bs-toggle="modal" data-tr-url="'+res[counter].url+'">Share</a></li><li><hr class="dropdown-divider"></li><li><a class="dropdown-item text+-danger disabled" href="#mutePop" data-bs-toggle="modal">Mute Post</a></li></ul></div></div><img src="'+imgHoster+'/p/' + b58(json.image[0]) + '/?format=webp&mode=fit&width=800" data-tr-src="'+src+'" data-tr-type="'+x+'" alt="Image not found" data-tr-author="'+res[counter].author+'" data-tr-permlink="'+res[counter].permlink+'" data-tr-vote="'+res[counter].active_votes.length+'" data-tr-children="'+res[counter].children+'" data-tr-body="'+json.description+'" data-bs-toggle="modal" data-bs-target="#post-tray"><div class="card-body border-bottom"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16" id="like-'+ counter +type.id+'" onclick="like(this.id)"><path class="heartPath" d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/></svg><span id="like-count-'+counter+type.id+'" class="ms-2">'+ res[counter].active_votes.length+'</span><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-chat-square ms-3" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2.5a2 2 0 0 0-1.6.8L8 14.333 6.1 11.8a2 2 0 0 0-1.6-.8H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.4l1.9 2.533a1 1 0 0 0 1.6 0l1.9-2.533a1 1 0 0 1 .8-.4H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/></svg><span class="ms-2">' + res[counter].children +'</span><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-arrow-return-right ms-3" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.5 1.5A.5.5 0 0 0 1 2v4.8a2.5 2.5 0 0 0 2.5 2.5h9.793l-3.347 3.346a.5.5 0 0 0 .708.708l4.2-4.2a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 8.3H3.5A1.5 1.5 0 0 1 2 6.8V2a.5.5 0 0 0-.5-.5z"/></svg></div><div class="card-body text-center"><p class="card-text lead">' + md.render(json.description) + '</p><span class="link-primary satisfy tr-tag">#' + json.tags.toString().replaceAll(",",' </span><span class="link-primary tr-tag">#') + '</span></span></p><p class="card-text text-center"><small class="text-muted satisfy">Last updated on ' + res[counter].last_update.replace("T", " ") + ' utc</small></p></div></div>' ;
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
