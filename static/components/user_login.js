export default {
    template:`

    <div>
    <h1> User Login </h1>
    <form >

        <div class="form-group">
            <label  for="email">Email address</label>
            <input required type="email" class="form-control" id="email" v-model="email" aria-describedby="emailHelp" placeholder="Enter email">
            <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
        </div>

        <div class="form-group">
            <label for="password">Password</label>
            <input required type="password" class="form-control" id="password" v-model="password" placeholder="Password">
        </div>

        <button  @click="login" type="submit" class="btn btn-primary" :disabled="Disabled">Submit</button>
    </form>
    
    <div v-if="incorrect_data" class="alert alert-warning" role="alert">
Username/Password incorrect. Please try again!
</div> 

</div> 


    </div>
    `, 
    data: function () {
        return {
            email :null ,
            // username:null,
            password:null,
            incorrect_data:false
            


        }
    }, 
    computed: {
        Disabled() {
          return  !this.email ||  !this.password;
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
          if (data.meta.code==400){
            this.incorrect_data=true
            throw new Error("email/Password incorrect")
          }
          else{
          if (this.email=="admin@gmail.com"){
            this.$router.push({path:"/adminlogin"})
            throw new Error("Login as Admin")
          }
          else{
            console.log(data)
            fetch(`/login/${this.email}`, {method:"POST", 
            headers: {
              "Content-Type": "application/json",
            }, body: JSON.stringify({
              email : this.email, 
            })}).then(r=> r.json()).then((d)=> console.log(d))
            // console.log(this.password)
            const token=data.response.user.authentication_token;
            // console.log(token)
            localStorage.setItem("token", token);
            // // if(this.role==="customer"){
            this.$router.push("/user_home")
          }
        } })
        //   .then((response) =>{
        //   if (response.status === 410){
        //   throw new Error("Username does not exist");

        // }
        // else if (response.status === 411){
        //     throw new Error("password incorrect")
        // }

        // else if (response.status === 200){
        //   token = response[0]['token']
        //   localStorage.setItem('token', token);

        //   this.$router.push({path:"/home"})
        //   }}
          
          
          
          // response.json())
          // .then((data) => {
          //     console.log(data)
          //     // const token=JSON.stringify(data.response.user.authentication_token);
          //     console.log(token)
          //     localStorage.setItem("token", token);
          //     // // if(this.role==="customer"){
          //     this.$router.push("/home")
          // }
            // )
          .catch((error) => {
            this.errorMessage = "Invalid";
            console.error(error);
          });
              
                }
            }

        }
      }

      
