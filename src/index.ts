import fs from 'fs/promises'
import path from 'path'
import minimist from 'minimist'

const log = console.log
const directory = process.cwd()

async function handleConfigFile() {
  const isExits = await fs.stat(path.join(directory, 'meta.json')).then(() => true).catch(() => false)
  if(isExits) {
    log(`meta.json is found.`)
    log()
  } else {
    log(`meta.json is not found, creating a default meta.json.`)
    log()

    let meta = {
      title: ''
    }
    await fs.writeFile('meta.json', JSON.stringify(meta, null, 2))
    log(`meta.json is created.`)
    log()
  }
}

async function handleMeta() {
  const content = await fs.readFile( path.join(directory, 'meta.json'), 'utf8')
  const config = JSON.parse(content)
  let metaConfig = ''
  Object.keys(config).forEach(key => {
    metaConfig = metaConfig + `${key}: ${config[key]}\n`
  })

  const metaContent = `---\n${metaConfig}---\n`
  return metaContent
}

async function insertMeta(file: string, meta: string, replace: boolean = true) {
  const o = await fs.readFile(path.join(directory, file), 'utf8')
  const regex = /^(---)[\d\D]*?(---\n)/g
  if(o.match(regex)) {
    if(replace) {
      const n = o.replace(regex, meta)
      return fs.writeFile(path.join(directory, file), n)
    }
  } else {
    const n = `${meta}${o}`
    return fs.writeFile(path.join(directory, file), n)
  }
}

async function run() {
  const argv = minimist(process.argv.slice(2), {
    boolean: ['replace'],
    alias: {
      r: 'replace'
    }
  })

  const files = (await fs.readdir(directory, { withFileTypes: true }))
    .filter(entry => entry.isFile())
    .map(entry => entry.name)

  const mdFiles = files.filter(file => {
    let filePath = path.join(directory, file)
    return path.extname(filePath) === '.md'
  })

  handleConfigFile()
  const meta = await handleMeta()
  Promise.all(mdFiles.map(async md => ( insertMeta(md, meta, argv.replace) )))

  log(`found ${ mdFiles.length } markdown files in current directory.`)
}

run()