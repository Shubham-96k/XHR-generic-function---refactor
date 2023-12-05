const cl = console.log;

const postContainer = document.getElementById("postContainer");
const postform = document.getElementById("postfrom");
const submtbtn = document.getElementById("submtbtn");
const updtbtn = document.getElementById("updtbtn");
const titleControl = document.getElementById("title");
const bodyControl = document.getElementById("body");
const userIdControl = document.getElementById("userId");
const loader = document.getElementById("loader");

let baseUrl = `https://jsonplaceholder.typicode.com`;
let postUrl = `${baseUrl}/posts`;

//###### function on which event binded and called api 

const onAddPost = eve => {
    eve.preventDefault();
    let postobj = {
        title : titleControl.value,
        body: bodyControl.value,
        userId : userIdControl.value
    }
    makeApicall("POST", postUrl, addpostfunction, postobj);
}
const onEdit = eve => {
    let cardid = eve.closest(".card").id;
    localStorage.setItem("editId", cardid);
    let editurl = `${postUrl}/${cardid}`;
    makeApicall("GET", editurl, editfunction);
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
    makeApicall("PUT", updturl, updatefunction, updtobj);
}
const onRemove = (eve) => {
    let deleteid = eve.closest(".card").id;
    // localStorage.setItem("editId", JSON.stringify(deleteid));
    let deleteurl = `${postUrl}/${deleteid}`;
    makeApicall("DELETE", deleteurl, deletefunction);
}

//######### written separate codes for get,edit,post,put/patch & delete function 
//and passed as an argument in api call

const getfunction = eve => {
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
const editfunction = ele => {
    titleControl.value = ele.title;
    bodyControl.value = ele.body;
    userIdControl.value = ele.userId;
    submtbtn.classList.add("d-none");
    updtbtn.classList.remove("d-none");
    scroll();
}
const addpostfunction = (eve) => {
    let obj = JSON.parse(localStorage.getItem("bodyobj"));
    let card = document.createElement('div');
    card.className = 'card mb-2';
    card.id = eve.id;
    card.innerHTML = `
                <div class="card-header">
                    <h2>${obj.title}</h2>
                </div>
                <div class="card-body">
                    <p>${obj.body}</p>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button class="btn btn-primary" type="button">Edit</button>
                    <button class="btn btn-danger" type="button">Delete</button>
                </div>
    `
    Swal.fire({
        icon: "success",
        title: "Post has been added !!!",
        showConfirmButton: false,
        timer: 1500
      });
    postContainer.append(card);
    postform.reset();
}
const updatefunction = ele => {
    let card = [...document.getElementById(ele.id).children];
    let object = JSON.parse(localStorage.getItem("bodyobj"))
    card[0].innerHTML = `<h2>${object.title}</h2>`;
    card[1].innerHTML = `<p>${object.body}</p>`;
    updtbtn.classList.add("d-none");
    submtbtn.classList.remove("d-none");
    postform.reset();
    Swal.fire({
        icon: "success",
        title: "Post has been updated successfully",
        showConfirmButton: false,
        timer: 1500
      });
}
const deletefunction = (ele, url) => {
    // document.getElementById(JSON.parse(localStorage.getItem("editId"))).remove();
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
            let getindex = url.indexOf("posts/");
            let getid = url.slice(getindex + 6);
            document.getElementById(getid).remove();
            Swal.fire({
                title: "Deleted!",
                text: "Your post has been deleted.",
                icon: "success",
                timer: 1000
            });
        }
      });
}

// ######### API call using xmlhttprequest with generic function ########

const makeApicall = (methodname, apiUrl, callbackfn, body = null) => {
    loader.classList.remove("d-none");
    let xhr = new XMLHttpRequest();
    xhr.open(methodname, apiUrl);
    xhr.send(JSON.stringify(body));
    localStorage.setItem("bodyobj", JSON.stringify(body));
    xhr.onload = function(){
        loader.classList.add("d-none");
        if(xhr.status >= 200 && xhr.status < 300 || xhr.readyState === 4){
            let data = JSON.parse(xhr.response);
            callbackfn(data, apiUrl)
        }else{
            alert(`error ${xhr.status}`);
        }
    }
    xhr.onerror = function(){
        loader.classList.add("d-none");
    }
}

makeApicall("GET", postUrl, getfunction);

      
postform.addEventListener("submit", onAddPost);
updtbtn.addEventListener("click", onUpdate);

function scroll() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
}