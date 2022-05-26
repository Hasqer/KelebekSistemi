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
        studentsBranch: [],
        studentControlBox: 50,
        studentBoxActivePage: 1,
        scrollLimit: 50,
        datalenght: 0,
        search: "",
        search2: "",
        searchBranch: "Hepsi",
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
        autoScroll() { //Otomatik scroll Yapmak için kullanılır
            var myInterval = setInterval(() => { //sürekli bir tekrara giriyor
                var a = document.querySelector("#StudentsBox"); //scroll yapılacak divi görecek
                this.denemetext = a.childElementCount + "/" + this.students.length
                if (a.scrollHeight - 2000 < a.scrollTop && a.offsetHeight < a.scrollHeight) { //scroll varmı ve belirli limite ulaştımı
                    this.scrollLimit += 50; //belirli limite ulaştıysa 50 veri daha ekleyecek
                }
                if (a.childElementCount > this.students.length && this.students.length != 0) { //maximum limite ulaşıldıysa arttırmayı durduracak
                    clearInterval(myInterval);
                }
            }, 300);
        },
        searchMethod() {
            this.search = this.search2;
        },
        test123(item, index) {
            var one = false,
                two = false,
                three = false;

            //(search.length == 0 ? index<scrollLimit:true && (isNaN(search) ? item.name.toUpperCase().indexOf(search.toUpperCase()) != -1 : item.number==search)) && (searchBranch == 'Hepsi' ? true: (item.grade+' - '+item.branch).trim() == (searchBranch).trim())

            /*
            if (this.search.length == 0) one = index < this.scrollLimit;
            else one = true;*/

/*
            if (this.searchBranch == 'Hepsi' && this.scrollCount < this.scrollLimit) one = true;
            else if (this.searchBranch != 'Hepsi') {
                one = true;
                this.scrollLimit=50;
            }
            else one = false;*/
            one = true;
            
            
            //sadece isim de arama yapıyor soy isimdede arama yapmalı
            if (isNaN(this.search) && this.search.length > 0) two = ((item.name+" "+item.surname).toLowerCase().indexOf(this.search.toLowerCase()) != -1 || (item.name+" "+item.surname).toUpperCase().indexOf(this.search.toUpperCase()) != -1);
            else if (this.search.length <= 0) two = true;
            else two = (item.number == this.search);

            if (this.searchBranch == 'Hepsi') three = true;
            else three = (item.grade + ' - ' + item.branch).trim() == (this.searchBranch).trim();
            return (one && two && three);
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
                headers: {
                    "Content-type": "application/json"
                }
            })
            .then(response => response.json())
            .then(json => this.message = json)
            .catch(deneme => console.log(deneme))
        //öğrencileri çekme
        fetch("/getStudents", {
                method: "post",
                body: JSON.stringify(mydata),
                headers: {
                    "Content-type": "application/json"
                }
            })
            .then(response => response.json())
            .then(json => {
                this.students = json;
                this.autoScroll();
                this.scrollLimit = 50;
                this.students.forEach(element1 => {
                    var control = true;
                    this.studentsBranch.forEach(element2 => {
                        if (element1.grade + " - " + element1.branch == element2) {
                            control = false;
                        }
                    })
                    if (control) this.studentsBranch[this.studentsBranch.length] = element1.grade + " - " + element1.branch;
                });
            })
            .catch(deneme => console.log(deneme))
    }
})