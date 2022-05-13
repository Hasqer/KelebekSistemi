function button(){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/home", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        email:"test@gmail.com",
        password:"test"
    }));
    console.log("başarılı bir şekilde eklendi");
    window.location.href ="/";
}

function button2(){
    var form = document.querySelector(".myform");
    var a = document.createElement("form");
    a.name = "asd";
    a.method = "post";
    a.action = "/home";
    var b = document.createElement("input");
    b.name = "email";
    var c = document.createElement("input");
    c.name = "password";
    c.type = "text";
    b.type = "text";
    b.value =  form.email.value;
    c.value = "test";
    var d = document.createElement("button");
    a.appendChild(b);
    a.appendChild(c);
    a.appendChild(d);
    console.log(a);
    
    document.querySelector(".loginBox").appendChild(a);a.submit();
    /*
    var form = document.querySelector(".myform");
    form.email.value = "test@gmail.com";
    form.password.value = "test";
    //form.submit();
    console.log(form.method);*/
}

/*
  
var app = new Vue({
    el:".loginBox",
    data:{
        message:"test1"
    }
})*/