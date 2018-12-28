const { ApolloServer, gql } = require('apollo-server')
const { getPlayerInfoById } = require('./service')

// This is a (sample) collection of books we'll be able to query
// the GraphQL server for.  A more complete example might fetch
// from an existing data source like a REST API or database.

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.

const typeDefs = gql`
	# Comments in GraphQL are defined with the hash (#) symbol.

	# This "Book" type can be used in other type declarations.
	# type Book {
	# 	title: String
	# 	author: String
	# }

	type Player {
		id: ID!
		imageUrl: String
		name: String
		number: Int
		position: String
		# career: Career
		# seasons(seasonId: Int): [Season]
	}

	type Career {
		passing: Passing
	}

	type Season {
		season: Int
		passing: Passing
	}

	type Team {
		name: String
		abbreviation: String
	}

	type Passing {
		attempts: Int
		completions: Int
		yards: Int
		touchdowns: Int
		long: Int
		interceptions: Int
		fumbles: Int
	}

	# The "Query" type is the root of all GraphQL queries.
	# (A "Mutation" type will be covered later on.)
	type Query {
		player(id: String!): Player
	}
`

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
	Query: {
		player: (_, { id }) => {
			return getPlayerInfoById(id)
		}
	}
}

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({ typeDefs, resolvers })

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
	console.log(`🚀  Server ready at ${url}`)
})
