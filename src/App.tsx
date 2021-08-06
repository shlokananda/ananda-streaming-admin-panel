// routes
import Router from "./routes";
// theme
import ThemeConfig from "./theme";
// hooks
import useAuth from "./hooks/useAuth";
// components
import Settings from "./components/settings";
import RtlLayout from "./components/RtlLayout";
import ScrollToTop from "./components/ScrollToTop";
import LoadingScreen from "./components/LoadingScreen";
import GoogleAnalytics from "./components/GoogleAnalytics";
import NotistackProvider from "./components/NotistackProvider";
import ThemePrimaryColor from "./components/ThemePrimaryColor";
// Graphql
import { ApolloProvider } from "@apollo/react-hooks";
import { ApolloClient, InMemoryCache } from "@apollo/client";
const client = new ApolloClient({
  uri: "http://localhost:8080/graphql",
  cache: new InMemoryCache(),
});
// ----------------------------------------------------------------------

export default function App() {
  const { isInitialized } = useAuth();
  return (
    <ApolloProvider client={client}>
      <ThemeConfig>
        <ThemePrimaryColor>
          <RtlLayout>
            <NotistackProvider>
              {/* <Settings /> */}
              <ScrollToTop />
              <GoogleAnalytics />
              {isInitialized ? <Router /> : <LoadingScreen />}
            </NotistackProvider>
          </RtlLayout>
        </ThemePrimaryColor>
      </ThemeConfig>
    </ApolloProvider>
  );
}
