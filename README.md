Title:	 VIT Application Description  
Authors: Victor Popescu  
Document Version: 2.0.1  
Last Update: July 2017  

# Vit
Hang Out Space   
A javascript application.  
Thx <a href="https://github.com/jester6san" target="_blank">Jester</a> for the awesome logo design 


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

### First time run:
**Option 1:**
- Download the solution  
- Go to project folder
- Run `Vit Install.bat` file to download & install all dependencies (this will take a while)
- After all done, close the current terminal and go to the next step: `"Not first time run"`  

**Option 2:**
- Download the solution  
- Open terminal and navigate to project folder
- Type `npm install` to download & install all dependencies (this will take a while)
- After all done, close the current terminal and go to the next step: `"Not first time run"`
   
### Not first time run:  

**Option 1:**  
In the project folder:
- Run `Vit Start.bat` file  
    *Note: This will start the server and try to open chrome browser to localhost:4400, the application page*  

**Option 2:**  
In the project folder:  
- open the terminal and type `nodemon`  
- open your browser and access the page at `http://localhost:4400/` 


### ***Important Note: Type any credentials into login form, it will prompt you to register automatically***



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

## Games (`work in progress...`)