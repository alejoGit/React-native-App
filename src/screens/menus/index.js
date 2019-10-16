import React, { Component } from "react";
import Menus from "./Menus";
import Menu from "./Menu";
import Category from "./Category";
import Product from "./Product";
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
  Menus: Menus,
  Menu: Menu,
  Category: Category,
  Product: Product,
});


MenusStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  
  // if (navigation.state.index >2) {
  //   tabBarVisible = false;
  // }

  return {
    tabBarVisible,
  };
};

export default MenusStack;
