const { ApolloServer, gql } = require('apollo-server');
const typeDefs = gql`
  type Book {
    title: String
    author: String
  }

  type Query {
    books: [Book]
    longestRaisingSequence: [Int!]!
  }

  type Mutation {
    setArray(array: [Int!]!): [Int!]!
  }
`;

const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
  },
];

let dataArray = [];
const lenArray = [];

const resolvers = {
  Query: {
    books: () => books,
    longestRaisingSequence: () => {
      return getLongestRaisingSequence();
    },
  },
  Mutation: {
    setArray: (_, { array }) => {
      dataArray = array;
      array.map((value, index) => {
        lenArray[index] = 1;
        for (let i = 0; i < index; i++) {
          if (array[i] < value && lenArray[i] + 1 > lenArray[index]) {
            lenArray[index] = lenArray[i] + 1;
          }
        }
      });
      return array;
    },
  },
};

const getLongestRaisingSequence = () => {
  let curIndex = lenArray.indexOf(Math.max(...lenArray));
  const longestChain = [];
  length = lenArray[curIndex];
  while (true) {
    longestChain.push(dataArray[curIndex]);
    if (lenArray[curIndex] === 1) {
      break;
    }
    curIndex = lenArray.findIndex(
      (len, index) => len === lenArray[curIndex] - 1 && dataArray[index] < dataArray[curIndex],
    );
  }
  return longestChain.reverse();
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(` Server ready at ${url}`);
});
