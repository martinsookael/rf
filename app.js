
var http = require('http')
  , glob = require('glob')
  , _ = require('lodash')
  , fs = require('fs')
  , path = require('path')
  , port = 5001

// COLLECT FRONT END DEPENCENCIES TO STRING deps
var deps = ''
var dependencies = [
  '/js/lib/navigo.min.js',
  '/js/lib/vue.min.js'
]
_.each(dependencies, function (oneDep) {
  deps = deps + '<script src="' + oneDep + '"></script>\n'
})
// COLLECTS ADDRESSES OF ALL HTML FILES IN FOLDER './vues' TO ARRAY vues
var vues = []
glob('vues/*.html', function (err, files) {
  if (err) return console.log(err)
  vues = files
})
// COLLECT ADRESSES OF FILES IN PUBLIC FOLDER TO ARRAY publicFolder
var publicFolder = []
glob('public/**/*', function (err, publicFiles) {
  if (err) return console.log(err)
  publicFolder = publicFiles
})

// HANDLE ALL INCOMING REQUESTS
function handleServer (req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Request-Method', '*')
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token, X-Requested-With, Authorization')
  // ANSWER PREFLIGHT REQUESTS
  if (req.method === 'OPTIONS') {
    res.writeHead(200)
    res.end()
  }
  // HANDLE ALL GET REQUESTS
  if (req.method === 'GET') {
    var url = 'public' + req.url
    if (publicFolder.indexOf(url) > -1) {
      // HANDLE PUBLIC FOLDER CONTENTS
      res.writeHead(200)
      fs.createReadStream(url).pipe(res)
    } else if (req.url === '/') {
      // HANDLE MAIN INDEX.HTML
      var html = `
        <html>
          <head>
            ` + deps + `
            <script>
              var v = {}
              var router = new Navigo(null, true)
              router.hooks({
                before: function(done) {
                  // hide everything before every routing
                  for (var key in v) {
                    if (v.hasOwnProperty(key) && v[key].show) {
                      v[key].show = false
                    }
                  }
                  done()
                }
              })
              // handle 404
              router.notFound(function () {
                v.fourofour.show = true
              })
            </script>
          </head>
        <body>
          <a href='#'>hello</a> | <a href='#/world'>world</a> | <a href='#/404'>404</a>
        `
        // INCLUDE CONTENTS FROM FILES IN FOLDER 'vues' TO html
      _.each(vues, function (oneVue) {
        fs.readFile(oneVue, 'utf8', function (err, thisHTML) {
          if (err) {
            console.log(err)
          } else {
            html = html + thisHTML
          }
        })
      })
      // WAIT 100 MS, PRINT THE FOOTER OF PAGE AND RESPOND
      setTimeout(function () {
        res.writeHead(200)
        html = html +
          `<script>
              router.resolve()
            </script>
          </body>
        </html>`
        res.write(html)
        res.end()
      }, 10)
    } else {
      // HANDLE SERVER SIDE 404
      res.writeHead(404)
      res.write('not found - 404')
      res.end()
    }
  } else {
    res.writeHead(501)
    res.write('not implemented - 501')
    res.end()
  }
}

var server = http.createServer(function (req, res) {
  handleServer(req, res)
})

server.listen(port, function () {
  console.log('go to http://localhost:' + port)
})
