console.log("Hello from js")

import router from "./router.js"



const a= new Vue({
    el:"#app", 
    router:router,
    template :`
    <div> 
    
    <center> <h1> <router-link to="/user_home"> Welcome to TixItis </router-link> </h1> 
    <br>

    <!-- <button ><router-link to="/mytickets"> My Tix </router-link></button> -->
    <button type="button" class="btn btn-dark"><router-link to="/signup"> Sign Up </router-link></button>
    <button type="button" class="btn btn-dark" ><router-link to="/userlogin"> User Login </router-link></button>
    <button type="button" class="btn btn-dark" ><router-link to="/adminlogin"> Admin Login </router-link></button>
    <button  @click="logout()" type="button" class="btn btn-dark" > Logout </button>
    <!--<button @click="logout()"> Logout </button>-->
    <button type="button" class="btn btn-dark" ><router-link to="/profile_detail"> Profile </router-link></button>
    <button type="button" class="btn btn-dark"><router-link to="/adminhome"> Admin Home</router-link></button>
      <br>
    </center>
    <br>
    <br>


    <router-view></router-view>
     </div>`,
    data:{
    },
    methods:{
        logout: function() {
            fetch("/logout",{
                method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        //   body: JSON.stringify(data),
        }).then(response=>  {
            if (response.status===200){
                localStorage.removeItem('token');
                this.$router.push({path:"/user_home"});
            }
            }
        );
        }, 

    }
})





            
    
            // redirect the user to the login page
  

    // mounted:function(){

    //     fetch("/api/").then((res)=>{
    //         return res.json()
    //     }).then((data)=> {
    //         this.theatres=data
    //     })
    // }
