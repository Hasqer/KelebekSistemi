var app = new Vue({
    el:".loginBox",
    data:{
        message:"test1"
    },
    methods:{
        button(){
            alert("methoda girdim");
            var mydata ={
                email:"test@gmail.com",
                password:"test"
            }
            fetch("/checkUser",{
                method:"post",
                body:JSON.stringify(mydata),
                headers:{"Content-type":"application/json"}
            })
            .then(response => response.json())
            .then(json => console.log(json))
            .catch(err => console.log(err));
        }
    }
})