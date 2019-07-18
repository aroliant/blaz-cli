const request = require('request-promise')
const fs = require('fs')
const tar = require('tar-fs')
const tmp = require('tmp')
const os = require('os')

module.exports = service = {
  uploadTarFile: (cli) => {

    request({
      uri: `${cli.host}:3000/api/apps/upload/${cli.app}`,
      method: 'POST',
      formData: {
        sourceFile: fs.createReadStream(cli.context),
        mode: cli.mode
      }
    }).then((result) => {
      console.log(result)
    }).catch((err) => {
      console.log(err)
    })

  },

  tarFolder: (cli) => {
    const tempFile = os.tmpdir() + "blaz_" + Date.now() + ".tar"
    console.log(tempFile)
    fs.writeFileSync(tempFile)
    tar.pack('.').pipe(fs.createWriteStream(tempFile))
    cli.context = tempFile
    service.uploadTarFile(cli)

  }

}