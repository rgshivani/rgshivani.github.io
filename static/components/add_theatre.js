export default{
    template:`
    <div>
    
    <h3>New Theatre creation</h3>

    <form >
        <div  class="form-group">
            <label  for="name">Name</label>
            <input type="name" class="form-control" id="name" v-model="name" placeholder="name" required>
        </div>

        <div class="form-group">
            <label  for="place">Placd</label>
            <input required type="place" class="form-control" id="place" v-model="place" aria-describedby="emailHelp" placeholder="Enter place">
        </div>

        <div class="form-group">
            <label for="capacity">Capacity</label>
            <input required type="capacity" class="form-control" id="capacity" v-model="capacity" placeholder="capacity">
        </div>

    <button  @click="submit_form" type="submit" class="btn btn-primary" :disabled="Disabled">Submit</button>
    
</form>
<br>
            <br>
<button type="button" class="btn btn-dark" ><router-link to="/adminhome"> Admin Home </router-link></button>

        <div v-if="nodup_theatre" class="alert alert-warning" role="alert">
        already exists
        </div> 

    </div>
    `, 
    data: function () {
        return {
            name :null ,
            place:null,
            capacity:null,
            nodup_theatre: false,
            profile:[]

        }
    }, 

    computed: {
        Disabled() {
          return !this.name || !this.place || !this.capacity;
        },
      },

    methods:{
      //     return response.json()
      // }).then((data) => {
      //     this.profile=data
      //     console.log(data)

        submit_form:function(){
            if (!this.Disabled) {
                // All required fields are filled, proceed with form submission
                console.log('Form submitted');
                // this.Visible = false; 
                const data = { name: this.name , place: this.place, capacity: this.capacity};
                // Hide the error message if previously shown
                 fetch("/theatre", {
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
                    else if (response.status === 410){
                        this.nodup_theatre=true
                      throw new Error("Theatre already exists");
        
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

    
                  })
                                
              } else{
                this.Disabled=true
              }

        }
    }
}
