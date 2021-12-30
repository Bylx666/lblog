
var writer = {
    inputExporter:function () { 
    var content = document.getElementById('wwritePad').value;
    var name = document.getElementById('wfileName').value;
    var title = document.getElementById('wtitle').value;
    var tags = function () { 
        var tagArray = [];
        for(var i = 0;i<document.getElementsByClassName('wtag').length;i++){
            var tag = document.getElementsByClassName('wtag')[i].innerHTML;
            tagArray = tagArray.concat(['\''+tag+'\'']);
        }
        return tagArray;
     }
    if(name=='') name = 'index';
    if(title=='') title = 'untitled';
    content = content+'<script>title=\''+title+'\';tags=['+tags()+']</script>';
    var blob = new Blob([content],{type: 'text/html'});
    var url = URL.createObjectURL(blob);
    document.getElementById('wexportButton').setAttribute('href',url);
    document.getElementById('wexportButton').setAttribute('download',name+'.html');
 },
 addTag:function () { 
    var content = document.getElementById('wnewTag').value;
    if(content=='') return;
    var bt = document.getElementById('waddTag');
    bt.outerHTML = '<div id="wtagOf'+content+'" class="wtag" onclick="writer.removeTag(\''+content+'\')">'+content+'</div><div id="waddTag" onclick="writer.addTag()">+</div>';
 },
 removeTag:function (ct) { 
    document.getElementById('wtagOf'+ct).remove()
 },
 render:function () { 
    var content = document.getElementById('wwritePad').value;
    content = content.replace(/\*\*\*/g,'<hr>') ;
    content = content.replace(/\n/g,'</br>') ;

    document.getElementById('wrenderer').innerHTML = content;
 }
};

var builder = {
    maxId:1,
    add:function () { 
        var value = document.getElementById('bUrls').value.replace(';','')
        if(value=='') return document.getElementById('bwarning').innerHTML = 'Nothing input!'
        var urls = value.split('\n')
        for(let i=0;i<urls.length;i++){
            let xhr = new XMLHttpRequest()
            if(!urls[i].includes('http://')) urls[i] = 'http://'+urls[i]
            xhr.open('get',urls[i])
            xhr.send()
            xhr.onreadystatechange = function () { 
                if(xhr.readyState==4&&xhr.status==200){
                    var txt = xhr.responseText
                    if(!xhr.responseText.includes('<script>title=\'')) return document.getElementById('bwarning').innerHTML = 'unvalid file!'
                    var title = /(?<=title=').*?(?=')/g.exec(txt)
                    var tags = /(?<=;tags=).*]/g.exec(txt)
                    var id = builder.maxId
                    var content = 
                        '<div class="bitem" id="bitemOf('+id+')">'+
                            '<div class="brmFile" onclick="document.getElementById(\'bitemOf('+id+')\').remove()"></div>'+
                            '<div class="bid">'+id+'</div>'+
                            '<div class="bfile"><a target="_blank" href="'+urls[i]+'">'+urls[i]+'</a></div>'+
                            '<div class="btitle">'+title+'</div>'+
                            '<div class="btags">'+tags+'</div>'+
                        '</div>'
                    document.getElementById('bcontent').innerHTML += content
                    document.getElementById('bwarning').innerHTML = ''
                    builder.maxId ++
                    document.getElementById('bUrls').value = ''
                }else if(xhr.status==404){
                    document.getElementById('bwarning').innerHTML = 'File not found!'
                }else{
                    document.getElementById('bwarning').innerHTML = 'Loading'
                }
             }
        }
     },
    export:function () { 
        var content = document.getElementsByClassName('bitem')
        var json = ''
        for(var i=1;i<content.length;i++){
            var id = content[i].childNodes[1].innerHTML
            var file = content[i].childNodes[2].childNodes[0].innerHTML
            var node = '{\"file\":\"'+file+'\"},'
            if(i==content.length-1) node = '{\"file\":\"'+file+'\"}'
            json += node
        }
        json = '{"list":['+json+']}'
        var dl = new Blob([json],{type:"application/json"})
        var url = URL.createObjectURL(dl)
        document.getElementById('bexportButton').setAttribute('href',url)
        document.getElementById('bwarning').innerHTML = 'Copy it with blog index together!'
     }
}

var blog = {
    articles:'',
    getArticles:function () { 
        var articlesJson = window.location.href.replace('index.html','') + 'data.json'
        if(articlesJson.includes('file:///')) articlesJson = 'http://localhost:8080/data.json'
        var xhr = new XMLHttpRequest()
        xhr.open('get',articlesJson)
        xhr.send()
        xhr.onreadystatechange = function () { 
            if(xhr.readyState==4&&xhr.status==200){
                blog.articles = JSON.parse(xhr.response)
            }
         }
     }
}