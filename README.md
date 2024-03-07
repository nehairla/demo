# CUPCAKE API

## How to run this project

- Build the image
`docker build -t my_bakery .`

- Run the container (uses ports 3000 for HTTP and 3001 for HTTPS by default)
`docker run -p 127.0.0.1:3000:3000 -p 127.0.0.1:3001:3001 -it my_bakery`

- HTTP server: `http://localhost:3000`
- HTTPS server: `https://localhost:3001`
- You may choose different ports by specifying env vars HTTP_PORT and HTTPS_PORT via `-e` flag for `docker run`

## How to use the API
Following are some examples with curl command. For more details please check the tests.

### HTTP

`curl -H 'Content-Type: application/json'
      -d '{ "name":"cupcake1", "price": 5, "description": "Some desc", "ingredients": ["a", "b", "c"]}'
      -X POST
      http://localhost:3000/v2/cupcake`

Example output: `{"cupcakeId":637899604126}`

`curl -H 'Content-Type: application/json' -X GET http://localhost:3000/v2/cupcake`

Example output: `[{"name":"cupcake1","price":5,"description":"Some desc","ingredients":["a","b","c"],"id":637899604126}]`

`curl -H 'Content-Type: application/json'
       -d '{ "price": 5, "description": "Some desc", "ingredients": ["a", "b", "c"]}'
       -X POST http://localhost:3000/v2/cupcake`

Example output: `{"message":["cupcake name cannot be empty and must be string"]}`

`curl -H 'Content-Type: application/json' -X GET http://localhost:3000/v2/cupcake/637899604126`

Example output: `{"name":"cupcake1","price":5,"description":"Some desc","ingredients":["a","b","c"],"id":637899604126}`

### HTTPS

Easiest way to run is with `--insecure` flag with `curl`

E.g.
`curl -H 'Content-Type: application/json' -X GET https://localhost:3001/v2/cupcake/637899604126 --insecure`

Or you could use `--cacert` option but you will have to download the `selfsigned.crt` from 
the container to your laptop.

## Implementation
This implementation is for demo purposes only. The main purpose is to show how one
would go about implementing REST API with the NodeJS ecosystem with Typescript as 
programming language.

The repository is not meant for production use and a local file is used instead for 
ease of implementation. 

The developer is quite aware that the usage of synchronous file API and storing data in
files will not work in real life. It is meant for this project only.