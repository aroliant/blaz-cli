const request = require('request')
const fs = require('fs')
const tar = require('tar-fs')
const os = require('os')
const { exec } = require('child_process');


module.exports = service = {
  uploadFile: (cli) => {
    console.log("Uploading app", cli.app)
    const fileStream = fs.createReadStream(cli.file)
    const r = request({
      uri: `${cli.host}:3000/api/v1/apps/upload`,
      method: 'POST',
      formData: {
        sourceFile: fileStream,
      },
      headers: {
        'x-app-name': cli.app,
        'x-mode': cli.mode
      }
    }, (err, response) => {
      if (err) {
        console.error(err)
      }
      console.log(response.body)
      clearInterval(interval)
    })

    const interval = setInterval(() => {
      const bytesUploaded = r.req.connection._bytesDispatched
      const originalFileSize = fs.statSync(cli.file).size
      if (bytesUploaded > originalFileSize) {
        return console.log("Build in progress")
      }
      console.log(`Uploading`, bytesUploaded, "of", originalFileSize)
    }, 250)

  },

  tarFolder: (cli) => {
    const tempFile = os.tmpdir() + "blaz_" + Date.now() + ".tar"
    fs.writeFileSync(tempFile)
    console.log("Converting folder to tar")
    tar.pack('.').pipe(fs.createWriteStream(tempFile))
    cli.file = tempFile
    service.uploadFile(cli)
  },

  tarGitBranch: (cli) => {
    const tempFile = os.tmpdir() + "blaz_" + Date.now() + ".tar"
    fs.writeFileSync(tempFile)

    exec(`git archive --format=tar -o ${tempFile} ${cli.context}`, (err, stdout, stderr) => {
      if (err) {
        console.error(err)
      }
      cli.file = tempFile
      service.uploadFile(cli)
    });

  },

  tarDockerImage: (cli) => {
    const tempFile = os.tmpdir() + "blaz_" + Date.now() + ".tar"
    fs.writeFileSync(tempFile)
    console.log("Preparing image for", cli.context)
    exec(`docker save ${cli.context} > ${tempFile}`, (err, stdout, stderr) => {
      if (err) {
        console.error(err)
      }
      cli.file = tempFile
      service.uploadFile(cli)
    });

  }

}