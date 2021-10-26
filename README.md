# place-api-node.js

## Fully Functional BackEnd Api made using node.js

Background of Api Creation:
---------------
1. Mongodb is used as the database
2. mongoose is used as the ORM
3. Data was inserted via Postman
4. Api is deployed on Heroku
5. Api Endpoint: https://ahmadfaiz-place-api-v2-2021.herokuapp.com/api


Functionality
---------------------
1. This api contains small information about places and some people reviews
2. All CRUD functionality is available
3. To get all places available from the api:
run get a request to https://ahmadfaiz-place-api-v2-2021.herokuapp.com/api/places
4. To post a place to the api:
run a post request with a json body with the example format:
{
    "name": "Selangor",
    "description": "Fun place",
    "country": "Malaysia",
    "categories": ["relax"],
    "imageUrl": "http://static.asiawebdirect.com/m/kl/portals/malaysia-hotels-net/homepage/selangor/pagePropertiesImage/selangor.jpg"
}
4. To update a place in the api:
you need to get the id of the place first before you can update the api. This can be found by getting all the places (no. 3) and
finding id_number of the place. then run a put request to https://ahmadfaiz-place-api-v2-2021.herokuapp.com/api/places/id_number
5. To delete a place in the api:
get the id_number first and run a delete request to  https://ahmadfaiz-place-api-v2-2021.herokuapp.com/api/places/id_number
