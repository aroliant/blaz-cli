#!/usr/bin/env node
const request = require('request-promise')
const fs = require('fs')
const args = require('minimist')(process.argv.slice(2));

let cli = {
  mode: undefined,
  app: undefined,
  host: undefined,
  context: undefined,
}

console.log(args)


// Deployment Mode
if (args.z || args.zip) {
  cli.mode = "zip"
  cli.context = args.z ? args.z : args.zip
} else if (args.t || args.tar) {
  cli.mode = "tar"
  cli.context = args.t ? args.t : args.tar
} else if (args.f || args.folder) {
  cli.mode = "folder"
  cli.context = args.f ? args.f : args.folder
} else if (args.b || args.branch) {
  cli.mode = "branch"
  cli.context = args.b ? args.b : args.branch
} else if (args.i || args.image) {
  cli.mode = "image"
  cli.context = args.i ? args.i : args.image
}

//App Name
if (args.a) cli.app = args.a
if (args.app) cli.app = args.app

//Host Name
if (args.h) cli.host = args.h
if (args.host) cli.host = args.host

if (!cli.mode) {
  return console.error("Please choose a deployment mode")
}

if (!cli.app) {
  return console.error("Please specify an app name")
}

if (!cli.host) {
  return console.error("Please specify an host name")
}


request({
  uri: `${cli.host}:3000/api/apps/upload/${cli.app}`,
  method: 'POST',
  formData: {
    sourceFile: fs.createReadStream(cli.context)
  }
}).then((result) => {
  console.log(result)
}).catch((err) => {
  console.log(err)
})