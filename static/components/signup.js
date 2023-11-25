export default {
    template:`

    <div>
    <h1> Sign Up </h1>
    <br>
    <form >
        <div  class="form-group">
            <label  for="username">Username</label>
            <input type="username" class="form-control" id="username" v-model="username" placeholder="username" required>
        </div>

        <div class="form-group">
            <label  for="email">Email address</label>
            <input required type="email" class="form-control" id="email" v-model="email" aria-describedby="emailHelp" placeholder="Enter email">
            <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
        </div>

        <div class="form-group">
            <label for="password">Password</label>
            <input required type="password" class="form-control" id="password" v-model="password" placeholder="Password">
        </div>

        <button  @click="submit_form" type="submit" class="btn btn-primary" :disabled="Disabled">Submit</button>
    </form>
    <div v-if="nodup_username" class="alert alert-warning" role="alert">
            Username already exists
    </div> 
    <div v-if="nodup_email" class="alert alert-warning" role="alert">
    Username already exists
</div> 

    </div>
    `, 
    data: function () {
        return {
            email :null ,
            username:null,
            password:null,
            nodup_username: false,
            nodup_email:false


        }
    }, 
    computed: {
        Disabled() {
          return !this.username || !this.email || !this.password;
        },
      },

    methods:{

        
        submit_form : function(){
            if (!this.Disabled) {
                // All required fields are filled, proceed with form submission
                console.log('Form submitted');
                this.Visible = false; 
                const data = { email: this.email , username: this.username, password: this.password};
                // Hide the error message if previously shown
                 fetch("/profile/", {
                        method: "POST", // or 'PUT'
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify(data),
                 }).then(response => {

                    if (response.status === 410){
                        this.nodup_username=true
                      throw new Error("Username already in use");
        
                    }
                    else if (response.status === 411){
                        this.nodup_email=true
                        throw new Error("email already in use")
                    }
    
                    else if (response.status ===200){
                      return response.json()
                      }
                    
                    // throw new Error("username already in use.Please pick another username");
                      })
                  .then(() => {
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
            fetch(`/login/${this.email}`, {method:"POST"}).then(r=> r.json()).then((d)=> console.log(d))
            const token=data.response.user.authentication_token;
            // console.log(token)
            localStorage.setItem("token", token);
            // // if(this.role==="customer"){
            this.$router.push("/user_home")
        })
                    // this.$router.push({
                    //   path:"/user_home"
                    // })
                  })
                  .catch(error => {
                    console.log('unacceptable form')

    
                  })
                                
              } else{
                this.Disabled=true
              }


                }
            }

        }


