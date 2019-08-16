const request = require('request')
const fs = require('fs')
const tar = require('tar-fs')
const os = require('os')
const { exec } = require('child_process');
const clui = require('clui');
const Progress = clui.Progress
const Spinner = clui.Spinner

module.exports = service = {
  uploadFile: (cli) => {
    let progressBar = new Progress((process.stdout.columns - 10))
    let isUploading = true
    let buildProgress = new Spinner('Build in progress', ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷']);
    console.log("Uploading app", cli.app)
    process.stdout.write(progressBar.update(0))
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
        console.log("Unable to deploy app")
      }
      if (!response) {
        console.log("Unable to deploy app")
      }
      response = JSON.parse(response.body)
      process.stdout.write('\n');
      if (response.success) {
        console.log(response.message)
      } else {
        console.error(response.message)
      }
      clearInterval(interval)
      process.exit(0)
    })

    const interval = setInterval(() => {
      const bytesUploaded = r.req.connection._bytesDispatched
      const originalFileSize = fs.statSync(cli.file).size
      if (bytesUploaded > originalFileSize) {
        if (isUploading) {
          process.stdout.clearLine();
          process.stdout.cursorTo(0);
          process.stdout.write(progressBar.update(1))
          process.stdout.write('\n');
          buildProgress.start()
          isUploading = false
        }
        return
      }
      const percentage = ((bytesUploaded / originalFileSize) * 100) / 100
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      process.stdout.write(progressBar.update(percentage))
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