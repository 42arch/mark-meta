import fs from 'fs'
import path from 'path'

const log = console.log
const directory = process.cwd()

function handleConfigFile() {
  const isExits = fs.existsSync(path.join(directory, 'meta.json'))
  if(isExits) {
    log(`meta.json is found.`)
  } else {
    log(`meta.json is not found, creating a default meta.json.`)

    let meta = {
      title: ''
    }
    fs.writeFileSync('meta.json', JSON.stringify(meta, null, 2))
    log(`meta.json is created.`)
  }
}

function handleMeta(replace: boolean) {
  const content = fs.readFileSync( path.join(directory, 'meta.json'), 'utf8')
  const config = JSON.parse(content)
  const metaConfig = Object.keys(config).map(key => {
    return `${key}: ${config[key]}\n`
  })

  const metaContent = `---\n${metaConfig}---`
  return metaContent
}


function run() {
  const files = fs.readdirSync(directory, { withFileTypes: true })
    .filter(entry => entry.isFile())
    .map(entry => entry.name)

  const mdFiles = files.filter(file => {
    let filePath = path.join(directory, file)
    return path.extname(filePath) === '.md'
  })

  handleConfigFile()
  const meta = handleMeta(true)
  console.log(meta)

  log(`found ${ mdFiles.length } markdown files in current directory.`)
}

run()