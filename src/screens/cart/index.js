import React, { Component } from "react";
import Cart from "./Cart";
import Checkout from "./Checkout";

// import EditScreenOne from "./EditScreenOne.js";
// import EditScreenTwo from "./EditScreenTwo.js";
import { createStackNavigator } from "react-navigation";


// export default (stackNav = StackNavigator(
//   {
//     Menus: { screen: Menus },
//     Menu: { screen: Menu  },
//     // EditScreenOne: { screen: EditScreenOne },
//     // EditScreenTwo: { screen: EditScreenTwo }
//   },
//   {
//     initialRouteName: "Menus"
//   }
// ));

const MenusStack = createStackNavigator({
  Cart: Cart,
  Checkout:Checkout,
});


// MenusStack.navigationOptions = ({ navigation }) => {
//   let tabBarVisible = true;
  
//   if (navigation.state.index >0) {
//     tabBarVisible = false;
//   }

//   return {
//     tabBarVisible,
//   };
// };

export default MenusStack;
