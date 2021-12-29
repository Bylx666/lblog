// writer
function inputExporter() { 
    var content = document.getElementById('writePad').value
    var name = document.getElementById('fileName').value
    var title = document.getElementById('title').value
    var tags = function () { 
        var tagArray = []
        for(var i = 0;i<document.getElementsByClassName('tag').length;i++){
            var tag = document.getElementsByClassName('tag')[i].innerHTML
            tagArray = tagArray.concat(['\''+tag+'\''])
        }
        return tagArray
     }
    if(name=='') name = 'index'
    if(title=='') title = 'untitled'
    content = content+'<script>title=\''+title+'\';tags=['+tags()+']</script>'
    var blob = new Blob([content],{type: 'text/html'})
    var url = URL.createObjectURL(blob)
    document.getElementById('exportButton').setAttribute('href',url)
    document.getElementById('exportButton').setAttribute('download',name+'.html')
 }
function addTag() { 
    var content = document.getElementById('newTag').value
    if(content=='') return
    var bt = document.getElementById('addTag')
    bt.outerHTML = '<div id="tagOf'+content+'" class="tag" onclick="removeTag(\''+content+'\')">'+content+'</div><div id="addTag" onclick="addTag()">+</div>'
 } 
function removeTag(ct) { 
    document.getElementById('tagOf'+ct).remove()
 }
function render() { 
    var content = document.getElementById('writePad').value
    content = content.replace(/\*\*\*/g,'<hr>') 
    content = content.replace(/\n/g,'</br>') 

    document.getElementById('renderer').innerHTML = content
 }

// 