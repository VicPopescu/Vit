# Vit
Hang Out Space   
A javascript application.  
Thx [Jester](https://github.com/jester6san) for the awesome logo design 

<img src="https://github.com/VicPopescu/Vit/blob/master/public/images/logo_5.png?raw=true" height= "250px" alt="logo"/>

## What was used

#### Server:
- Node.js (V6.10.0) & NPM(V5.1.0) <a href="https://nodejs.org/en/" target="_blank">-->[Link]</a>
- Express.js <a href="https://expressjs.com/" target="_blank">-->[Link]</a>
- Socket.io <a href="https://socket.io/" target="_blank">-->[Link]</a>
- Fs <a href="https://nodejs.org/api/fs.html" target="_blank">-->[Link]</a>
- Node Sass Middleware  <a href="https://github.com/sass/node-sass-middleware" target="_blank">-->[Link]</a> 

#### Client:
- jQuery
- Chart.js (v2.5.0)
- Normalize.css
- Sass
- Font-awesome (V4.7.0)
- Socket.io (Client)

## Running the application 
- Download the solution   
- Open the terminal in the project folder    

Then type:   
- `npm install`    
- `nodemon`   
- access the page at `http://localhost:4400/` in your browser   
- type anything into login form, it will prompt you to register automatically

# Features  
A list of the widgets and what can they do.   

## Chat Widget
- Send and receive messages in real time
- Online/Offline users lists
- Profanity filter (ex. try to say "bad bad bad" in chat, and see what happens)
- Script injection forbidden
- File transfer, preview and download
- Keeping the conversation history
- Administration commands (ex. type `!admin logo` to get the app logo, or `!admin pfaddbad badexample` to add `"badexample"` word into profanity bad words dictionary)
- User <span style="color:#AF87CF;">@mention</span>
- HTML 5 notifications (when a new user log in or when the application window is out of focus)  
- Custom scrollbar (only webkit)
- Display the date and time depending on user location/timezone. If the date is the current day, it will display "today"
- First letter from each sentence is capitalized (uppercase) automatically   

## Weather Widget  
- HTML 5 Geolocation
- Fetch [JSON] informations about the weather from [Dark Sky Api](https://darksky.net/dev/)
- Option to choose measuring system
- Displays: 
    - Current address
    - Current weather
    - Descriptive animation
    - 7 days forecast for temperature and precipitations

## Random Quote Widget  
- Fetch and displays quotes from [Quotes On Design API](https://quotesondesign.com/api-v4-0/)
- The user can get new quotes each time he presses a button
- The current quote can pe shared on Twitter

## Games (`work in progress`)