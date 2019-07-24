const request = require('request-promise')
const fs = require('fs')
const tar = require('tar-fs')
const os = require('os')

module.exports = service = {
  uploadFile: (cli) => {

    request({
      uri: `${cli.host}:3000/api/v1/apps/upload`,
      method: 'POST',
      formData: {
        sourceFile: fs.createReadStream(cli.file),
        type: cli.mode,
        appName: cli.app
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
    tar.pack('.').pipe(fs.createWriteStream(tempFile))
    cli.file = tempFile
    service.uploadFile(cli)
  },


  }

}