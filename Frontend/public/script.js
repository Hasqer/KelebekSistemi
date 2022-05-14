var app = new Vue({
    el: ".loginBox",
    data: {
        UserInputEmail: "",
        UserInputpassword: ""
    },
    methods: {
        CheckUser() {
            alert("methoda girdim");

            var mydata = {
                email: this.UserInputEmail,
                password: ""
            }
            this.ConvertHash(this.UserInputpassword).then((hesh) => mydata.password = hesh)
            fetch("/checkUser", {
                method: "post",
                body: JSON.stringify(mydata),
                headers: { "Content-type": "application/json" }
            })
                .then(response => response.json())
                .then(json => alert(json.check))
        },
        ConvertHash(string) {
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