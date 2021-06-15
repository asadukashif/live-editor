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
* Backup all the files you have been working on
* Dark Theme
* Sublime Text keybinds integrated
* Responsive Design suitable for Desktop, Tablets and Mobile

## Check it out here now!
The application is live at https://bocks-editor.uaenorth.cloudapp.azure.com

## Build:
Clone the repository by running

``` 
git clone https://github.com/ShaderOX/live-editor.git && cd live-editor 
```

Installs the required packages
```
npm i
```

Builds the release JavaScript file
```
npm run build
```

### Configure the .env 
The application would need

* ```PORT``` (defaults to 3000)  
* ```MONGO_URI``` 
* ```GITHUB_CLIENT_ID``` 
* ```GITHUB_CLIENT_SECRET``` 
</br>

variables in order to access the database and support Github Authentication.

Now, before 

Next, run 
```
npm start
```
and open http://localhost:3000 to access the running application


