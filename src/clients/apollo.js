import { ApolloClient, InMemoryCache } from '@apollo/client'

export const apolloClient = new ApolloClient({
  uri: 'https://api-sa-east-1.graphcms.com/v2/cl23yxl535uf001xu9j0z7eyh/master',
  cache: new InMemoryCache(),
})
