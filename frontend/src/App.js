import NavbarForNotLoggedUser from "./components/navbars/NavbarForNotLoggedUser";
import NavbarForLoggedUser from "./components/navbars/NavbarForLoggedUser";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegistrationForm from "./components/authentication/RegistrationForm";
import LoginForm from "./components/authentication/LoginForm";
import Footer from "./components/Footer";
import Home from "./components/Home";
import UserProfile from "./components/UserProfile/UserProfile";
import About from "./components/About";
import ExploreCollections from "./components/collections/ExploreCollections";
import CollectionDetails from "./components/collections/CollectionDetails";
import ExploreCollectionDetails from "./components/collections/ExploreCollectionDetails";
import ExploreProfile from "./components/UserProfile/ExploreUserProfile";

function App() {
  if (localStorage.getItem("token") == null) {
    return (
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <NavbarForNotLoggedUser />
                <main>
                  <Home />
                </main>
                <Footer />
              </>
            }
          ></Route>

          <Route
            path="/home"
            element={
              <>
                <NavbarForNotLoggedUser />
                <main>
                  <Home />
                </main>
                <Footer />
              </>
            }
          ></Route>

          <Route
            path="/samples"
            element={
              <>
                <NavbarForNotLoggedUser />
              </>
            }
          ></Route>

          <Route
            path="/about"
            element={
              <>
                <NavbarForNotLoggedUser />
                <main>
                  <About />
                </main>
                <Footer />
              </>
            }
          ></Route>

          <Route
            path="/login"
            element={
              <>
                <NavbarForNotLoggedUser />
                <main>
                  <LoginForm />
                </main>
                <Footer />
              </>
            }
          ></Route>

          <Route
            path="/register"
            element={
              <>
                <NavbarForNotLoggedUser />
                <main>
                  <RegistrationForm />
                </main>
                <Footer />
              </>
            }
          ></Route>
        </Routes>
      </Router>
    );
  } else {
    return (
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <NavbarForLoggedUser />
                <main>
                  <Home />
                </main>
                <Footer />
              </>
            }
          ></Route>

          <Route
            path="/home"
            element={
              <>
                <NavbarForLoggedUser />
                <main>
                  <Home />
                </main>
                <Footer />
              </>
            }
          ></Route>

          <Route
            path="/exploreCollections"
            element={
              <>
                <NavbarForLoggedUser />
                <main>
                  <ExploreCollections />
                </main>
                <Footer />
              </>
            }
          ></Route>

          <Route
            path="/collection/:id"
            element={
              <>
                <NavbarForLoggedUser />
                <main>
                  <CollectionDetails />
                </main>
                <Footer />
              </>
            }
          ></Route>

          <Route
            path="/exploreCollection/:id"
            element={
              <>
                <NavbarForLoggedUser />
                <main>
                  <ExploreCollectionDetails />
                </main>
                <Footer />
              </>
            }
          ></Route>

          <Route
            path="/exploreUserProfile/:email"
            element={
              <>
                <NavbarForLoggedUser />
                <main>
                  <ExploreProfile />
                </main>
                <Footer />
              </>
            }
          ></Route>
          <Route
            path="/user/:activepage"
            element={
              <>
                <main>
                  <UserProfile />
                </main>
              </>
            }
          ></Route>
        </Routes>
      </Router>
    );
  }
}

export default App;
