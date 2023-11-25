export default{
    template:`
    <div>
    
    <h4>New Show creation</h4>
    <form >
        <div  class="form-group">
            <label  for="name">Name</label>
            <input type="name" class="form-control" id="name" v-model="name" placeholder="name" required>
        </div>
        <br>

        <div class="form-group">
            <label  for="tag">Tag</label>
            <select required type="tag" id="tag" class="form-control" name="tag" v-model="tag">
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
            <input required type="rating" class="form-control" id="rating" v-model="rating" placeholder="rating">
        </div>
        <br>

        <div class="form-group">
            <label for="price">Ticket Price</label>
            <input required type="price" class="form-control" id="price" v-model="price" placeholder="price">
        </div>


    <button  @click="submit_form" type="submit" class="btn btn-primary" :disabled="Disabled">Submit</button>
    
</form>
<br>
            <br>
<button type="button" class="btn btn-dark" ><router-link to="/adminhome"> Admin Home </router-link></button>

        <div v-if="nodup_show" class="alert alert-warning" role="alert">
        already exists
        </div> 

    </div>
    `, 
    data: function () {
        return {
            name :null ,
            tag:null,
            rating:null,
            price:null,
            nodup_show: false,
            profile:[]

        }
    }, 

    computed: {
        Disabled() {
          return !this.name || !this.price ;
        },
      },

    methods:{
        submit_form:function(){
            if (!this.Disabled) {
                // All required fields are filled, proceed with form submission
                console.log('Form submitted');
                // this.Visible = false; 
                const data = { name: this.name , tag: this.tag, rating: this.rating, price: this.price};
                // Hide the error message if previously shown
                 fetch("/show/", {
                        method: "POST", // or 'PUT'
                        headers: {
                          "Authentication-token":localStorage.getItem('token'),
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify(data),
                 }).then(response => {
                    // console.log(response.status)
                    if (response.status===401){
                      this.$router.push({path:"/adminlogin"})
                      throw new Error("Not Authorized")
                    }
                    else if (response.status === 410){
                        this.nodup_show=true
                      throw new Error("Show already exists");
        
                    }
                    else if (response.status ===200){
                      return response.json()
                      }
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
