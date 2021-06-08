# Realtime Collaborative Code Editor

Share and live collaborate on your code with developers anywhere.

## Features:
* Supported Languages: 
    * C/C++ 
    * Python 
    * Javascript-Node
* Real Time Collaboration despite network latency
* Pick up from where you left off
* Dark Theme

## Build:
Clone the repository by running

``` 
git clone https://github.com/ShaderOX/live-editor.git && cd live-editor 
```

Install the required packages using
```
npm i
```

Configure the .env <br/>
The application would need
* ```PORT``` (defautls to 3000)  
* ```MONGO_URI``` 
* ```GOOGLE_CLIENT_ID```
* ```GOOGLE_CLIENT_SECRET```
* ```GITHUB_CLIENT_ID``` 
* ```GITHUB_CLIENT_SECRET``` 

varibles in order to access the database, support Google Authentication and Github Authentication.

Now, before 

Next, run 
```
npm start
```
and open http://localhost:3000 to access the running application



