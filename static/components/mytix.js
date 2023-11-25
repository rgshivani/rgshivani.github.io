export default{
    template:`
    <div>
    <h3>Booked Tickets:</h3>
    <br>
    
         <div v-if="tix.length > 0"> 
                <div class="row">
                
                    <div class="card my-3 mx-4 col-4" style="width: 18rem;" v-for="tix in tix" :key="id">
                                <div class="card-body">
                                    <h3 class="card-title"> {{tix['show']}}</h3>
                                    <h6 class="card-text"> Theatre : {{tix['theatre']}}, {{tix['Place']}} </h6>
                                    <h6 class="card-text"> Genre : {{tix['tag'] }}</h6>
                                    <h6 class="card-text"> No. of Tix : {{tix['count'] }}</h6>
                                    <!-- <h6 class="card-text"> Booked on: {{tix['booked_on']}} </h6> -->
                                </div>
                    </div>
                   
                </div>
                <button><router-link to="/user_home">Book Tickets Now </router-link></button>
                </div>
                <!--<div> <button @click="gen_pdf()"> Download your tickets </button></div> -->

        <div v-else>
        No Tickets Booked
        <br>
        <br>
        <button><router-link to="/user_home">Book Tickets Now </router-link></button>
        </div>

        
    </div>`, 
    data:function(){
        return{
            tix:[]
        }
    },
    mounted:function(){
        this.show_tix();
    }, 
    methods:{
        // gen_pdf:function(){
        //     fetch("/backend/",{
        //         method:"POST",
        //     }).then(response=> response.json()).then((data)=> {
        //         console.log(data)
        //         const a = document.createElement('a');
        //    a.href = "../../"+data.user+".pdf";
        //    a.download = data.user+".pdf"
        //    this.file_name=data.user+".pdf"


        //     })
        // }
    
        // ,
        show_tix:function(){
            fetch("/ticket",{
                method:"GET",
                headers:{
                    "Authentication-Token": localStorage.getItem('token'),
                    "Content-Type": "application/json",
                    },
                
            }).then((response)=>{
                if (response.status===401){
                    this.$router.push({path:"/userlogin"})
                    throw new Error('Unauthorized')
                }
                else if(response.status===200){
                  
                return response.json()
                }
            }).then((data) => {
                console.log(data)
                this.tix=data.tix
            })
            .catch(error => {
                console.log(error);
            });

        }
    }
}