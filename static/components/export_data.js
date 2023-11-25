export default{
    template:`
    <div> 
    <label for="theatre">Select Theatre for data</label> 
        <select v-model="theatre_select">
            <option v-for="theatre in theatre" :value="theatre.id">{{ theatre.Name}},{{theatre.Place}}</option>
        </select>
        <button @click="export_data('t',theatre_select)">Export theatre data as pdf</button>
        <br>

        <label for="show">Select show for data</label>
        <select v-model="show_select">
            <option v-for="show in show" :value="show.id">{{ show.Name}}</option>
        </select>
        <button @click="export_data('s',show_select)"> Export show data as pdf </button>

    </div> 
    `, 
    data:function(){
        return {
            show:[], 
            theatre:[], 
            profile:[],
            pdfUrl:null,
            theatre_select:null,
            show_select:null, 
            path:null
        }
    },
    mounted:function(){
        // this.profile_data();
        this.show_data();

        this.theatre_data();
    },
    methods:{
        theatre_data:function(){
            fetch("/theatre",{method : "GET", 
            headers:{
                // "Authentication-Token": localStorage.getItem('token'),
                "Content-Type": "application/json",
                },
            }).then(response=> response.json())
            .then((data)=> {
            //     if (this.profile.email!="admin@gmail.com"){
            //     this.user=true
            //     this.$router.push({path:"/adminlogin"})
            //     throw new Error("Login as Admin")
            // }
            // else{
                // console.log(data)
                // console.log(this.password)
                // console.log(data.email)
                
                this.theatre=data.theatres;
                // this.$router.push({path:"/adminhome"})
            // }


        })
        }, 
        show_data:function(){
            fetch("/show/",{method : "GET", 
            headers:{
                // "Authentication-Token": localStorage.getItem('token'),
                "Content-Type": "application/json",
                },
            }).then(response=> response.json())
            .then((data)=> {
            //     if (this.profile.email!="admin@gmail.com"){
            //     this.user=true
            //     this.$router.push({path:"/adminlogin"})
            //     throw new Error("Login as Admin")
            // }
            // else{
                // console.log(data)
                // console.log(this.password)
                // console.log(data.email)
                this.show=data.all_show;
                // this.$router.push("/adminhome")
                // }


        })
        
        }, 
        // Arvind's Life.pdf
        export_data: function(t_s,id){
            fetch(`/export_data/${t_s}/${id}`, {
                method:"POST"}).then(r=>r.json()
                    ).then((data)=> {

                            this.pdfUrl=data;
                            this.pdfUrl =new URL(window.location.origin +"/"+ this.pdfUrl);
                            console.log(this.pdfUrl)
                            window.open(this.pdfUrl.href,"_blank")
                            // console.log(d.url)

                        // window.open(d, '_blank'),
                        // console.log(d)
                    }
                );
                
            
            }, 
            downloadPDF(pdfUrl) {
                const downloadLink = document.createElement('a');
                downloadLink.href = pdfUrl;
                downloadLink.download = 'details.pdf'; // Set the desired filename
                downloadLink.style.display = 'none';
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            }
        }

    }
