import React, { Component } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Menu from "./customerComponents/menu";
import CProtectedRoute from "./customerComponents/cProtectedRoute";
import VProtectedRoute from "./vendorComponents/vProtectedRoute";
import LoginPage from "./customerComponents/loginPage";
import RegisterPage from "./customerComponents/registerPage";
import NotFound from "./customerComponents/notFound";
import Logout from "./customerComponents/logout";
import customerErrorPage from "./customerComponents/customerErrorPage";
import Index from "./customerComponents/index";
import ShoppingCart from "./customerComponents/shoppingCart";
import auth from "./services/authService";
import { getProducts } from "./services/productService";
import PreviousOrdersPage from "./customerComponents/previousOrdersPage";
import ActiveOrdersPage from "./customerComponents/activeOrdersPage";
import TrackOrderPage from "./customerComponents/trackOrderPage";
import ProfilePage from "./customerComponents/profilePage";
import SelectVendorPage from "./customerComponents/selectVendorPage";
import VendorLoginPage from "./vendorComponents/vendorLoginPage";
import VendorRegisterPage from "./vendorComponents/vendorRegisterPage";
import SetLocationPage from "./vendorComponents/setLocationPage";
import PickUpOrdersPage from "./vendorComponents/pickUpOrdersPage";
import VendorActOrdersPage from "./vendorComponents/vendorActOrdersPage";
import VendorAwtOrdersPage from "./vendorComponents/vendorAwtOrdersPage";
import VendorLogout from "./vendorComponents/vendorLogout";
import VendorProfilePage from "./vendorComponents/vendorProfilePage";
import VendorPreviousOrdersPage from "./vendorComponents/vendorPreviousOrdersPage";
import vendorErrorPage from "./vendorComponents/vendorErrorPage";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

class App extends Component {
  state = {
    allProducts: [],
    cartItems: [],
  };

  async componentDidMount() {
    /* get user from jwt stored in the local storage */
    const user = auth.getCurrentUser();
    this.setState({ user });

    const { data } = await getProducts();
    this.setState({ allProducts: data });
  }

  handleAdd = (productName, price) => {
    if (price === 0) return toast.warning("Please select a product.");

    const product = this.state.allProducts.filter(
      (product) => product.productName === productName
    );

    const size = this.getSizeByValue(product, price);

    const orderItemId = productName + price;

    const exist = this.state.cartItems.find((x) => x.id === orderItemId);
    if (exist) {
      const updatedCartItems = this.state.cartItems.filter(
        (x) => x.id !== orderItemId
      );
      this.setState({
        cartItems: [...updatedCartItems, { ...exist, qty: exist.qty + 1 }],
      });
    } else {
      this.setState({
        cartItems: [
          ...this.state.cartItems,
          {
            id: orderItemId,
            productName: productName,
            size: size,
            img100: product[0].img100,
            img50: product[0].img50,
            price: price,
            qty: 1,
          },
        ],
      });
    }
  };

  handleRemove = (productName, price) => {
    const product = this.state.allProducts.filter(
      (product) => product.productName === productName
    );

    const size = this.getSizeByValue(product, price);

    const orderItemId = productName + price;

    const exist = this.state.cartItems.find((x) => x.id === orderItemId);
    if (exist) {
      const updatedCartItems = this.state.cartItems.filter(
        (x) => x.id !== orderItemId
      );
      if (exist.qty === 1) {
        this.setState({ cartItems: [...updatedCartItems] });
      } else {
        this.setState({
          cartItems: [...updatedCartItems, { ...exist, qty: exist.qty - 1 }],
        });
      }
    } else {
      this.setState({
        cartItems: [
          ...this.state.cartItems,
          {
            id: orderItemId,
            productName: productName,
            size: size,
            img100: product[0].img100,
            img50: product[0].img50,
            price: price,
            qty: 1,
          },
        ],
      });
    }
  };

  getSizeByValue = (product, price) => {
    const prices = product[0].prices;
    return Object.keys(prices).find((key) => prices[key] == price);
  };

  handleCheckOut = (history) => {
    if (!this.state.user) alert("You are not logged in.");
    this.syncCart();
    console.log(history);
    // go to checkout page
  };

  handleReset = () => {
    this.setState({ cartItems: [] });
  };

  syncCart = () => {
    localStorage.setItem("cart", JSON.stringify(this.state.cartItems));
  };

  render() {
    this.syncCart();
    const { allProducts, cartItems } = this.state;

    return (
      <React.Fragment>
        <ToastContainer autoClose={3000} />
        <Switch>
          <Route
            path="/customer/menu"
            render={(props) => (
              <Menu
                onAdd={this.handleAdd}
                onCheckOut={this.handleCheckOut}
                onReset={this.handleReset}
                cartItems={cartItems}
                products={allProducts}
                user={this.state.user}
                {...props}
              />
            )}
          />
          <CProtectedRoute
            path="/customer/checkout"
            render={(props) => (
              <ShoppingCart
                onAdd={this.handleAdd}
                onRemove={this.handleRemove}
                user={this.state.user}
                {...props}
              />
            )}
          />
          <Route
            path="/customer/login"
            render={(props) => <LoginPage user={this.state.user} {...props} />}
          />
          <Route
            path="/customer/register"
            render={(props) => (
              <RegisterPage user={this.state.user} {...props} />
            )}
          />
          <Route path="/customer/select-vendor" component={SelectVendorPage} />
          <Route path="/customer/logout" component={Logout} />
          <Route path="/vendor/logout" component={VendorLogout} />
          <Route path="/error-customer" component={customerErrorPage} />
          <Route path="/error-vendor" component={vendorErrorPage} />
          <CProtectedRoute
            path="/customer/profile"
            render={(props) => (
              <ProfilePage user={this.state.user} {...props} />
            )}
          />
          <VProtectedRoute
            path="/vendor/profile"
            render={(props) => (
              <VendorProfilePage user={this.state.user} {...props} />
            )}
          />
          <CProtectedRoute
            path="/customer/previous-orders"
            render={(props) => (
              <PreviousOrdersPage user={this.state.user} {...props} />
            )}
          />
          <CProtectedRoute
            path="/customer/active-orders"
            render={(props) => (
              <ActiveOrdersPage user={this.state.user} {...props} />
            )}
          />
          <CProtectedRoute
            path="/customer/tracking-order"
            render={(props) => (
              <TrackOrderPage user={this.state.user} {...props} />
            )}
          />
          <Route path="/vendor/login" component={VendorLoginPage} />
          <Route path="/vendor/register" component={VendorRegisterPage} />
          <VProtectedRoute
            path="/vendor/await-pickup"
            render={(props) => (
              <PickUpOrdersPage user={this.state.user} {...props} />
            )}
          />
          <VProtectedRoute
            path="/vendor/set-location"
            render={(props) => (
              <SetLocationPage user={this.state.user} {...props} />
            )}
          />
          <VProtectedRoute
            path="/vendor/active-orders"
            render={(props) => (
              <VendorActOrdersPage user={this.state.user} {...props} />
            )}
          />
          <VProtectedRoute
            path="/vendor/await-orders"
            render={(props) => (
              <VendorAwtOrdersPage user={this.state.user} {...props} />
            )}
          />
          <VProtectedRoute
            path="/vendor/previous-orders"
            render={(props) => (
              <VendorPreviousOrdersPage user={this.state.user} {...props} />
            )}
          />
          <Route path="/not-found" component={NotFound} />
          <Route path="/" exact component={Index} />
          <Redirect to="/not-found" />
        </Switch>
      </React.Fragment>
    );
  }
}

export default App;
