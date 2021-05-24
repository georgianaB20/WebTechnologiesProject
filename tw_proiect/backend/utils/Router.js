// const userController = require('../controller/user')
// let url_lib = require('url')

class Router {
  constructor() {
    this.getRoutes = {}
    this.postRoutes = {}
    this.putRoutes = {}
    this.deleteRoutes = {}
  }

  use(url, router) {
    let el
    for (el in router.getRoutes) {
      this.getRoutes[url + el] = router.getRoutes[el]
    }
    for (el in router.postRoutes) {
      this.postRoutes[url + el] = router.postRoutes[el]
    }
    for (el in router.putRoutes) {
      this.putRoutes[url + el] = router.putRoutes[el]
    }
    for (el in router.deleteRoutes) {
      this.deleteRoutes[url + el] = router.deleteRoutes[el]
    }
  }

  post(url, controller) {
    this.postRoutes[url] = controller
  }

  get(url, controller) {
    this.getRoutes[url] = controller
  }

  put(url, controller) {
    this.putRoutes[url] = controller
  }

  delete(url, controller) {
    this.deleteRoutes[url] = controller
  }


  async route(req, res) {
    var url = req.url.split('?')[0]
    console.log('request at ' + url)

    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT, DELETE',
      'Access-Control-Allow-Headers': 'content-type, access-control-allow-origin',
      'Access-Control-Max-Age': 2592000, // 30 days
      /** add other headers as per requirement */
    };

    if (req.method === 'OPTIONS') {
      res.writeHead(204, headers);
      res.end();
      return;
    }

    if (req.method === 'GET') { // tratam requesturile GET
      console.log('GET')
      // let url = req.url.split('/')
      // console.log(url)
      // console.log(req.url)

      // var url_parts = url_lib.;
      // var query = url_parts.query;
      // console.log(req.query)

      // if (url[1] == 'recipe') {
      //   this.getRoutes['/' + url[1]](req, res, headers)
      // }
      //console.log(url_lib.parse(req.url))
      if (this.getRoutes[url] !== undefined) {
        try {

          this.getRoutes[url](req, res, headers)
        } catch (e) {
          console.log(e)
        }
      }
    }

    if (req.method === 'POST') { //tratam requesturile POST
      console.log("POST")
      if (this.postRoutes[url] !== undefined) {
        try {
          this.postRoutes[url](req, res, headers)
        } catch (e) {
          console.log(e)
        }
      }
    }

    if (req.method === 'PUT') { //tratam requesturile PUT
      console.log("PUT")
      if (this.putRoutes[url] !== undefined) {
        try {
          this.putRoutes[url](req, res, headers)
        } catch (e) {
          console.log(e)
        }
      }
    }

    if (req.method === 'DELETE') { //tratam requesturile POST
      console.log("DELETE")
      if (this.deleteRoutes[url] !== undefined) {
        try {
          this.deleteRoutes[url](req, res, headers)
        } catch (e) {
          console.log(e)
        }
      }
    }

  }
}

module.exports = { Router }
