const fs = require('fs')
const jsonServer = require('json-server')
const path = require('path')
const https = require('node:https')

const server = jsonServer.create()

const router = jsonServer.router(path.resolve(__dirname, 'db.json'))

const options = {
  key: fs.readFileSync(path.resolve(__dirname, 'server.key')),
  cert: fs.readFileSync(path.resolve(__dirname, 'server.cert')),
}


server.use(jsonServer.defaults({}))
server.use(jsonServer.bodyParser)

// Эндпоинт для логина
server.post('/login', (req, res) => {
  try {
    const { username, password } = req.body
    const db = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'db.json'), 'UTF-8'))
    const { users = [] } = db

    const userFromBd = users.find(
      (user) => user.username === username && user.password === password,
    )

    if (userFromBd) {
      return res.json(userFromBd)
    }

    return res.status(403).json({ message: 'User not found' })
  } catch (e) {
    console.log(e)
    return res.status(500).json({ message: e.message })
  }
})

// проверяем, авторизован ли пользователь
// eslint-disable-next-line
server.use((req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(403).json({ message: 'AUTH ERROR' })
  }

  next()
})

server.use(router)


const httpsServer = https.createServer(options, server)

const PORT = 8443
const PORT_HTTP = 8000
// запуск сервера
httpsServer.listen(PORT, () => {
  console.log(`server is running on ${PORT} port`)
})

server.listen(PORT_HTTP, () => {
  console.log(`server is running on ${PORT_HTTP} port`)
})
