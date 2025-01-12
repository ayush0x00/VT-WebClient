import { useContext, Suspense, lazy } from "react";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import ErrorBoundary from "./Components/ErrorBoundary";
import { AuthContext } from "./Context/Contexts/AuthContext";
import Download  from './Components/Screens/Download';
import Authenticate from './Components/Screens/Authentication';
import { Loading } from "./Components/Loading";

const HomePage = lazy(() => import('./Components/Screens/Homepage'));
const Dashboard = lazy(() => import('./Components/Screens/Dashboard'));
const Files = lazy(() => import('./Components/Screens/Files'));
const FileDetail = lazy(() => import('./Components/Screens/FileDetail'));
const Profile = lazy(() => import('./Components/Screens/Profile'));
const About = lazy(() => import('./Components/Screens/About'));



const Routing = () => {
  const history = useHistory();
  const { authState } = useContext(AuthContext);
  const auth = JSON.parse(localStorage.getItem("auth"));
  if (!auth) {
    if(history.location.pathname.includes("/files") || history.location.pathname == "/profile" || history.location.pathname == "/dashboard"){
      history.push("/");
    }
  }
  else if(auth){
    if(history.location.pathname == "/authenticate"){
      history.push("/dashboard");
    }
  }
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading/>}>
        {authState.auth.PK ? (
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/files" component={Files} />
            <Route exact path="/file/:fileId" component={FileDetail} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/about" component={About} />
            <Route exact path="/:urlId" component={Download}/>
            <Route>
              <Redirect to="/" /> <HomePage />
            </Route>
          </Switch>
        ) : (
          <Switch>
            <Route exact path="/about" component={About} />
            <Route exact path="/authenticate" component={Authenticate}/>
            <Route exact path="/:urlId" component={Download}/>
            <Route exact path="/" component={HomePage} />
          </Switch>
        )}
      </Suspense>
    </ErrorBoundary>
  );
};
export default Routing;