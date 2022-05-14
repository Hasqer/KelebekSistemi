var app = new Vue({
    el: ".loginBox",
    data: {
        UserInputEmail: "",
        UserInputpassword: ""
    },
    methods: {
        CheckUser() {
            var mydata = { // kullanıcı verilerinin hazırlanması
                email: this.UserInputEmail,
                password: ""
            }
            this.ConvertHash(this.UserInputpassword).then((hash) => { // şifrenin hash'e çevrilmesi
                mydata.password = hash;
                fetch("/checkUser", { // kullanıcı bilgi kontrolü
                    method: "post",
                    body: JSON.stringify(mydata),
                    headers: { "Content-type": "application/json" }
                })
                    .then(response => response.json())
                    .then(json => {
                        if(json == true){//kullanıcı bilgilerinin doğru
                            document.cookie = "{email:'"+mydata.email+"',password:'"+mydata.password+"'}; path=/";//cookie oluşturma
                        }
                        else{//kullanıcı bilgileri yanlış
                            console.log(JSON.parse(document.cookie.toString()));//cooki okuma işlemi testinin yapılacağı yer
                            //burada cookie işlemini yapma burası şifrenin yanlış olduğu yer
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
        }
    }
})