import React, { useState } from "react";
import PropTypes from "prop-types";

/* import:: Router */
import { Route, Switch } from "react-router-dom";

/* import:: Page  */
// Landing Page
import WelcomePage from "./WelcomePage";
// Article Page
import ArticlePage from "./ArticlePage";
import SectionPage from "./SectionPage";
// Professors Page
import Professors from "./Professors";
import ProfessorPage from "./ProfessorPage";
// Info Page
import AboutPage from "./AboutPage";
// error pages
import Error404Page from "./errors/404";

/* import:: Layout  */
import Content from "./layout/content";
import MobileProvider from "./layout/mobileProvider";
import Loading from "../components/Loading/LoadingCircleAnimation";

/* import:: SearchBox provider   */
import SearchBarProvider from "../components/navBar/elements/SearchBarProvider";

/* import:: Components  */
// nav components
import NavBar from "../components/navBar/navBar";
import SideBar from "../components/sideBar/sideBar";

/* import:: fetch Data function */
import useFetch from "../hooks/FetchData";

/* import:: CONFIG */
import {
  DEFAULT_ARTICLE_ROUTE_NAME as ARTICLE_ROUTE,
  DEFAULT_PROFESSORS_ROUTE_NAME as PROFESSOR_ROUTE
} from "../Config/routeName";

const MainPage = ({ match }) => {
  const [displaySidebar, _setDisplaySidebar] = useState(true);
  const [data, loading] = useFetch(
    `/api/departments/${match.params.department}`
  );

  return loading ? (
    <Loading />
  ) : (
    <>
      {data.exist ? (
        <MobileProvider>
          <SearchBarProvider>
            <Route
              path={`${match.path}`}
              render={routeProps => (
                <NavBar
                  {...routeProps}
                  displaySidebar={displaySidebar}
                  toggleSidebarEvent={e => _setDisplaySidebar(!displaySidebar)}
                />
              )}
            />
            <Route
              path={`${match.path}`}
              render={routeProps => (
                <SideBar {...routeProps} toggleSidebar={displaySidebar} />
              )}
            />
          </SearchBarProvider>
          <Content>
            <Switch>
              <Route exact path={`${match.path}`} component={WelcomePage} />
              <Route exact path={`${match.path}/About`} component={AboutPage} />
              <Route
                exact
                path={`${match.path}/${ARTICLE_ROUTE}`}
                component={WelcomePage}
              />
              <Route
                exact
                path={`${match.path}/${ARTICLE_ROUTE}/:section`}
                component={SectionPage}
              />
              <Route
                exact
                path={`${match.path}/${ARTICLE_ROUTE}/:section//:lesson`}
                component={ArticlePage}
              />
              <Route
                exact
                path={`${match.path}/${ARTICLE_ROUTE}/:section/:course`}
                component={SectionPage}
              />
              <Route
                exact
                path={`${match.path}/${ARTICLE_ROUTE}/:section/:course/:lesson`}
                component={ArticlePage}
              />
              <Route
                exact
                path={`${match.path}/${PROFESSOR_ROUTE}`}
                component={Professors}
              />
              <Route
                exact
                path={`${match.path}/${PROFESSOR_ROUTE}/:name`}
                component={ProfessorPage}
              />
              <Route path="*" component={Error404Page} />
            </Switch>
          </Content>
        </MobileProvider>
      ) : (
        <Error404Page />
      )}
    </>
  );
};

MainPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.object.isRequired,
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }).isRequired
};

export default MainPage;
