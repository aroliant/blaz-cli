

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
blaz deploy -i myapp:latest -a sample-app -h https://server.example.com
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

 #### Arguments

| Argument   | Name       | Description                                                               |
|------------|------------|---------------------------------------------------------------------------|
| f , folder | folder     | Deploys current folder                                                    |
| t , tar    | tar file   | Deploys a tar file                                                        |
| z , zip    | zip file   | Deploys a zip file                                                        |
| b , branch | branch     | Deploys current branch                                                    |
| a , app    | app        | Specify the app name                                                      |
| h , host   | host       | Specify the host name                                                     |
| m , mode   | build mode | eg. `local:1`, `runner:runnerName`                                        |
|            |            | `local` - builds locally, `1` - uses 1 cpu ( default half of system cpu ) |
|            |            | `runner` - specifying custom runner, `runnerName` - name of the runner    |
|            |            | by default app builds on primary server/runner based on blaz settings     |
