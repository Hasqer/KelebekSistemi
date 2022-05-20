var app = new Vue({
    el:"#app",
    data:{
        email:"",
        password:"",
        message:"",
        DragdownStyle:"",
        DragdownMessage:"Dosya Seçilmedi",
        menuSelectionElement:0,
        students:"",
        studentControlBox:50,
        studentBoxActivePage:1,
        scrollLimit:50,
        datalenght:0,
        denemetext:""
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
        },
        autoScroll(){//Otomatik scroll Yapmak için kullanılır
            var myInterval = setInterval(() => {//sürekli bir tekrara giriyor
                var a = document.querySelector("#StudentsBox");//scroll yapılacak divi görecek
                this.denemetext = a.childElementCount +"/"+ this.students.length
                if(a.scrollHeight - 2000 < a.scrollTop && a.offsetHeight < a.scrollHeight){//scroll varmı ve belirli limite ulaştımı
                    this.scrollLimit+=50;//belirli limite ulaştıysa 50 veri daha ekleyecek
                }
                if(a.childElementCount > this.students.length && this.students.length != 0){//maximum limite ulaşıldıysa arttırmayı durduracak
                    clearInterval(myInterval);
                }
            }, 300);
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
        .catch(deneme => console.log(deneme))
        //öğürencileri çekme
            fetch("/getStudents",{
                method:"post",
                body:JSON.stringify(mydata),
                headers:{"Content-type":"application/json"}
            })
            .then(response => response.json())
            .then(json => {
                this.students = json;
                this.autoScroll();
                this.scrollLimit=50;
            })
            .catch(deneme =>  console.log(deneme))
        /*
        this.students=[
            {
                customerid:"123",
                studentsName:"Ali",
                studentsSurname:"Yaşar",
                studentsNumber:"453",
                studentBranch:"A",
                studentsID:"12412321",
                studentsLevel:"9"
            },{
                customerid:"321",
                studentsName:"Mehmet",
                studentsSurname:"Ilık",
                studentsNumber:"564",
                studentBranch:"C",
                studentsID:"154623",
                studentsLevel:"10"
            },{
                customerid:"231",
                studentsName:"Selim",
                studentsSurname:"Karaca",
                studentsNumber:"312",
                studentBranch:"C",
                studentsID:"756",
                studentsLevel:"11"
            },{
                customerid:"441",
                studentsName:"Pelin",
                studentsSurname:"Nasıroğlu",
                studentsNumber:"398",
                studentBranch:"E",
                studentsID:"145",
                studentsLevel:"11"
            }
        ]*/
        
    }
})