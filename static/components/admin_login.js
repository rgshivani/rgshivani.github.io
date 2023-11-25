export default {
    template:`<div> 
    <h1> Admin Login </h1>
    <form >

        <div class="form-group">
            <label  for="email">Email address</label>
            <input required value="admin@gmail.com" type="email" class="form-control" id="email" v-model="email" aria-describedby="emailHelp" placeholder="Enter email">
            <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
        </div>

        <div class="form-group">
            <label for="password">Password</label>
            <input required type="password" class="form-control" id="password" v-model="password" placeholder="Password">
        </div>

        <button  @click="login" type="submit" class="btn btn-primary" :disabled="Disabled">Submit</button>
    </form>

    </div> </div>`, 
    data: function () {
        return {
            email :null ,
            // username:null,
            password:null,
            user:false
            


        }
    }, 
    computed: {
        Disabled() {
          return  !this.email || !this.password;
        },
      },

    methods:{
        
        login : function(){
            if (!this.Disabled) {
                // All required fields are filled, proceed with form submission
                console.log('Form submitted');
                this.Visible = false; 
                // const data = { email: this.email , password: this.password};
                // Hide the error message if previously shown
                fetch('http://127.0.0.1:5000/login?include_auth_token', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email : this.email, 
            password : this.password
          }),
        }).then(response => response.json())
        .then((data) => {

            console.log(data)
            if (this.email!="admin@gmail.com"){
                this.user=true
                this.$router.push({path:"/userlogin"})
                throw new Error("Login as User")
            }
            else{
            console.log(data)
            // console.log(this.password)          
            fetch(`/login/${this.email}`).then(r=> r.json()).then((d)=> console.log(d))
          
            const token=data.response.user.authentication_token;
            // console.log(token)
            localStorage.setItem("token", token);
            // // if(this.role==="customer"){
            this.$router.push("/adminhome")
            }
        }).catch((error) => {
            this.errorMessage = "Invalid";
            console.error(error);
          });
              
                }
            }

        }
}