class Router {
  constructor () {
    this.getRoutes = {}
    this.postRoutes = {}
  }

  use (url, router) {
    let el
    for (el in router.getRoutes) {
      this.getRoutes[url + el] = router.getRoutes[el]
    }
    for (el in router.postRoutes) {
      this.postRoutes[url + el] = router.postRoutes[el]
    }
  }

  post (url, controller) {
    this.postRoutes[url] = controller
  }

  get (url, controller) {
    this.getRoutes[url] = controller
  }

  route (req, res) {
    var url = req.url.split('?')[0]
    var aux_url=url.split('/')[1] //pentru a vedea daca luam fisiere (statice) din folderul public
    console.log('request at ' + url)
    if (req.method === 'GET') {
      if(aux_url=== 'public')
        try{
          this.getRoutes['/'+aux_url](req,res)
        }
        catch(e){
          console.log(e)
        }
      if (this.getRoutes[url] !== undefined) {
        try {
          this.getRoutes[url](req, res)
        } catch (e) {
          console.log(e)
        }
      }
    }
    if (req.method === 'POST') {
      if (this.postRoutes[url] !== undefined) {
        try {
          this.postRoutes[url](req, res)
        } catch (e) {
          console.log(e)
        }
      }
    }
  }
}

module.exports = { Router }
