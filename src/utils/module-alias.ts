import * as path from 'path'
import ModuleAlias from 'module-alias'

const files = path.resolve(__dirname, '../..')

ModuleAlias.addAliases({
    '@src': path.join(files, 'src'),
    '@tests': path.join(files, 'tests'),
})