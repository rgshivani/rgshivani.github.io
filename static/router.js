import user_home from "./components/user_home.js"
import signup from "./components/signup.js"
import user_login from "./components/user_login.js"
import profile_detail from "./components/profile_detail.js"
import admin_login from "./components/admin_login.js"
import admin_home from "./components/admin_home.js"
import add_theatre from "./components/add_theatre.js"
import add_show from "./components/add_show.js"
import add_screening from "./components/add_screening.js"
import booking_successful from "./components/booking_successful.js"
import mytix from "./components/mytix.js"
import filter from "./components/filter_genre.js"

import edit_show from "./components/edit_show.js"
import edit_theatre from "./components/edit_theatre.js"
import export_data from "./components/export_data.js"
import filter_genre from "./components/filter_genre.js"
import filter_location from "./components/filter_location.js"
const routes=[

    {   
        path:"/user_home",
        component:user_home,
    },

    {
        path:"/signup",
        name:"signup",
        component:signup,
    },
    {
        path:"/userlogin",
        component:user_login
    },{
        path:"/profile_detail",
        component:profile_detail
    },
    {
        path:"/adminlogin",
        component:admin_login
    },
    {
        path:"/adminhome",
        component:admin_home
    }, 
    {
        path:"/addtheatre",
        component:add_theatre
    },{
        path:"/addshow",
        component:add_show
    },{
        path: "/addscreening",
        component:add_screening
    },{
        path:"/booking_successful",
        component:booking_successful
    }, {
        path:"/mytix",
        component:mytix
    },
    {
        path:"/filter_genre", 
        component:filter_genre
    }, {
        path:"/edit_show/:id",
        component:edit_show

    }, {
        path:"/edit_theatre/:id",
        component:edit_theatre
    }, {
        path:"/export_data",
        component:export_data
    },{
        path:"/filter_location",
        component:filter_location
    }
   
]
const router= new VueRouter({
    routes
})

export default router;