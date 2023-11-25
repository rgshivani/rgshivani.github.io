export default{
    template:`<div>
    <h3> Filter by Location </h3>
    <br>
   
    <h4><label  for="tag">Select </label></h4>
            <select required type="loc" id="loc" class="form-control" name="loc" v-model="location" @change="filter_data(location)">
            <option v-for="theatre in theatres" :value="theatre.id">{{ theatre.Name}},{{theatre.Place}}</option>
            </select>

    <br>

                <div class="row">
                    <div class="card my-3 mx-4 col-4" style="width: 18rem;" v-for="show in venue_show" :key="id">
                                <div class="card-body">
                                    <h3 class="card-title">{{show['name']}}</h3>
                                    <h6 class="card-text">Tag : {{show['tag']}} </h6>
                                    <h6 class="card-text">Rating : {{show['rating'] }}</h6>
                                    <h6 class="card-text">Price : {{show['price'] }}</h6>
                                    <a class="btn" @click="book(v['id'], show['id'])" >Book Ticket </a>
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

    </div>`,


    data:function(){
        return{
            tag:null, 
            venue_show:[], 
            theatres:[], 
            adminbook:false,
            booked:false,
            
        }
    },
    mounted:function(){
        this.theatre_data();
    },
    methods:{
        filter_data:function(id){
            console.log(id)
            fetch(`/theatre/${id}`, 
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
                console.log(data.shows_at_id)
                this.venue_show=data.shows_at_id
                // location.reload()
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
                this.theatres=data.theatres
            }).catch(error=>{
                console.log(error)
            })
        },book:function(th_id,show_id){
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
    }, computed:{

        modified(){
            // console.log(this.venue_show)
            return this.venue_show
        }
        
    }
    // methods:{
    //     filter: function(value){
    //         fetch(`/show/${value}`, 
    //         {
    //             method:"GET",
    //             headers:{
    //                 // "Authentication-Token": localStorage.getItem('token'),
    //                 "Content-Type": "application/json",
    //                 },
                // v-if="Object.keys(modified[venue['Place']]).length > 0"
    //         }
    //         ).then((response)=>{
    //             return response.json()
    //         }).then((data) => {
    //             // console.log(data)
    //             this.venue_show=data
    //             location.reload()
    //         })
    //         .catch(error => {
    //             console.log(error);
    //         });
    // }
}