var navbar = document.querySelector('.fixed-top');
    window.onscroll = function() {
      if (window.scrollY > 300) {
          navbar.classList.add('bg-nav-white');
          navbar.classList.replace('navbar-dark','navbar-light')
      } else {
          navbar.classList.remove('bg-nav-white');
          navbar.classList.replace('navbar-light','navbar-dark')
      }
  };
  getBlog()
  function getBlog() {
    var url = "https://api.hive.blog";

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
          console.log(xhr.status);
          pushBlog(JSON.parse(xhr.responseText));
       }};

    var data = '{"jsonrpc":"2.0", "method":"condenser_api.get_blog_entries", "params":["terrive",0,5], "id":1}';

    xhr.send(data);
  }
  function pushBlog(res) {
    var i = 0;
    while(i < res.result.length) {
      document.getElementById('blog').innerHTML += '<div class="card mt-3 mx-auto border-0 shadow" style="max-width: 42em;"><img src="https://images.ecency.com/p/ADdPNihJzmPc6cMNdFWhXtGFVjABfghsMP7ZwGbDKuSnQFUcRt5Nhy41yDe7rMJKEWdKhBcXaL5fK5JwBHtEpSTY2.webp?format=webp&mode=fit" class="card-img-top" alt="..."><div class="card-body"><h5 class="card-title">By: <span class="text-tr satisfy">'+res.result[i].author+'</span></h5><h5 class="card-title">'+res.result[i].permlink.replaceAll("-"," ")+'</h5><a target="_blank" rel="noopener" href="https://hivel.ink/@'+res.result[i].author+'/'+res.result[i].permlink+'" class="border-bottom-tr btn border-2 text-tr mt-3 btn-blog">Read Blog</a></div></div>'
      i = i + 1;
    }
  }
