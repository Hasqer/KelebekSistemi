var app = new Vue({
    el:"#app",
    data:{
        email:"",
        password:"",
        message:"",
        DragdownStyle:"",
        DragdownMessage:"Dosya Seçilmedi",
        menuSelectionElement:0
    },
    methods:{
        cookieDelete(){
            document.cookie = document.cookie+"; expires=Sun, 25 Nov 2000 10:00:00 UTC;"
        },
        fileChange(){
            this.DragdownStyle = "background-color: green;color:white"
            this.DragdownMessage = document.getElementById("studentExcelInputFile").files[0].name
        },
        ExitAccount(){
            this.cookieDelete();
            window.location.href="/";
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
        this.email = mydata.email;
        this.password = mydata.password;
        //müşteri doğrulama
        fetch("/getCustomer",{
            method:"post",
            body:JSON.stringify(mydata),
            headers:{"Content-type":"application/json"}
        })
        .then(response => response.json())
        .then(json => this.message = json)
        //öğürencileri çekme
        try {
            fetch("/getStudents",{
                method:"post",
                body:JSON.stringify(mydata),
                headers:{"Content-type":"application/json"}
            })
            .then(response => response.json())
            .then(json => console.log(json))
        } catch (error) {
            
        }
        
    }
})