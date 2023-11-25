export default{
    template:`
    <div> 
    

    <div v-for="i in th">
    <form >
    <div  class="form-group">

        <h3>Edit Theatre : {{i.name}}, {{i.place}} </h3>
    </div>
    <br>
    <br>
    <div class="form-group">
        <label for="name">Name</label>
        <input  type="name" class="form-control" id="name" v-model="name" >
    </div>
    <br>

    <div class="form-group">
        <label for="capacity">Theatre Capacity</label>
        <input  type="capacity" class="form-control" id="capacity" v-model="capacity" >
    </div>


<button  @click="submit" type="submit" class="btn btn-primary" >Submit</button>

</form>
    </div>

    </div>`, 
    data:function(){
        return{
            profile:[],
            th_id : null,
            th:[],
            name:'', 
            capacity:'',  
            Disabled:true,
            new_det:[]
        }
    }, 
    created() {
        // Access the 'id' parameter from $route.params and assign it to the resourceId data property
        this.th_id= this.$route.params.id;
        console.log(typeof(this.th_id))
        // this.show_id = parseInt(this.show_id)
        // console.log(typeof(this.show_id))

        
      }, 
      mounted:function(){
        this.profile_data();
        this.theatre_data();
      },
      methods:{
        profile_data: function(){

            fetch("/profile/" , {method : "GET", 
            headers:{
                "Authentication-Token": localStorage.getItem('token'),
                "Content-Type": "application/json",
                },
            }).then((response)=>response.json())
            .then((data) =>{ 
                if (data.email!="admin@gmail.com"){
                    this.user=true
                    this.$router.push({path:"/adminlogin"})
                    throw new Error("Login as Admin")
                }
                else{
                    // console.log(data)
                    // console.log(this.password)
                    // console.log(data.email)
                    this.profile=data;
                    // this.$router.push("/")
                    }
                })
            }
            ,

        theatre_data:function(){
            fetch(`/theatre/${parseInt(this.th_id)}`,{method : "GET", 
            headers:{
                // "Authentication-Token": localStorage.getItem('token'),
                "Content-Type": "application/json",
                },
            }).then(response=> response.json())
            .then((data)=> {
                // console.log(data)
                if (this.profile.email!="admin@gmail.com"){
                // this.user=true
                this.$router.push({path:"/adminlogin"})
                throw new Error("Login as Admin")
            }
            else{
                // console.log(data)
                // console.log(this.password)
                // console.log(data.email)
                this.th=data.theatres;
                // console.log(data.req_show.Name)
                // this.$router.push("/adminhome")
                }


        }).catch(error => {

            console.log('unacceptable form')
          })
        }
    , 
    submit: function(event){
        event.preventDefault();
        const data = {
            name: this.name,
            capacity: this.capacity,
          };
        console.log(data)
        fetch(`/theatre/${this.th_id}`, {
            method:'PUT',
            headers:{
                "Authentication-Token": localStorage.getItem('token'),
                "Content-Type": "application/json",
                },
            body:JSON.stringify(data)
            // console.log(body)

        }).then(response=>{
            if(response.status===401){
                console.log(response.json())
                this.$router.push({path:"/adminlogin"})
                throw new Error("Not Authorized")
            }
            if(response.status===200){
                response.json()
            }}
                ).then(()=> {
                this.$router.push({path:"/adminhome"})
            
            })
    }
    

        }
        
      }