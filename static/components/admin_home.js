
export default{
    template:`
    <div> 
        
        <center>
        <br>
        <h3> Hello Admin </h3>
        <p><button type="button" class="btn btn-dark" ><router-link to="/adminhome"> Admin Home </router-link></button></p>

            <button type="button" class="btn btn-dark" ><router-link to="/addtheatre"> Add Theatre </router-link></button>
            <button type="button" class="btn btn-dark" ><router-link to="/addshow"> Add Show </router-link></button>
            <button type="button" class="btn btn-dark" ><router-link to="/addscreening"> Add Screening </router-link></button>
            <br>
            <br>
        <br>
        <div class="alert alert-warning" role="alert" v-if="not_exported"> Export file first </div>
       <h3> All Shows </h3>
       <div class="row">
                    <div class="card my-3 mx-4 col-4" style="width: 20rem;" v-for="show in show" :key="id">
                                <div class="card-body">
                                    <h3 class="card-title">{{show['Name']}}</h3>
                                    <h6 class="card-text">Tag : {{show['Tag']}} </h6>
                                    <h6 class="card-text">Rating : {{show['Rating'] }}</h6>
                                    <h6 class="card-text">Price : {{show['Ticket_Price'] }}</h6>
                                    <h6 class="card-text">ID : {{show['id'] }}</h6>
                                    <a class="btn" @click="edit(show['id'])" >Edit Show </a> 
                                    <a class="btn" @click="dlt_show(show['id'])"> Delete Show </a>
                                    <a class="btn" @click="export_data('s',show['id'])"> Export </a>
                                    <a class="btn" @click="download_data('s',show['id'])"> Download </a>

                                </div>
                    </div>
                </div>


       <h3> All Theatres </h3>
       <div class="row">
                    <div class="card my-3 mx-4 col-4" style="width: 20rem;" v-for="theatre in theatre" :key="id">
                                <div class="card-body">
                                    <h3 class="card-title">{{theatre['Name']}}</h3>
                                    <h6 class="card-text">Place : {{theatre['Place']}} </h6>
                                    <h6 class="card-text">Capacity : {{theatre['Capacity'] }}</h6>
                                    <h6 class="card-text">ID : {{theatre['id'] }}</h6>
                                    <a class="btn" @click="edit_theatre(theatre['id'])" >Edit Theatre </a> 
                                    <a class="btn" @click="dlt_theatre(theatre['id'])"> Delete Theatre </a>
                                    <a class="btn" @click="export_data('t',theatre['id'])"> Export </a>
                                    <a class="btn" @click="download_data('t',theatre['id'])"> Download </a>

                                </div>
                    </div>
                </div>

        </center>
    </div>

    `,
    data:function(){
        return {
            profile:[],
            show:[], 
            theatre:[],
            req_item:{},
            current_req:{},
            not_exported:false, 
            item_download:{}
        }
    },
    mounted:function(){
        this.profile_data();
        this.show_data();
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
                    throw new Error("Login as admin")
                }
                else{
                    // console.log(data)
                    // console.log(this.password)
                    // console.log(data.email)
                    this.profile=data;
                    this.$router.push("/adminhome")
                    }


            }).catch((error) => {
                this.errorMessage = "Invalid";
                // console.error(error);
              });
            //     return response.json()
            // }).then((data) => {
            //     this.profile=data
            //     console.log(data)
            }, 

            show_data:function(){
                fetch("/show/",{method : "GET", 
                headers:{
                    "Authentication-Token": localStorage.getItem('token'),
                    "Content-Type": "application/json",
                    },
                }).then(response=> response.json())
                .then((data)=> {
                    if (this.profile.email!="admin@gmail.com"){
                    this.user=true
                    this.$router.push({path:"/adminlogin"})
                    throw new Error("Login as Admin")
                }
                else{
                    // console.log(data)
                    // console.log(this.password)
                    // console.log(data.email)
                    this.show=data.all_show;
                    this.$router.push("/adminhome")
                    }


            })
            } , 
            theatre_data:function(){
                fetch("/theatre",{method : "GET", 
                headers:{
                    // "Authentication-Token": localStorage.getItem('token'),
                    "Content-Type": "application/json",
                    },
                }).then(response=> response.json())
                .then((data)=> {
                    if (this.profile.email!="admin@gmail.com"){
                    this.user=true
                    this.$router.push({path:"/adminlogin"})
                    throw new Error("Login as Admin")
                }
                else{
                    // console.log(data)
                    // console.log(this.password)
                    // console.log(data.email)

                    this.theatre=data.theatres;
                    this.$router.push({path:"/adminhome"})
                    }
                    console.log(this.theatre)

            })
            }, 
            edit: function(id){
                this.$router.push({path:`edit_show/${id}`})
            }, 
            edit_theatre: function(id){
                this.$router.push({path:`/edit_theatre/${id}`})
            },
            dlt_show: function(id){
                fetch(`/show/${id}`, {
                    method:"DELETE", 
                        headers:{
                            "Authentication-Token": localStorage.getItem('token'),
                            "Content-Type": "application/json",
                            }
                    }
                ).then(response=> {
                    if (response.status===401){
                        this.$router.push({path:"/adminlogin"})
                        throw new Error("Login as Admin")
                    }
                    else {
                        return response.json()
                    }
                }).then(()=>{
                    this.$router.push({path:"/adminhome"})
                    window.location.reload()
                })
            }
        , 
        dlt_theatre: function(id){
            fetch(`/theatre/${id}`, {
                method:"DELETE", 
                    headers:{
                        "Authentication-Token": localStorage.getItem('token'),
                        "Content-Type": "application/json",
                        }
                }
            ).then(response=> {
                if (response.status===401){
                    this.$router.push({path:"/adminlogin"})
                    throw new Error("Login as Admin")
                }
                else {
                    return response.json()
                }
            }
                ).then(()=>{

                    this.$router.push({path:"/adminhome"})
                    window.location.reload()})
        }, 
        export_data:function(t_s,id){
            this.not_exported=false
            fetch(`/gen_csv/${t_s}/${id}`,{
                method:"GET", 
                headers:{
                    // "Authentication-Token": localStorage.getItem('token'),
                        // "Content-Type": "application/json",
                }
            }).then(r=> {
                return r.json()}
                ).then((d)=>{

                    console.log(d)
                    // if (this.profile.email!="admin@gmail.com"){
                    //     this.user=true
                    //     this.$router.push({path:"/adminlogin"})
                    //     throw new Error("Login as Admin")
                    // }
                    // else
                    // console.log(typeof(this.req_item))
                    // console.log(typeof(this.req_item["t"])
                    
                    if (t_s=="t"){
                        console.log(this.theatre_data)
                        this.req_item=this.theatre.filter(item => item.id === id)
                        console.log(this.req_item['t'])
                        // this.req_item.t.push(id)
                    }
                    else if( t_s=="s"){
                        this.req_item=this.show.filter(item=> item.id===id)
                        // this.req_item.s.push(id)
                    // }
                    }
                    // const a = document.createElement('a');
                    // console.log(this.req_item)
                    // console.log(typeof(this.req_item))
                    // console.log(this.req_item)
                    console.log("works")
                    // while ( ( fetch(`/status/${task_id}`).then(r=>r.json()).then((d)=> {console.log(d.status)})) != "SUCCESS"){
                    //     setTimeout(() => {
                            // Code to be executed after 5 seconds
                            // For now, let's just log a message to the console
                    //         console.log("check after 5s");
                        //   }, 5000);
                    // // }
                    // a.href = "static/"+this.req_item[0].Name+".csv";
                    // a.download = this.req_item+".csv"
                    // // this.file_name=this.req_item+".csv"

                    // a.click();

                
                    })
                },
                    download_data:function(t_s,id){
                        console.log(t_s,id)
                        console.log(this.theatre)
                        if (t_s=="t"){
                            console.log("wa")
                            
                            //     // console.log(id)
                            //     this.download=this.theatre.filter(item=> item.id===id)
                            //     // this.download= this.theatre.filter(item=> item.id===id)
                            //     // console.log(this.download)

                            //     this.not_exported=true;
                        
                            // // console.log(this.theatre_data)
                            if (this.req_item[0].Name!= this.theatre.filter(item=> item.id ===id).Name){
                            console.log('err')
                            this.not_exported=true;
                        }
                        else{
                            this.req_item=this.theatre.filter(item => item.id === id)
                        // }
                    }}
                        else if( t_s=="s"){
                            // if (id in this.req_item.s){
                            //     this.download=this.show.filter(item=> item.id===id)
                            //     console.log(this.download)
                            // }
                            // else{
                            //     this.not_exported=true;
                            // }
                            if (this.req_item[0].Name!= this.theatre.filter(item=> item.id ===id).Name){
                                console.log('err')
                                this.not_exported=true;
                            }
                            else{
                            this.req_item=this.show.filter(item=> item.id===id)
                        // }
                        }
                        }
                        const a = document.createElement('a');
                    //  console.log(this.req_item)
                    //  console.log(typeof(this.req_item))
                    console.log(this.download)
                    console.log("works")
                    a.href = "static/"+this.req_item[0].Name+".csv";
                    a.download = this.req_item[0].Name+".csv"
                    this.file_name=this.req_item[0].Name+".csv"
                    a.click();
                        }
                        
                    }

    
    }

            
        
    

