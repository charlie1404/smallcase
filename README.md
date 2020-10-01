# Smallcase virtual trading

# API Documentation

Added open API file for the API docs, these can be either browsed at the pre-hosted link at [charlie1404.stoplight.io](https://charlie1404.stoplight.io/docs/smallcase/reference/v1.json) or copypasting file content at [Swagger Editor](https://editor.swagger.io/)

## Running locally

To set up the project locally, run the following in your terminal:

```sh
$ git clone https://github.com/charlie1404/smallcase.git
$ cd smallcase
$ cp env.sample .env
$ # populate .env
$ yarn install
$ yarn start
```

## Running Production

PM2 is the choice for node process manager and Nginx as a reverse proxy.
As of now hosted on bare ec2, but in production, beanstalk would be a rather better choice.

- [PM2 config file](ecosystem.config.js)
- [Nginx enabled site file](site.conf)

## Approach

### TechStack

- NodeJs as a programming language
- Express for routing framework
- MongoDB as DB engine
- Mongoose as ODM

### Important mentions

As logic was not very complex, did not make statics on models and that logic resides in route handlers only, but if complexity grows it should ideally move into models.

Most of the files are having comments to explain why and why not !!. Not added in here because; the closer the info to logic the more clarity it provides.

In the current implementation, I have kept trades as events, and portfolio as its aggregated snapshot.
