import React, { Component } from 'react';
import {  View, StyleSheet, Image, Alert, AsyncStorage} from 'react-native';
import { Container, Header, Content, List, ListItem, Text, Left, Right, Icon, Body, Title } from 'native-base';

export default class Cart extends Component {
    constructor(props) {
       super(props);     
      this._getCart();
      
    }
   
    _getCart = async () => {
      try {
        const cartAux = await AsyncStorage.getItem('GOFUU_CART');
        console.log(cartAux)
      
        if (cartAux !== null) {
          // We have data!!
         
          this.cart = JSON.parse(cartAux);

          return cartAux;
        }
       } catch (error) {
         console.log("error" + error)
       }
    }

    render() {
    return (
        <Container>
            <Header>
              <Left/>
              <Body>
                <Title>Cart</Title>
              </Body>
              <Right />
            </Header>
            <Content>
                <Text style={styles.title}>Your order</Text>
            </Content>
        </Container>
    );
  }

}

const styles = StyleSheet.create({

  title: {
    fontSize:32,
    marginVertical: 16,
    textAlign:'center'
  }
})
