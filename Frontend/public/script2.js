var app = new Vue({
    el:"#app",
    data:{
        message:""
    },
    methods:{
        cookieDelete(){
            document.cookie = document.cookie+"; expires=Sun, 25 Nov 2000 10:00:00 UTC;"
        }
    },
    created() {
        var cookie = document.cookie.split(",");
        cookie[0] = cookie[0].split("=");
        cookie[1] = cookie[1].split("=");
        mydata={
            email:cookie[0][1],
            password:cookie[1][1]
        }
        fetch("/getuser",{
            method:"post",
            body:JSON.stringify(mydata),
            headers:{"Content-type":"application/json"}
        })
        .then(response => response.json())
        .then(json => this.message = json.userInfo)
    }
})