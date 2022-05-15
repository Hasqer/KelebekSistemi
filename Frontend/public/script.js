var app = new Vue({
    el: "#app",
    data: {
        UserInputEmail: "",
        UserInputpassword: "",
        UserInputpassword2:"",
        singStatus:true,
        warning1:"",
        rememberChacked:false,
        customerName:"",
        customerSurname:""
    },
    methods: {
        CheckCustomer() {
            var mydata = { // kullanıcı verilerinin hazırlanması
                email: this.UserInputEmail,
                password: ""
            }
            this.ConvertHash(this.UserInputpassword).then((hash) => { // şifrenin hash'e çevrilmesi
                mydata.password = hash;
                fetch("/checkCustomer", { // kullanıcı bilgi kontrolü
                    method: "post",
                    body: JSON.stringify(mydata),
                    headers: { "Content-type": "application/json" }
                })
                    .then(response => response.json())
                    .then(json => {
                        if(json.check == "true"){//kullanıcı bilgileri doğru ve kaydediliyor
                            if(this.rememberChacked)document.cookie = document.cookie = "email="+mydata.email+",password="+mydata.password+"; expires=Sun, 25 Nov "+(new Date().getFullYear()+1)+" 10:00:00 UTC; path=/";//cookie oluşturma (kalıcı)
                            else document.cookie = document.cookie = "email="+mydata.email+",password="+mydata.password+"; path=/";//cookie oluşturma (tarayıcı kapanana kadar)
                            window.location.href="/home";
                        }
                        else{//kullanıcı bilgileri yanlış
                            alert("Kullanıcı bilgileri yanlış!");
                        }
                    })
            });
        },
        ConvertHash(string) { // girilen verinin hash'e çevrilmesi
            const utf8 = new TextEncoder().encode(string);
            return crypto.subtle.digest('SHA-256', utf8).then((hashBuffer) => {
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const hashHex = hashArray
                    .map((bytes) => bytes.toString(16).padStart(2, '0'))
                    .join('');
                return hashHex;
            });
        },
        giris(){//giriş veya kayıt olma kısmının seçilmesi
            this.singStatus = !this.singStatus;
        },
        checkSingInPassword(){//iki şifrenin doğruluğu kontrol ediliyor
            if(this.UserInputpassword == this.UserInputpassword2) this.warning1="";
            else this.warning1="Şifreler Aynı Değil!";
        },
        CreateCustomer(){
            var mydata = { // kullanıcı verilerinin hazırlanması
                emailInfo: this.UserInputEmail,
                nameInfo: this.customerName,
                surnameInfo: this.customerSurname,
                passwordInfo: ""
            }
            this.ConvertHash(this.UserInputpassword).then((hash) => { // şifrenin hash'e çevrilmesi
                mydata.passwordInfo = hash;
                fetch("/createCustomer", { //
                    method: "post",
                    body: JSON.stringify(mydata),
                    headers: { "Content-type": "application/json" }
                })
                    .then(response => response.json())
                    .then(json => {
                        if(json.check == "true"){//kullanıcı bilgileri doğru ve kaydediliyor
                            document.cookie = document.cookie = "email="+mydata.emailInfo+",password="+mydata.passwordInfo+"; path=/";//cookie oluşturma (tarayıcı kapanana kadar)
                            window.location.href="/home";
                        }
                        else{//kullanıcı bilgileri yanlış
                            alert("Kullanıcı bilgilerinde hata ile karşılaşıldı!");
                        }
                    })
            });
        }
    },
    created() {
        if(document.cookie.length > 0) window.location.href="/home";
    },
})