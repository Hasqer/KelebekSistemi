var app = new Vue({
    el:"#app",
    data:{
        message:""
    },
    methods:{

    },
    created() {
        mydata={
            email:"test@gmail.com",
            password:"9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"
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