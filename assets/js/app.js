const cl = console.log;

const postContainer = document.getElementById("postContainer");
const postform = document.getElementById("postfrom");
const submtbtn = document.getElementById("submtbtn");
const updtbtn = document.getElementById("updtbtn");
const titleControl = document.getElementById("title");
const bodyControl = document.getElementById("body");
const userIdControl = document.getElementById("userId");

let baseUrl = `https://jsonplaceholder.typicode.com`;
let postUrl = `${baseUrl}/posts`;

const onAddPost = eve => {
    eve.preventDefault();
    let postobj = {
        title : titleControl.value,
        body: bodyControl.value,
        userId : userIdControl.value
    }
    cl(postobj)
    makeApicall("POST", postUrl, postobj);
}

const onEdit = eve => {
    let cardid = eve.closest(".card").id;
    localStorage.setItem("editId", cardid);
    let editurl = `${postUrl}/${cardid}`;
    makeApicall("GET", editurl);
}

const onUpdate = () => {
    let updtid = localStorage.getItem("editId");
    let updturl = `${postUrl}/${updtid}`;
    let updtobj = {
        title : titleControl.value,
        body : bodyControl.value,
        userId : userIdControl.value,
        id : updtid
    }
    makeApicall("PUT", updturl, updtobj);
}

const onRemove = (eve) => {
    let deleteid = eve.closest(".card").id;
    let deleteurl = `${postUrl}/${deleteid}`;
    makeApicall("DELETE", deleteurl);
}

const templatingofPosts = (eve) => {
    let result = " ";
    eve.forEach(ele => {
        result += `
                <div class="card mb-2" id=${ele.id}>
                    <div class="card-header">
                        <h2>${ele.title}</h2>
                    </div>
                    <div class="card-body">
                        <p>${ele.body}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button class="btn btn-primary" type="button" onclick="onEdit(this)">Edit</button>
                        <button class="btn btn-danger" type="button" onclick="onRemove(this)">Delete</button>
                    </div>
                </div>
        `
    });
    postContainer.innerHTML = result;
}

const addPostTemplating = eve => {
    let card = document.createElement('div');
    card.className = 'card mb-2';
    card.id = eve.id;
    card.innerHTML = `
                <div class="card-header">
                    <h2>${eve.title}</h2>
                </div>
                <div class="card-body">
                    <p>${eve.body}</p>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button class="btn btn-primary" type="button">Edit</button>
                    <button class="btn btn-danger" type="button">Delete</button>
                </div>
    `
    postContainer.append(card);
}

const makeApicall = (methodname, apiUrl, body = null) => {
    let xhr = new XMLHttpRequest();
    xhr.open(methodname, apiUrl);
    // xhr.setRequestHeader('content-type', 'application/json');
    xhr.send(JSON.stringify(body));
    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status < 300 || xhr.readyState === 4){
            let data = JSON.parse(xhr.response);
            if(methodname === "GET"){
                if(Array.isArray(data)){
                    templatingofPosts(data);
                }else{
                    titleControl.value = data.title;
                    bodyControl.value = data.body;
                    userIdControl.value = data.userId;
                    submtbtn.classList.add("d-none");
                    updtbtn.classList.remove("d-none");
                    scroll();
                }
            }else if(methodname === "POST"){
                addPostTemplating(body);
                postform.reset();
            }else if(methodname === "PUT"){
                let updtid = JSON.parse(xhr.response).id;
                let card = document.getElementById(updtid);
                let childcard = [...card.children];
                childcard[0].innerHTML = `<h2>${body.title}</h2>`;
                childcard[1].innerHTML = `<p>${body.body}</p>`;
                updtbtn.classList.add("d-none");
                submtbtn.classList.remove("d-none");
                postform.reset();
            }else if(methodname === "DELETE"){
                let getindex = apiUrl.indexOf('posts/');
                let getid = apiUrl.slice(getindex + 6);
                document.getElementById(getid).remove();
            }else{
                alert('something went wrong !!!')
            }
        }else{
            alert('something went wrong !!!')
        }
    }
}

makeApicall("GET", postUrl);

      


postform.addEventListener("submit", onAddPost);
updtbtn.addEventListener("click", onUpdate);

function scroll() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
}