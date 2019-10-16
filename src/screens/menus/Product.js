import React, { Component } from 'react';
import {  View, StyleSheet, Image, Alert, FlatList, AsyncStorage, Dimensions} from 'react-native';
import { Container, Header, Content, List, ListItem, Text, Left, Right, Icon, Body, Title, Thumbnail, Footer, Button, Textarea} from 'native-base';

import { Provider } from 'react-redux';
import store from '../../../store';

import ProductAttributes from "./ProductAttributes";

export default class Product extends Component {
    static navigationOptions = {
        headerTitle: "Product",
    };
     constructor(props) {
        
        super(props);        
        this.menus = store.getState().menus;  
        this.currentMenu = this.find(this.menus, this.props.navigation.getParam('menuId'));
        this.currentCategory = this.find(this.currentMenu.categories, this.props.navigation.getParam('categoryId'));      
        this.currentProduct = this.find(this.currentCategory.products, this.props.navigation.getParam('productId'));   
        this.currentQuantity = 1;


        const attributes = this.getCurrentAttributes();
        store.dispatch({
          type: 'SET_CURRENT_ATTRIUBTES',
          payload: {
            attributes
          }
        })
        this.cart = [];
        this._setupCart();
        this._getCart();
       

        this.state = {
            currentPrice : this.currentProduct.price.toFixed(2),
            specialInstructions: ''
        };
       
    }
    
    _setupCart = async () => {
        
        try {
          const cartAux = await AsyncStorage.getItem('GOFUU_CART');
          if(cartAux===null){
            await AsyncStorage.setItem('GOFUU_CART', '[]');
          }
        } catch (error) {
          // Error saving data
        }
    }
    _setCart = async (pCart) => {
        try {
            await AsyncStorage.setItem('GOFUU_CART', JSON.stringify(pCart));
          
        } catch (error) {
          // Error saving data
        }
    }
    _getCart = async () => {
      try {
        const cartAux = await AsyncStorage.getItem('GOFUU_CART');
        if (cartAux !== null) {
          // We have data!!
         
          this.cart = JSON.parse(cartAux);
          return cartAux;
        }
       } catch (error) {
         // Error retrieving data
       }
    }
    productOnPress(id) {
        this.props.navigation.navigate("Product", {
              menuId: this.props.navigation.getParam('menuId'),
              categoryId: this.props.navigation.getParam('categoryId'),
              productId: id,
            });
    }
    getCurrentAttributes(){
      let arrAux = [];
      for(let i=0; i<this.currentProduct.attributes.length; i++){
        attributeAux = this.currentProduct.attributes[i];
        arrAux[i] = {'id':attributeAux.id,'name':attributeAux.name, 'type':attributeAux.type, 'value':[]};
      }
      return arrAux;
    }
    find(pArr, pId){
      let self = this;
        let objAux = pArr.find(function(obj){
            return parseInt(obj.id) === parseInt(pId);
        }); 
        return objAux;
    }
    getItemPhoto(photo){
        if(photo && photo.length>0){

            return  <Image style={styles.mainImage} source={{ uri: photo  }} />;
        }else{
            return <Image style={styles.mainImage} source={ require('../../../assets/img/productplaceholder.jpg')  } />;
        }
    }
    validateProductAttributes(){
      
      for(let i=0; i < this.currentProduct.attributes.length ; i++){
        let attrAux =  this.currentProduct.attributes[i];
        if(attrAux.required == 1){
          let stateAttr = this.find(store.getState().attributes, attrAux.id);
          if(stateAttr.type=='single_selection'){
            if(stateAttr.value.length<=0){
              Alert.alert(
                'Required fields',
                  stateAttr.name+':\n please select one option',
                [
                  // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                  // {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                  {text: 'OK', onPress: () => console.log('OK Pressed')},
                ],
                { cancelable: false }
              );
              return false;
            }
          }
        
          if(stateAttr.type=='multiple_selection'){
            if(stateAttr.value.length<attrAux.min_selection){
              Alert.alert(
                'Required fields',
                  stateAttr.name+':\n please select at least '+ attrAux.min_selection+' options',
                [
                  // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                  // {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                  {text: 'OK', onPress: () => console.log('OK Pressed')},
                ],
                { cancelable: false }
              );
              return false;
            }
          }

        }

      }
      return true;
    }
    getCartAttributes(){
      let arr = [];
      for(let i=0; i<store.getState().attributes.length; i++){
        if(store.getState().attributes[i].value.length>0){
          arr.push(store.getState().attributes[i]);
        }
      }
      return arr;
    }
    randomString(length, chars) {
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }
    getCartProduct (){
        let rand = this.randomString(8, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
        let productAux = {
          "cart_id": rand,
          "id": this.currentProduct.id ,
          "name": this.currentProduct.name, 
          "price" :this.currentProduct.price,
          "photo" : this.currentProduct.photo,
          'special_instructions' : this.state.specialInstructions,
          "quantity": this.currentQuantity,
          "attributes": this.getCartAttributes()
        };

      return productAux;
    }
    setCartItem (pItem){
      this.cart.push(pItem);
      this._setCart(this.cart);
    }
    async onPressAddToCart(){
        let validation = this.validateProductAttributes();
        if(validation){
          await this._getCart()
          this.setCartItem(this.getCartProduct());
        
          store.dispatch({
            type: 'SET_CART_SIZE',
            payload: {
              cartSize: this.cart.length
            }
          })
          this.props.navigation.goBack();
        }
        
    }
    updatePrice(){

      let price =parseFloat(this.currentProduct.price * this.currentQuantity);

      for(let i=0; i<store.getState().attributes.length; i++){
        let attributeAux = store.getState().attributes[i];
        if(attributeAux.value.length>0){
          for(let j=0; j<attributeAux.value.length; j++){
            price += parseFloat(attributeAux.value[j].price);
          }
        }
      }
      
      this.setState({
        currentPrice: price.toFixed(2) 
       });
      
    }
    updateQuantity(num){
      
      this.currentQuantity = num
      this.updatePrice()
    }
    getSpecialInstructionsComponent(){
      let specialInstructions;
      if(this.currentProduct.special_instructions==0){
        specialInstructions = null;
      }else{
        specialInstructions= <View>
                                <Text style={styles.attributeName}>Special Instructions</Text>
                                <Textarea blurOnSubmit={true} enablesReturnKeyAutomatically={false}  onChangeText={(text) => { this.setState({specialInstructions:text})  }}  value={this.state.specialInstructions} style={styles.textarea} rowSpan={5} bordered placeholder="Write your special instructions here" />
                              </View>
      }
      return specialInstructions;
    }
    render() {
      
      
    return (
        <Provider
            store={store}
        >
        <Container style={styles.mainWrapper}>
            <Content >
                
                <View style={styles.infoWrapper} >
                  <View class={styles.ctnImage}>
                    {this.getItemPhoto(this.currentProduct.photo)}
                  </View>
                  <View style={styles.textInfo}>
                    <Text style={styles.productName}>{this.currentProduct.name}</Text>
                    <Text style={styles.productDesc}>{this.currentProduct.description}</Text>
                  </View>
                </View>
                <ProductAttributes parent={this} {...this.currentProduct} />
                
                {this.getSpecialInstructionsComponent()}

            </Content>
            <Button style={{height:60,position:'absolute',width: Dimensions.get('window').width ,'bottom':0, backgroundColor:'#de8d2e'}} full onPress={() => this.onPressAddToCart() }>
                  <Text>ADD TO CART ${this.state.currentPrice}</Text>
                </Button>
        </Container>
        </Provider>
    );
  }

}

const styles = StyleSheet.create({
  mainWrapper:{
    paddingBottom: 61
    
  },
  infoWrapper:{
    flex:1,
  },
  ctnImage:{
     height:240,
  },
  mainImage:{
      width:'100%',
      height:240,
      resizeMode:'cover'
  },
  textInfo:{
    backgroundColor:'white',
    paddingVertical: 8,
    paddingHorizontal: 16,
    paddingBottom:16,
  },
  productName:{
    fontSize:22,
    marginBottom:6,
    textAlign:'center'
  },
  productDesc:{
    fontSize:14,
    color:'#444',
    textAlign:'center',
  },
  attributeName: {
    fontSize:16,
    paddingVertical: 8,
    paddingBottom:4,
    paddingHorizontal:8,
    textAlign:'center',
  },
  textarea:{
    backgroundColor:'#ffffff',

  }
})
