
let currentView = "signup-or-login"
let errorFrom = undefined
let errorReason = undefined
let token = undefined
let spammer = 0
let link = "https://stirring-bronzed-turnover.glitch.me/"

let css_loaded = false //for css loads
//ADD LISTENERS TO LOGIN AND SIGNUP BUTTONS
let add_sign_login_list = (signup_but, login_but) =>{
  signup_but.addEventListener("click", () => {
        currentView = "signup"
        render()
        })
  
  login_but.addEventListener("click", () => {
        currentView = "login"
        render()
        })
  
}
//DEFAULT VIEW CONTAINER (HEADER + 2 buttons
let def_home = () =>{ //create div with header and singup, login buttons
  let div = document.createElement("div")
  let header = document.createElement("h") //1. header
      header.innerText = "Welcome to Chatter Flesh ;)"
      header.setAttribute("id", "intro")
    
  let signupButton = document.createElement("button") //2.signup
      signupButton.innerText = "Sign up"
      signupButton.setAttribute("id", "signup")
      signupButton.setAttribute("class", "button")
  let loginButton = document.createElement("button")//3. login
      loginButton.innerText = "Login"
      loginButton.setAttribute("id", "login")
      loginButton.setAttribute("class", "button")
  
  add_sign_login_list(signupButton, loginButton)
  
  div.appendChild(header);
  div.appendChild(signupButton);
  div.appendChild(loginButton);
  return div;
}
//DEFAULT VIEW
let signupOrLoginView = () => {
    //  You will need to modify this function
    let container = def_home()
    container.setAttribute("class", "enter")
    return container
}
//ERROR view

let errorView = () => {

  
errorFrom = errorFrom.charAt(0).toUpperCase() + errorFrom.slice(1);
let container = document.createElement("div")
    container.setAttribute("id", "error")
  
let message = document.createElement("h")
    message.setAttribute ("class", "assign")
    message.innerText = errorFrom + " failed. Reson: " + errorReason//1
  
let errButton = document.createElement("button")
    errButton.setAttribute("class", "errorBut")
    errButton.innerText = "Back to home"
          
    errButton.addEventListener("click", () => {
    currentView = "signup-or-login"
    render()
   })
  
  container.appendChild(message)
  container.appendChild(errButton)
  return container
 }

let submitclick = (event) => {
  
    let request = event.target.id.replace("subButton","") // should return either login or signup
  
    let username = document.getElementById("usr").value
    let password = document.getElementById("pass").value
        // JSON.stringify converts a JavaScript value to a string
        let bodyToBeSent = JSON.stringify({ username, password })
        // fetch is covered in depth in the slides
        async function submitFetch() {
          let response = await fetch(link+request, { method: "POST", body: bodyToBeSent });
          if (!response.ok) {
              let data = response.json()
              errorFrom = request
              currentView = "error"//3
              errorReason = data.reason
              render() 
          } else {
            return await response.json();
          }
        }

        submitFetch().then((data) => {
          if (!data.success) {
                  debugger
                  errorFrom = request
                  currentView = "error"//3
                  errorReason = data.reason
                  render() 
                } else {
                  if (request === "signup") {
                    alert("signup successful")//4
                    currentView = "login"
                  }
                  else
                  {
                    currentView = "chat"
                    token = data.token
                  }
                  
                  render() 
                }
        }).catch(e => console.log(e));
  

   event.preventDefault();
}
let createForm = (method) => {
  let title_text
  
  switch(method) {
  case "login":
    title_text = "Login"
    break;
  default:
     title_text = "Sign up" }

  
  let container = document.createElement("form")
     container.setAttribute("id", method)//1
//title
let titleReg = document.createElement("h")
    titleReg.setAttribute("class", "assign")
    titleReg.innerText = title_text//2

    let divOne = document.createElement("div")
    divOne.setAttribute("class", "centered-input")

// label for Username
 let user = document.createElement("label")
    user.innerText = "Username"
    user.setAttribute("class", "labelStyle")

// Input field for username
let usernameInput = document.createElement("input")
    usernameInput.setAttribute("class", "inputStyle")
    usernameInput.setAttribute("id", "usr")
    divOne.appendChild(user)
    divOne.appendChild(usernameInput)

let divTwo = document.createElement("div")
    divTwo.setAttribute("class", "centered-input")

// label for Password
let pass = document.createElement("label")
    pass.innerText = "Password"
    pass.setAttribute("class", "labelStyle")
// Input field for Password
let passwordInput = document.createElement("input")
    passwordInput.setAttribute("class", "inputStyle")
     passwordInput.setAttribute("id", "pass")
    divTwo.appendChild(pass)
    divTwo.appendChild(passwordInput)

let divThree = document.createElement("div")
  divThree.setAttribute("class", "centered-input")

//Clear button
let cancelButton = document.createElement("button")
    cancelButton.setAttribute("id", "cancButton")
    cancelButton.setAttribute("class", "regButtons")
    cancelButton.innerText = "Cancel"


//Submit button
    let submitButton = document.createElement("button")
        submitButton.setAttribute("id", "subButton"+method)
        submitButton.setAttribute("class", "regButtons")
        submitButton.innerText = "Submit"
  
  
  
    submitButton.addEventListener('click', submitclick)

    divThree.appendChild(cancelButton)
    divThree.appendChild(submitButton)

    container.appendChild(titleReg)
    container.appendChild(divOne)
    container.appendChild(divTwo)
    container.appendChild(divThree)
 
return container
  
}
//signupView
let signupView = () => {
    //  You will need to modify this function

 let container = createForm("signup")
 return container

}

//loginViewi
let loginView = () => {
 let container = createForm("login")
 return container
} 

//to load stylesheet 
let load_css = () => {
let h = document.getElementsByTagName("HEAD")[0]
let l = document.createElement ("link")
    l.rel = "stylesheet"
    l.type = "text/css"
    l.href = "./style.css"
    h.appendChild(l)
}


let refreshListener = () =>
{
  let text = ""
  let chatPar = document.getElementById("dispChat")
    async function refreshFetch() {
      let response = await fetch(link + "messages", { method: "GET"});
      if (!response.ok) {
          let data = response.json()
          errorFrom = "Refresh"
          currentView = "error"//3
          errorReason = data.reason
          render() 
      } else {
        return await response.json();
      }
    }

    refreshFetch().then((data) => {
      if (!data.success) {
              currentView = "error"//3
              errorFrom = "Refresh"
              errorReason = data.reason
              render() 
            } else {
              let i
              for (i = 0; i < data.messages.length; i++) {
                text = text + data.messages[i].from + ": " + data.messages[i].contents + "\n"

              }

              chatPar.innerText = text
            }

    }).catch(e => console.log(e));
}

let sendListener = () =>
{
  let input = document.getElementById("inpMesg")
  let contents = input.value
  if (contents==="" )
  {
    ++spammer
    alert("Please don't send empty messages. They are not kept on the server")
    return
  }
         
  let bodyToBeSent = JSON.stringify({ token, contents })
   async function messegeFetch() {
      let response = await fetch(link + "message", { method: "POST", body: bodyToBeSent});
      if (!response.ok) {
          let data = response.json()
          errorFrom = "Chat"
          currentView = "error"//3
          errorReason = data.reason
          render() 
      } else {
        return await response.json();
      }
    }

    messegeFetch().then((data) => {
      if (!data.success) {
              currentView = "error"//3
              errorFrom = "Chat"
              errorReason = data.reason
              render() 
            } else {
              input.value = ""  
            }

    }).catch(e => console.log(e));
        
}



let chatView = () => {
  
let container = document.createElement("div")
    container.setAttribute("id", "chat")
    container.setAttribute("class", "messageCont")
  
  let chatroom = document.createElement("h")
      chatroom.setAttribute("class", "labelStyle")
      chatroom.innerText = "Hi, nice 2 c u here :)"
  
let chatPar = document.createElement("p")
    chatPar.setAttribute("id", "dispChat" )
    chatPar.setAttribute("class", "chattext" )

  let inputText = document.createElement("textArea")
    inputText.setAttribute ("id", "inpMesg")
    inputText.setAttribute ("type", "text")
    inputText.setAttribute ("class", "inputMesg")
  
let sendMessage = document.createElement("button")
    sendMessage.setAttribute("id", "send")
    sendMessage.setAttribute("class", "regButtons")
    sendMessage.innerText = "Send message"
  
  let refreshButton = document.createElement("button")
    refreshButton.setAttribute("id", "refButton")
    refreshButton.setAttribute("class", "regButtons")
    refreshButton.innerText = "Refresh"
  
let homeButton = document.createElement("button")
    homeButton.setAttribute("id", "backHome")
    homeButton.setAttribute("class", "regButtons")
    homeButton.innerText = "Leave Chatter"
  
  //Send Message
   sendMessage.addEventListener("click", sendListener)  
  
  //Refresh chat messages 
    refreshButton.addEventListener("click", refreshListener)
 
  //Leave Chatter
  homeButton.addEventListener("click", () => {
  currentView = "signup-or-login"
    render()
    
  })
  
  container.appendChild(chatroom)
  container.appendChild(chatPar)
  container.appendChild(inputText)
  container.appendChild(sendMessage)
  container.appendChild(refreshButton)
  container.appendChild(homeButton)
  return container
 }

// Rerenders the page
let render = () => {
    // Will contain a reference 
let toRender = undefined
    // For debugging purposes
    console.log("rendering view", currentView)
    if (currentView === "signup-or-login") {
        toRender = signupOrLoginView()
    } else if (currentView === "signup") {
        toRender = signupView()
    } else if (currentView === "login"){
        toRender = loginView()
    } else if (currentView === "error"){
        toRender = errorView()
    } else if (errorView === "signup-or-login"){
        toRender = signupOrLoginView()
    } else if(currentView === "chat"){
        toRender =  chatView()
    } else {
        // woops
        alert("unhandled currentView " + currentView)
    }

    // Removes all children from the body
    document.body.innerHTML = ""
    document.body.appendChild(toRender)

    if (!css_loaded){
      load_css()//to append css properly
      css_loaded = true
    }
}  
// Initial render
render() 
