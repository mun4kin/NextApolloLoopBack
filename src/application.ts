import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';

import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';

import {GraphQLBindings, GraphQLComponent} from "@loopback/graphql";

export {ApplicationConfig};

export class MyApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {


    super(options);

    this.component(GraphQLComponent);

    const server = this.getSync(GraphQLBindings.GRAPHQL_SERVER);
    // To register one or more middlewares as per https://typegraphql.com/docs/middlewares.html
    server.middleware((resolverData, next) => {
      // It's invoked for each field resolver, query and mutation operations
      return next();
    });

    this.expressMiddleware('middleware.express.GraphQL', server.expressApp);

    // It's possible to register a graphql context resolver
    this.bind(GraphQLBindings.GRAPHQL_CONTEXT_RESOLVER).to(context => {
      return {...context};
    });

    // this.bind('recipes').to([...sampleRecipes]);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      graphqlResolvers: {
        // Customize ControllerBooter Conventions here
        dirs: ['graphql-resolvers'],
        extensions: ['.js'],
        nested: true,
      },
    };


  }
}
