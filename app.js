
var http = require('http')
  , glob = require('glob')
  , _ = require('lodash')
  , fs = require('fs')
  , port = 5001
  , vues = []
  , html = '<html><body>'

// collect location of all '.html' files in folder ./vues
glob('vues/*.html', function (err, files) {
  if (err) return console.log(err)
  vues = files
})

// HTML header
var header = `
  <html>
    <head>
      <script src="//unpkg.com/navigo@6"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.16/vue.min.js"></script>

      <script>
        var router = new Navigo(null, true)
        router.hooks({
          before: function(done) {
            // hide everything before every routing
            world.show = false
            hello.show = false
            fourofour.show = false
            done()
          }
        })
        // handle 404
        router.notFound(function () {
          fourofour.show = true
        })
      </script>
    </head>
  <body>
  <a href='#'>hello</a> | <a href='#/world'>world</a> | <a href='#/404'>404</a>
`

// Handle all incoming requests
function handleServer (req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Request-Method', '*')
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token, X-Requested-With, Authorization')
  // PREFLIGHT
  if (req.method === 'OPTIONS') {
    res.writeHead(200)
    res.end()
  }
  // ALL INCOMING GET REQUESTS, also the favicon 😠
  if (req.method === 'GET') {
    var html2 = header
    _.each(vues, function (oneVue) {
      fs.readFile(oneVue, 'utf8', function (err, thisHTML) {
        if (err) {
          console.log(err)
        } else {
          html2 = html2 + thisHTML
        }
      })
    })
    setTimeout(function () {
      res.writeHead(200)
      html2 = html2 +
        `<script>
            router.resolve()
          </script>
        </body>
      </html>`
      res.write(html2)
      res.end()
    }, 100)
  }
}

var server = http.createServer(function (req, res) {
  handleServer(req, res)
})

server.listen(port, function () {
  console.log('go to http://localhost:' + port)
});
