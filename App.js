import React, { Component } from "react";
import { AsyncStorage} from 'react-native';
import Home from "./src/screens/Home";
import Menus from "./src/screens/menus/index";

import Cart from "./src/screens/cart/index";
import store from './store';

//import Ionicons from 'react-native-vector-icons/Ionicons';
import View from "react-native";
import { createBottomTabNavigator, BottomTabBar } from 'react-navigation-tabs';


import {
  Button,
  Text,
  Icon,
  Item,
  Footer,
  FooterTab,
  Label,
  Content,
  Badge
} from "native-base";



let self


function handle(){
    
    if(self && self.state.isMounted){
        self.setState({cartSize:store.getState().cartSize})
    } 
}
store.subscribe(handle)



class TabsComponent extends Component {
    
    
    constructor(props){
      super(props)
      self = this
      this.state = {cartSize:store.getState().cartSize,isMounted:false}
     
      //console.log("CONSTRUCTOR")

    } 
    componentDidMount(){
      this.setState({isMounted:true})
      
    }
    componentWillUnmount(){
       this.setState({isMounted:false})
    }
   

    render() {
      
      
    return (
       <Footer>
            <FooterTab {...this.props}> 
            <Button
              vertical
              active={this.props.navigation.state.index === 0}
              //onPress={() => console.log(this.props.navigation)}
              onPress={() => this.props.navigation.navigate("Home")}
            >
              <Icon name="home" />
              <Text>Home</Text>
            </Button>
            <Button
              vertical
              active={this.props.navigation.state.index === 1}
              onPress={() => this.props.navigation.navigate("Menus")}
            >
              <Icon name="book" />
              <Text>Menus</Text>
            </Button>
            <Button
              badge
              vertical
              active={this.props.navigation.state.index === 2}
              onPress={() => this.props.navigation.navigate("Cart")}
            >
            <Badge><Text>{this.state.cartSize}</Text></Badge>
            <Icon name="cart" />
            <Text>Cart</Text>
          </Button>
          </FooterTab>
        </Footer>
    );
  }

}

/*
const CustomTabBarComponent = (props) => (

              <Footer>
                <FooterTab {...props}> 
                <Button
                  vertical
                  active={props.navigation.state.index === 0}
                  //onPress={() => console.log(props.navigation)}
                  onPress={() => props.navigation.navigate("Home")}
                >
                  <Icon name="home" />
                  <Text>Home</Text>
                </Button>
                <Button
                  vertical
                  active={props.navigation.state.index === 1}
                  onPress={() => props.navigation.navigate("Menus")}
                >
                  <Icon name="book" />
                  <Text>Menus</Text>
                </Button>
                <Button
                  badge
                  vertical
                  active={props.navigation.state.index === 2}
                  onPress={() => props.navigation.navigate("Cart")}
                >
                <Badge><Text>{0}</Text></Badge>
                <Icon name="cart" />
                <Text>Cart</Text>
              </Button>
              </FooterTab>
            </Footer>);*/

            

import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);



export default (MainScreenNavigator = createBottomTabNavigator(
  {
    Home: { screen: Home},
    // Menus: { screen: props => <Menus {...props} /> },
    Menus: {screen: Menus},
    Cart: { screen: Cart },

  },

  {
    initialRouteName:'Home',
    navigationOptions: ({ navigation }) => ({
      
      
      tabBarComponent: props =>
      <TabsComponent
        {...props} 
      />,
  
    }),

  }
  
));
