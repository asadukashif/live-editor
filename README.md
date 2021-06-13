# Realtime Collaborative Code Editor

Share and live collaborate on your code with developers anywhere.

## Features:
* Supported Languages: 
    * C/C++ 
    * Python 
    * JavaScript
* Real Time Collaboration despite network latency
* Sharing is as simple as sharing a link
* Pick up from where you left off
* View the list of all the projects you've worked on
* Dark Theme
* Sublime Text keybinds integrated
* Responsive Design suitable for Desktop, Tablets and Mobile

## Build:
Clone the repository by running

``` 
git clone https://github.com/ShaderOX/live-editor.git && cd live-editor 
```

Installs the required packages
```
npm ci
```

Builds the release JavaScript file
```
npm run build
```

### Configure the .env 
The application would need

* ```PORT``` (defaults to 3000)  
* ```MONGO_URI``` 
* ```GOOGLE_CLIENT_ID```
* ```GOOGLE_CLIENT_SECRET```

Variables in order to access the database, support Google Authentication and Github Authentication. <br />
* ```GITHUB_CLIENT_ID``` 
* ```GITHUB_CLIENT_SECRET``` 


Now, before 

Next, run 
```
npm start
```
and open http://localhost:3000 to access the running application

## Check it out here now!
The application is live at http://bocks-editor.uaenorth.cloudapp.azure.com

