import ReactDOM from "react-dom/client";
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  // ApolloProvider,
} from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { setContext } from "@apollo/client/link/context";
import { AuthProvider } from "./Context/AuthContext";
import App from "./App";

// HTTP link to GraphQL
const httpLink = createHttpLink({
  // uri: "http://localhost:6380/graphql",
  uri: "https://freshmart-backend-b73r.onrender.com/graphql",
});

// Add auth token to headers
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "no-cache",
      errorPolicy: "ignore",
    },
    query: {
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    },
    mutate: {
      errorPolicy: "all",
    },
  },
});


const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ApolloProvider client={client}>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </ApolloProvider>
);
