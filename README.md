# Public GraphQL API for TravelFeed

Get your API key [in your TravelFeed Dashboard](https://travelfeed.io/dashboard) and use the API on https://api.travelfeed.io/graphql/. Send then API key as Authorization header.

You can find a GraphQL playground at https://api.travelfeed.io/graphql and explore the schema.

This readonly API is limited to retrieving your own posts.

# Deploy it yourself

This API is using serverless for deployment on AWS lambda. If you would like to run it yourself, configure a `.env` file with a MONGO_URL variable to your database and run `npm run dev` to start the development server. Deploy to AWS with `npm run deploy`.

You can set different environment variables by using `.env.development` and `.env.production` files. Remember to set `NODE_ENV=production` in the production environment configruation if you would like to have playground working in your deployment.
