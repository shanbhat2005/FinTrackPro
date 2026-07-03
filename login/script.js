let login_card= document.querySelector("#login-card")
let register_card= document.querySelector("#register-card")
let loginForm= document.getElementById("login_form")
let registerForm= document.getElementById("register-form")

let reg_anchor= document.querySelector("#reg-anchor")
let login_anchor=document.querySelector("#login-anchor")

let regName= document.getElementById("register_name")
let regPass= document.getElementById("reg_pass")

reg_anchor.addEventListener("click",(e)=>{
    e.preventDefault()
    login_card.style.display="none"
    register_card.style.display="block"
})

login_anchor.addEventListener("click",(e)=>{
     e.preventDefault()
    register_card.style.display="none"
    login_card.style.display="block"
})


// for register form 

    // localStorage.removeItem("users")
registerForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let users=JSON.parse(localStorage.getItem("users"))||[]

    let userExists=false;
    let username= regName.value
    let password= regPass.value
    let user={
        username,
        password
    }

    users.forEach((data)=>{
if(data.username===user.username ){
    userExists=true;
    
}
    })

    if(userExists){
        alert("user already exists")
       register_card.style.display="none";
       login_card.style.display="block";
       
    }
    else{
        users.push(user);
        localStorage.setItem("users",JSON.stringify(users))
    }

})

// for login page

let logName= document.getElementById("login_name");
let logPass= document.getElementById("login_pass")

loginForm.addEventListener("submit",(e)=>{
    e.preventDefault()
    let users=JSON.parse(localStorage.getItem("users"))||[]
    let isUser=false;

    let username=logName.value;
    let password= logPass.value;

    
    users.forEach((data)=>{
if(username===data.username &&password===data.password){
    isUser=true
}


    })
    if(isUser===true){
alert("we are Logging you in")
localStorage.setItem("loggedInUser",JSON.stringify(username))
window.location.href="../home_page/dashboard.html";
}else{
    alert("register first")
}
})
