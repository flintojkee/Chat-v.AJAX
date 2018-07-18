const chatPage = document.getElementById("chat-page");
const loginPage = document.getElementById("login-page");
let userName, userNickname;
function main() {

    const userHeader = document.getElementById('userHeader');
    const nameButton = document.getElementById('nameButton');
    const nameInput = document.getElementById('nameInput');
    const messages = document.getElementById('messages');
    const users = document.getElementById('users');
    const text = document.getElementById('text');
    const textSubmit = document.getElementById('textSubmit');


    userHeader.innerText = userName+" "+userNickname;


    textSubmit.onclick = function () {
        let data = {
            name:userNickname,
            text: text.value
        };

        if (text.value.trim() === '') {
            text.value = '';
            return false;
        }else{
            text.value = '';

            ajaxRequest({
                method:'POST',
                url:'/message',
                data:data
            })
        }
    };

    let getData = function () {
        ajaxRequest({
            url:'/messages',
            method:'GET',
            callback:function (msg) {
                msg = JSON.parse(msg);
                messages.innerHTML = '';
                for(let i in msg){
                    if(msg.hasOwnProperty(i)){
                        let el = document.createElement('li');
                        if(isMentioned(msg[i].text, userNickname)){
                            el.classList.add("mention");
                        }

                        el.innerText = msg[i].name + ": " + msg[i].text;
                        messages.appendChild(el);
                    }
                }
            }
        })
    };

    let getUsers = function () {
        ajaxRequest({
            url:'/users',
            method:'GET',
            callback:function (user) {
                user = JSON.parse(user);
                users.innerHTML = '';
                for(let i in user){
                    if(user.hasOwnProperty(i)){
                        let el = document.createElement('li');
                        el.innerText = "Name: "+user[i].name + " Nickname: " + user[i].nickName;
                        users.appendChild(el);
                    }
                }
            }
        })
    };

    getData();
    getUsers();
    setInterval(function () {
        getData();
        getUsers();
    }, 1000);
};

let ajaxRequest = function (options) {
    let url = options.url || "/";
    let method = options.method;
    let callback = options.callback || function () {};
    let data = options.data || {};
    let xmlHttp = new XMLHttpRequest();

    xmlHttp.open(method, url, true);
    xmlHttp.setRequestHeader('Content-Type', 'application/json');
    xmlHttp.send(JSON.stringify(data));

    xmlHttp.onreadystatechange = function () {
        if(xmlHttp.status === 200 && xmlHttp.readyState === 4){
            callback(xmlHttp.responseText);
        }
    };
};


function login() {
    let nameInput = document.getElementById('name-input');
    let nickNameInput = document.getElementById('nickname-input');

    if (nameInput.value.trim() === '' || nickNameInput.value.trim()==='') {
        return false
    } else {
        chatPage.classList.remove("hidden");
        loginPage.classList.add("hidden");
        userName = nameInput.value;
        userNickname = nickNameInput.value;
        let user ={
            name: userName,
            nickName: userNickname
        };
        ajaxRequest({
            method:'POST',
            url:'/user',
            data:user
        });
        main();
    }
}

window.onbeforeunload = function removeUser(){

    let user ={
        name: userName,
        nickName: userNickname
    };
    ajaxRequest({
        method:'DELETE',
        url:'/user',
        data:user
    });
    return false;
};


function isMentioned(message,username) {
    let mention =  "@"+username;
    console.log(message.includes(mention));
    return message.includes(mention);
}