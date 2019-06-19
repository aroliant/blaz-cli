

## Setup

```shell
blaz setup server
```


List configured servers
 
```shell
blaz servers list
```
 

## Deploy
 
#### Deploy your project on Server
 
```shell
 blaz deploy
```
 
#### Deploy current folder
 
```shell
blaz deploy -f . -a sample-app -h https://server.example.com
```

#### Deploy a tar file
 
```shell
blaz deploy -t myapp.tar -a sample-app -h https://server.example.com
```
 
#### Deploy a zip file
 
```shell
blaz deploy -z myapp.zip -a sample-app -h https://server.example.com
```
 
#### Deploy current branch
 
```shell
blaz deploy -b master -a sample-app -h https://server.example.com
```
 
#### Deploy docker image
  
```shell
blaz deploy -m myapp:latest -a sample-app -h https://server.example.com
```

#### Deploy using local config file

```shell
blaz deploy -c blaz.json
```

blaz.json
```json
{
  "server": "https://server.example.com",
  "ipv4": "127.0.0.1",
  "accessKey": "e42e2568c8d6d63501de60df39b6a00f9bb80818abb9cacb1bc234b6",
  "app": "my-app"
}
```

 
