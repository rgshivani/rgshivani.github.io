// import Vue from 'vue';
// import VueRouter from 'vue-router';
// Vue.use(VueRouter);
// Vue.component('router-link', Vue.component('RouterLink'));

export default {
    template:`
    <div>   
        <br>
        <center> 
        <h3> Hi! Welcome to Dashboard </h3>
        </center>
         

      <!--  <router-link to="/export_data"> Export Data </router-link> -->

    <h3><div style="margin: 40px;"><p dir="rtl"><router-link to="/filter_location">Filter by location</router-link> <router-link to="/filter_genre"> Filter by genre </router-link>| <router-link to="/mytix"> My Tickets </router-link></p></div></h3>

        <div v-for="venue in venue" :key="id">
            <h3>{{venue['Name']}}, {{venue["Place"]}} </h3>
                <div class="row">
                    <div class="card my-3 mx-4 col-4" style="width: 18rem;" v-for="show in venue_show[venue['Place']]" :key="id" >
                                <div class="card-body">
                                    <h3 class="card-title">{{show['Name']}}</h3>
                                    <h6 class="card-text">Tag : {{show['Tag']}} </h6>
                                    <h6 class="card-text">Rating : {{show['Rating'] }}</h6>
                                    <h6 class="card-text">Price : {{show['Ticket_Price'] }}</h6>
                                    <a class="btn" @click="book(venue['id'], show['id'])" >Book Ticket </a>
                                </div>
                    </div>
                    
                </div>
        </div>
        
       
        <div v-if="booked">

        <!-- nothing else below it can be access, without removing the top first card -->
    <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.5); z-index: 999;"></div>
    
      <div style="position: fixed; top: 50%; left: 50%; background-color: white; padding: 20px; z-index: 1000;">
        <p>Sorry, this show is fully booked</p>
        <button @click="hideAlert">OK</button>
      </div>
    </div>
    

    <div v-if="adminbook">
    <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.5); z-index: 999;"></div>
    <div style="position: fixed; top: 50%; left: 50%;background-color: white; padding: 20px; z-index: 1000;">
      <p><router-link to="/userlogin">Login</router-link> as user to book tickets</p>
      <button @click="hideAlert">OK</button>
    </div>
  </div>
               
    </div>
    `, 
    data: function(){

        return {
             venue_show:[],
             booked:false, 
             venue:[], 
             adminbook:false
             
        };
    },

    mounted:function() {
        this.show_data();
        this.theatre_data();
        // this.filter(this.value);

        
    }, 
    methods:{

        show_data: function(){
            fetch(`/show/`, 
            {
                method:"GET",
                headers:{
                    // "Authentication-Token": localStorage.getItem('token'),
                    "Content-Type": "application/json",
                    },
                
            }
            ).then((response)=>{
                return response.json()
            }).then((data) => {
                // console.log(data)
                this.venue_show=data.venue_show
            })
            .catch(error => {
                console.log(error);
            });
        },   

        theatre_data : function(){
            fetch(`/theatre`, {method:"GET",headers:{
                // "Authentication-Token": localStorage.getItem('token'),
                "Content-Type": "application/json",
                },}).then((response)=>{
                return response.json()
            }).then((data)=>{
                this.venue=data.theatres
            }).catch(error=>{
                console.log(error)
            })
        },

        filter: function(value){
            fetch(`/show/${value}`, 
            {
                method:"GET",
                headers:{
                    // "Authentication-Token": localStorage.getItem('token'),
                    "Content-Type": "application/json",
                    },
                
            }
            ).then((response)=>{
                return response.json()
            }).then((data) => {
                // console.log(data)
                this.venue_show=data
                location.reload()
            })
            .catch(error => {
                console.log(error);
            });

        }, 
        book:function(th_id,show_id){
            fetch(`/ticket/${th_id}/${show_id}`,{ method:"POST",
                headers:{
                "Authentication-Token": localStorage.getItem('token'),
                "Content-Type": "application/json"
                }
            }).then((response)=>{
                if (response.status===401){
                    this.adminbook=true
                    throw new Error("Book as a User")
                }
                if (response.status===400){
                    this.booked=true
                    throw new Error("Fully Booked")
                }
                else if (response.status===200){
                    response=response.json()

                }
            }).then(() => {
                this.$router.push({
                  path:"/booking_successful"
                })
              })
              .catch(error => {

                console.log('unacceptable form')
            
              })
              
        }, 
        hideAlert: function() {
            this.booked = false;
            this.adminbook=false;
          }
    }
, 
    computed:{
        objectKeys() {
            return Object.keys(this.venue_show);
        }
    }
}
