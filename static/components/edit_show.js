export default{
    template:`
    <div> 
    

    <div v-for="show in show">
    <form >
    <div  class="form-group">

        <h3>Edit Show : {{show.Name}} </h3>
    </div>
    <br>
    {{rating}}
    <div class="form-group">
        <label  for="tag">Tag</label>
        <select  type="tag" id="tag" class="form-control" name="tag" v-model="tag" >
          <option value="Drama">Drama</option>
          <option value="Thriller">Thriller</option>
          <option value="Comedy">Comedy</option>
          <option value="Horror">Horror</option>
          <option value="Romance"> Romance </option>
          <option value="Action"> Action </option>
          <option value="Sci-Fi">Sci-Fi</option>
        </select>
        <!--<input required type="tag" class="form-control" id="tag" v-model="tag" aria-describedby="emailHelp" placeholder="Enter tag"> -->
    </div>
    <br>

    <div class="form-group">
        <label for="rating">rating</label>
        <input  type="rating" class="form-control" id="rating" v-model="rating" >
    </div>
    <br>

    <div class="form-group">
        <label for="price">Ticket Price</label>
        <input  type="price" class="form-control" id="price" v-model="price" >
    </div>


<button  @click="submit" type="submit" class="btn btn-primary" >Submit</button>

</form>
    </div>

    </div>`, 
    data:function(){
        return{
            profile:[],
            show_id : null,
            show:[],
            tag:'', 
            rating:'', 
            price:'', 
            Disabled:true,
            new_det:[]
        }
    }, 
    created() {
        // Access the 'id' parameter from $route.params and assign it to the resourceId data property
        this.show_id= this.$route.params.id;
        console.log(typeof(this.show_id))
        // this.show_id = parseInt(this.show_id)
        // console.log(typeof(this.show_id))

        
      }, 
      mounted:function(){
        this.profile_data();
        this.show_data();
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

        show_data:function(){
            fetch(`/show/${parseInt(this.show_id)}`,{method : "GET", 
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
                this.show=data.req_show;
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
            price: this.price,
            rating: this.rating,
            tag: this.tag
          };
        console.log(data)
        fetch(`/show/${this.show_id}`, {
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