export default{
    template:`
    <div>

    <br>
    <h3> Add new screening show to theatre</h3>
    <form >
    <div  class="form-group">
        <label  for="theatre_id">Theatre ID </label>
        <input type="theatre_id" class="form-control" id="theatre_id" v-model="theatre_id" placeholder="theatre_id" required>
    </div>

    <div class="form-group">
        <label  for="show_id">Show ID</label>
        <input required type="show_id" class="form-control" id="show_id" v-model="show_id" aria-describedby="emailHelp" placeholder="Enter show id">
    </div>

<button  @click="submit_form" type="submit" class="btn btn-primary" :disabled="Disabled">Submit</button>

</form>
<br>
            <br>
<button type="button" class="btn btn-dark" ><router-link to="/adminhome"> Admin Home </router-link></button>

<div v-if="nodup_show" class="alert alert-warning" role="alert">
    Screening already exists
</div>
<div v-else-if="both_notfound" class="alert alert-warning" role="alert">
    Theatre and Show not found
</div>
<div v-else-if="th_notfound" class="alert alert-warning" role="alert">
    Theatre not found
</div>
<div v-else-if="show_notfound" class="alert alert-warning" role="alert">
    Show not found
</div>



    </div>
    `, 
    data: function(){
        return{
            theatre_id:null,
            show_id:null,
            nodup_show:false,
            both_notfound:false,
            th_notfound:false,
            show_notfound:false,
            profile:[]       

        }
       

    }, 


    computed: {
        Disabled() {
          return !this.theatre_id || !this.show_id ;
        },
      },
    methods:{
      //     return response.json()
      // }).then((data) => {
      //     this.profile=data
      //     console.log(data)

        submit_form: function(){
            if (!this.Disabled) {
                // All required fields are filled, proceed with form submission
                console.log('Form submitted');
                // this.Visible = false; 
                // this.nodup_show=false
                // this.both_notfound=false
                // this.th_notfound=false
                // this.show_notfound=false
                const data = { theatre_id: this.theatre_id , show_id: this.show_id, 
                    };
                // Hide the error message if previously shown
                 fetch("/screening", {
                        method: "POST", // or 'PUT'
                        headers: {
                          "Authentication-token":localStorage.getItem('token'),
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify(data),
                 }).then(response => {
                  if (response.status===401){
                    this.$router.push({path:"/adminlogin"})
                    throw new Error("Not Authorized")
                  }
                    else if (response.status ===407){
                        this.both_notfound=true
                        // this.$data = this.initialDataConfiguration;
                        throw new Error("Theatre and Show not found")
                             
                        
                    }
                    else if (response.status===408){
                        this.th_notfound=true
                        // this.$data = this.initialDataConfiguration;
                        throw new Error("Theatre not found");


                    }
                    else if (response.status ===409){
                        this.show_notfound=true
                        throw new Error("Show not found");

                    }
                    else if (response.status === 410){
                        this.nodup_show=true
                      throw new Error("Screening already exists");
        
                    }
                    
                    else if (response.status ===200){
                      return response.json()
                      }
                    
                    // throw new Error("username already in use.Please pick another username");
                      })
                  .then(() => {
                    this.$router.push({
                      path:"/adminhome"
                    })
                  })
                  .catch(error => {
                    console.log('unacceptable form')
                    // setTimeout(() =>  50000);
                    // location.reload()

    
                  })
                                
              } else{
                this.Disabled=true

              }
            
            
    

        }
    }, 
    
    
}