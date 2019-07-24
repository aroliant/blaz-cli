const request = require('request-promise')
const fs = require('fs')
const tar = require('tar-fs')
const os = require('os')
const { exec } = require('child_process');


module.exports = service = {
  uploadFile: (cli) => {
    console.log("Uploading app", cli)
    request({
      uri: `${cli.host}:3000/api/v1/apps/upload`,
      method: 'POST',
      formData: {
        sourceFile: fs.createReadStream(cli.file),
      },
      headers: {
        'x-app-name': cli.app,
        'x-mode': cli.mode
      }
    }).then((result) => {
      console.log(result)
    }).catch((err) => {
      console.log(err)
    })

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