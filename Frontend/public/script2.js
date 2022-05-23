var app = new Vue({
    el: "#app",
    data: {
        email: "",
        password: "",
        message: "",
        DragdownStyle: "",
        DragdownMessage: "Dosya Seçilmedi",
        menuSelectionElement: 0,
        students: "",
        studentsBranch:[],
        studentControlBox: 50,
        studentBoxActivePage: 1,
        scrollLimit: 50,
        datalenght: 0,
        search:"",
        search2:"",
        searchBranch:"Hepsi",
        denemetext: ""
    },
    methods: {
        cookieDelete() {
            document.cookie = document.cookie + "; expires=Sun, 25 Nov 2000 10:00:00 UTC;"
        },
        fileChange() {
            this.DragdownStyle = "background-color: green;color:white"
            this.DragdownMessage = document.getElementById("studentExcelInputFile").files[0].name
        },
        ExitAccount() {
            this.cookieDelete();
            window.location.href = "/";
        },
        autoScroll() {//Otomatik scroll Yapmak için kullanılır
            var myInterval = setInterval(() => {//sürekli bir tekrara giriyor
                var a = document.querySelector("#StudentsBox");//scroll yapılacak divi görecek
                this.denemetext = a.childElementCount + "/" + this.students.length
                if (a.scrollHeight - 2000 < a.scrollTop && a.offsetHeight < a.scrollHeight) {//scroll varmı ve belirli limite ulaştımı
                    this.scrollLimit += 50;//belirli limite ulaştıysa 50 veri daha ekleyecek
                }
                if (a.childElementCount > this.students.length && this.students.length != 0) {//maximum limite ulaşıldıysa arttırmayı durduracak
                    clearInterval(myInterval);
                }
            }, 300);
        },
        searchMethod(){
            this.search = this.search2;
        },
        test123(item,index){
            //(search.length == 0 ? index<scrollLimit:true && (isNaN(search) ? item.name.toUpperCase().indexOf(search.toUpperCase()) != -1 : item.number==search)) && (searchBranch == 'Hepsi' ? true: (item.grade+' - '+item.branch).trim() == (searchBranch).trim())
            return (this.search.length == 0 ? index<this.scrollLimit:true && (isNaN(this.search) ? item.name.toUpperCase().indexOf(this.search.toUpperCase()) != -1 : item.number==this.search)) && (this.searchBranch == 'Hepsi' ? true: (item.grade+' - '+item.branch).trim() == (this.searchBranch).trim())
        }
    },
    created() {
        var cookie = document.cookie.split(",");
        cookie[0] = cookie[0].split("=");
        cookie[1] = cookie[1].split("=");
        mydata = {
            email: cookie[0][1],
            password: cookie[1][1]
        }
        this.email = mydata.email;
        this.password = mydata.password;
        //müşteri doğrulama
        fetch("/getCustomer", {
            method: "post",
            body: JSON.stringify(mydata),
            headers: { "Content-type": "application/json" }
        })
            .then(response => response.json())
            .then(json => this.message = json)
            .catch(deneme => console.log(deneme))
        //öğürencileri çekme
        fetch("/getStudents", {
            method: "post",
            body: JSON.stringify(mydata),
            headers: { "Content-type": "application/json" }
        })
            .then(response => response.json())
            .then(json => {
                this.students = json;
                this.autoScroll();
                this.scrollLimit = 50;
                this.students.forEach(element1 => {
                    var control = true;
                    this.studentsBranch.forEach(element2 =>{
                        if(element1.grade+" - "+element1.branch == element2){
                            control = false;
                        }
                    })
                    if(control) this.studentsBranch[this.studentsBranch.length] = element1.grade+" - "+element1.branch;
                });
                console.log(this.studentsBranch);
            })
            .catch(deneme => console.log(deneme))
    }
})


