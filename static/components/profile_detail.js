export default{
    template:`
    <div>
        <br>
        <br>
        <center>
        <h3> Your Details </h3>
        <br>
        <h5 > Username : {{profile["username"]}} </h5>
        <h5> Email : {{profile["email"]}} </h5>
        <br>
        <br>

        <h3 > Edit Details </h3>
        <form >
        <div  class="form-group">
            <label  for="username">Username</label>
            <input type="username" class="form-control" id="username" v-model="username" placeholder="username" >
        </div>

        <div class="form-group">
            <label  for="email">Email address</label>
            <input  type="email" class="form-control" id="email" v-model="email" aria-describedby="emailHelp" placeholder="Enter email">
            <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
        </div>

        <div class="form-group">
            <label for="password">Password</label>
            <input  type="password" class="form-control" id="password" v-model="password" placeholder="Password">
        </div>

        <button  @click="submit_form" type="submit" class="btn btn-primary" >Update Details</button>
        </form>

        <div v-if="nodup_username" class="alert alert-warning" role="alert">
                Username already exists
        </div> 

        <div v-if="nodup_email" class="alert alert-warning" role="alert">
        Username already exists

</div> 
        </center>

    </div>`, 
    data: function(){
        return{
        profile:[], 
        username:'',
        email:'', 
        password:"",
        notallowed : false,
        nodup_email:false,
        nodup_username:false,
        new_det:[], 

        }
    },

    mounted:function(){
        this.profile_data();
    },
    methods:{
        profile_data: function(){

            fetch("/profile/" , {method : "GET", 
            headers:{
                "Authentication-Token": localStorage.getItem('token'),
                "Content-Type": "application/json",
                },
            }).then((response)=>{
                if (response.status===401){
                    this.$router.push({path:"/userlogin"})
                }
                else if ( response.status===200){
                    return response.json()
                }
        })
            .then(data =>{ 
                
                    console.log(data);
                    this.profile=data;

            })
            //     return response.json()
            // }).then((data) => {
            //     this.profile=data
            //     console.log(data)
            },

            submit_form: function(id){
                const data = { email: this.email , username: this.username, password: this.password};
                fetch(`/profile/${this.profile.id}`,  {method : "PUT", 
                headers:{
                    "Authentication-Token": localStorage.getItem('token'),
                    "Content-Type": "application/json",
                    }, body: JSON.stringify(data)
                }).then((response)=>{

                    if ( response.status===200){
                            console.log(response)
                            return response.json()
                        }
                
            }).then(data=>{ 
                this.new_det=data
                window.location.reload()
                this.$router.push({path:"/profile_detail"});

        })
    }

    },
computed:{
    objectKeys() {
        return Object.keys(this.profile);
    }
}
}
