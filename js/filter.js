importScripts('b58.js',"//cdn.jsdelivr.net/npm/remarkable@2.0.1/dist/remarkable.min.js")

const imgHoster = "https://images.ecency.com";
var md = new remarkable.Remarkable({html: true,})
md.use(remarkable.linkify)

addEventListener("message",function(e){
  const [r,t] = e.data;
  filter(r,t)
})

function filter(res,type) {
    counter = 0 ;
    
    while( counter < res.length ) {
      if(res[counter] === undefined || JSON.parse(res[counter].json_metadata).image === undefined){
        console.log("undefined at filter:filter.js")
      }
      else if (type === "feed" && res[counter].category == "trhome" || res[counter].category == "trvideo") {
          pushy(res,"home");
        }
      else if ( type === "new" ) { 
          pushy(res,"discover");
        }
      else { console.log(counter); }

        counter = counter + 1;
    }
}


function pushy (res,type) {
  var json = JSON.parse(res[counter].json_metadata);
  var x ;
  var src ;
  if (json.video) {
    src = json.video[0]
    x = 'vid'
  } else {
    src = json.image.toString()
  }
  var html = '<div class="mx-auto card mb-3 bg-white shadow w-max-42"><div class="card-body"><img class="rounded-circle float-start" src="'+imgHoster+'/u/' + res[counter].author + '/avatar/small" alt="user image" height="36" width="36"><a href="?u='+res[counter].author+'" class="tr-username-link card-title fs-6 fw-bold float-start link-dark text-decoration-none" style="margin-left: 3vmin; margin-top: 5px;" id="author-'+counter+type.id+'" data-tr-permlink="'+res[counter].permlink+'">' + res[counter].author + '</a><div style="height: 36px; width: 36px;" class="dot rounded-circle float-end dropdown"><a href="#" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false" aria-haspopup="true"><svg width="36" height="26" fill="dark" style="margin-top: 5px"><use href="#bi-three-dots"/></svg></a><ul class="dropdown-menu-end dropdown-menu"><li><a class="dropdown-item" target="_blank" rel="noopener" href="https://buymeberri.es/@'+res[counter].author+'">Tip Author</a></li><li><a class="dropdown-item" href="#reblogPop" data-bs-toggle="modal" data-tr-permlink="'+res[counter].permlink+'" data-tr-author="'+res[counter].author+'">Reblog</a></li><li><a class="dropdown-item" href="#sharePop" data-bs-toggle="modal" data-tr-url="'+res[counter].url+'">Share</a></li><li><hr class="dropdown-divider"></li><li><a class="dropdown-item text+-danger disabled" href="#mutePop" data-bs-toggle="modal">Mute Post</a></li></ul></div></div><img src="'+imgHoster+'/p/' + b58(json.image[0]) + '/?format=webp&mode=fit&width=800" data-tr-src="'+src+'" data-tr-type="'+x+'" alt="Image not found" data-tr-author="'+res[counter].author+'" data-tr-permlink="'+res[counter].permlink+'" data-tr-vote="'+res[counter].active_votes.length+'" data-tr-children="'+res[counter].children+'" data-tr-body="'+json.description+'" data-bs-toggle="modal" data-bs-target="#post-tray"><div class="card-body border-bottom"><svg width="22" height="22" fill="currentColor" class="bi bi-heart" id="like-'+ counter +type.id+'" onclick="like(this.id)"><use href="#bi-heart"/></svg><span id="like-count-'+counter+type.id+'" class="ms-2">'+ res[counter].active_votes.length+'</span><svg  width="22" height="22" fill="currentColor" class="bi bi-chat-square ms-3"><use href="#bi-chat-square"/></svg><span class="ms-2">' + res[counter].children +'</span><svg width="22" height="22" fill="currentColor" class="bi bi-arrow-return-right ms-3"><use href="#bi-arrow-return-right"/></svg></div><div class="card-body text-center"><p class="card-text lead">' + md.render(json.description) + '</p><span class="link-primary satisfy tr-tag">#' + json.tags.toString().replaceAll(",",' </span><span class="link-primary tr-tag">#') + '</span></span></p><p class="card-text text-center"><small class="text-muted satisfy">Last updated ' + timeDiff(res[counter].last_update) + '</small></p></div></div>' ;
  
  postMessage([html,type])
}
