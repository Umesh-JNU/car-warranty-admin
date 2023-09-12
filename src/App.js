import { useContext, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Store } from "./states/store";

import { AdminProtectedRoute, SaleProtectedRoute, UnprotectedRoute } from "./routes";
import { Header, Footer, SideNavBar, NotFound } from "./components";
import { AdminLoginScreen, Dashboard, Users, ViewUser, Warranty, ViewWarranty, SalePerson, AddSalePerson, ViewSalePerson, Transactions, ViewTransaction, Enquiry, AddEnquiry, ViewEnquiry } from "./pages";

function App() {
  const { state } = useContext(Store);
  const { token } = state;

  const pageLocation = useLocation();

  const [isExpanded, setExpandState] = useState(window.innerWidth > 768);
  const sidebarHandler = () => setExpandState((prev) => !prev);

  const routeList = [
    { path: "/admin/dashboard", comp: <Dashboard /> },
    { path: "/admin/users", comp: <Users /> },
    { path: "/admin/view/user/:id", comp: <ViewUser /> },
    { path: "/admin/warranty", comp: <Warranty /> },
    { path: "/admin/view/warranty/:id", comp: <ViewWarranty /> },
    { path: "/admin/sale-person", comp: <SalePerson /> },
    { path: "/admin/sale-person/create", comp: <AddSalePerson /> },
    { path: "/admin/view/sale-person/:id", comp: <ViewSalePerson /> },
    { path: "/admin/transactions", comp: <Transactions /> },
    { path: "/admin/view/transaction/:id", comp: <ViewTransaction /> },
    { path: "/admin/enquiry", comp: <Enquiry /> },
    { path: "/admin/enquiry/create", comp: <AddEnquiry /> },
    { path: "/admin/view/enquiry/:id", comp: <ViewEnquiry /> }
  ];

  const salePersonRouteList = [
    { path: "/sale-person/dashboard", comp: <Dashboard /> },
    { path: "/sale-person/tasks", comp: <Warranty /> },
    { path: "/sale-person/view/task/:id", comp: <ViewWarranty /> },
  ];

  return (
    <div className="main-wrapper">
      {isExpanded && token && (
        <div className="sidebar-overlay" onClick={sidebarHandler}></div>
      )}
      <div className="sidebar-wrapper">
        <SideNavBar isExpanded={isExpanded} />
      </div>
      <div
        className={`body-wrapper ${isExpanded ? "mini-body" : "full-body"}
        ${token ? "" : "m-0"} d-flex flex-column`}
      >
        <Header sidebarHandler={sidebarHandler} />
        <Routes location={pageLocation} key={pageLocation.pathname}>
          <Route
            path="/"
            element={
              <UnprotectedRoute>
                <AdminLoginScreen />
              </UnprotectedRoute>
            }
          />

          {routeList.map(({ path, comp }) => (
            <Route
              key={path}
              path={path}
              element={<AdminProtectedRoute>{comp}</AdminProtectedRoute>}
            />
          ))}

          {salePersonRouteList.map(({ path, comp }) => (
            <Route
              key={path}
              path={path}
              element={<SaleProtectedRoute>{comp}</SaleProtectedRoute>}
            />
          ))}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </div>
  );
}

export default App;
