import { promises as fs, existsSync} from 'fs'
import path from 'path'
import minimist from 'minimist'
import pc from 'picocolors'
import { version } from '../package.json'

const log = console.log
const directory = process.cwd()

async function handleConfigFile() {
  const isExits = existsSync(path.join(directory, 'meta.json'))
  if(isExits) {
    log(`${pc.green('meta.json is found.')}`)
    log()
  } else {
    log(pc.red(`meta.json is not found, creating a default meta.json.`))
    log()

    const d = {
      title: ''
    }
    await fs.writeFile('meta.json', JSON.stringify(d, null, 2), 'utf-8')
    log(`meta.json is created.`)
    log()
  }
}

async function handleMeta() {
  const content = await fs.readFile(path.join(directory, 'meta.json'), 'utf-8')
  const config = JSON.parse(content)
  let metaConfig = ''
  Object.keys(config).forEach(key => {
    metaConfig = metaConfig + `${key}: ${config[key]}\n`
  })

  const metaContent = `---\n${metaConfig}---\n`
  return metaContent
}

async function insertMeta(file: string, meta: string, replace: boolean = true) {
  const o = await fs.readFile(path.join(directory, file), 'utf-8')
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
  log(pc.green(`version: ${version}`))
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

  await handleConfigFile()
  const meta = await handleMeta()
  Promise.all(mdFiles.map(async md => (insertMeta(md, meta, argv.replace) )))

  log(pc.green(`all done!`))
}

run()