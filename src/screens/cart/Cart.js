import React, { Component } from 'react';
import { ListView, StyleSheet, AsyncStorage, Modal, TouchableHighlight, FlatList, Image , Alert,ScrollView} from 'react-native';
import { Container,View, Header, Content, Button, Icon, List, ListItem, Text, Grid, Row, Left, Right, Body,Thumbnail,Footer} from 'native-base';
import store from '../../../store';
const datas = [

];
const TAX_VALUE = 0.0825
export default class Cart extends Component {
  static navigationOptions = {
        headerTitle: 'Your Order',
        
  };
  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    //this._getCart();
    this.state = {
      listViewData: datas,
      modalVisible: false,
      currentCartProduct: [],
     
    };
    this.cart = null
    this._setupCart();
  }

  componentDidMount() {
    this.props.navigation.addListener('willFocus', (playload)=>{
      //console.log(playload);
     
      this._getCart();
      this.state = {
        listViewData: datas,
        modalVisible: false,
        currentCartProduct: [],
        subtotal:0.00,
        taxesValue:0 ,
        total:0,
      }


    })
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
      //console.log(cartAux)
      
      if (cartAux !== null) {
        // We have data!!
       
        this.cart = JSON.parse(cartAux);
        
        let subtotal = this.getSubtotal(this.cart)
        let taxesValue = (subtotal * TAX_VALUE )
        let total = parseFloat( subtotal + taxesValue)
        
        //console.log(total)
        this.setState({
          listViewData: this.cart,
          subtotal: subtotal.toFixed(2),
          taxesValue: taxesValue.toFixed(2),
          total: total.toFixed(2)
         });
        return cartAux;
      }
     } catch (error) {
       console.log("error" + error)
     }
  }
  getItemTotal(pItem){
    let totalAux= parseFloat(pItem.price) * parseInt(pItem.quantity);
    if(pItem.attributes){
      for(let i = 0; i< pItem.attributes.length; i++){
        let attrAux = pItem.attributes[i];
        for(let j = 0; j< attrAux.value.length; j++){
          let optionAux = attrAux.value[j];
          totalAux += parseFloat(optionAux.price);
        }
      }
    }
    return totalAux.toFixed(2);
  }
  getSubtotal(pCart){
    //console.log(pCart)
    let subtotalAux = 0;
    for(let i=0; i<pCart.length; i++){
      let item = pCart[i];
      subtotalAux += parseFloat(this.getItemTotal(item));
    }
    return subtotalAux;
  }

  deleteItem(pArray,id){

      let objAux = pArray.find(function(obj){
          return obj.cart_id === id;
      }); 
      //alert(objAux);
    let index = pArray.indexOf(objAux);
    pArray.splice(index,1);
  }
  deleteRow(secId, rowId, rowMap,data) {
  

    this.deleteItem(this.cart,data.cart_id);
    this._setCart(this.cart);
    
    store.dispatch({
      type: 'SET_CART_SIZE',
      payload: {
        cartSize: this.cart.length
      }
    })
   
    //console.log(store.getState())

    rowMap[`${secId}${rowId}`].props.closeRow();
    
    const newData = [...this.cart];
    
    let subtotal = this.getSubtotal(this.cart)
    let taxesValue = (subtotal * TAX_VALUE )
    let total = parseFloat( subtotal + taxesValue)
    
    this.setState({
          listViewData: newData,
          subtotal: subtotal.toFixed(2),
          taxesValue: taxesValue.toFixed(2),
          total: total.toFixed(2)
         });
    //console.log(this.props.navigation)
  }
  openCartProductModal(data) {
    this.setState({modalVisible: true, currentCartProduct:data});
    //console.log(data);
  }
  closeModal(){
    this.setState({modalVisible:false, currentCartProduct:[]});
  }
  getItemPhoto(photo){
      if(photo && photo.length>0){
          return photo;
      }else{
          return "https://gofuu.net/assets/img/productplaceholder.jpg";
      }
  }
  getOptionsText(item){
    let str = ""
    for(let i=0; i<item.value.length; i++){
      str += item.value[i].name;
      if(item.value[i].price>0){
        str += ' + $'+item.value[i].price.toFixed(2)
      }
      if(i<item.value.length-1){
        str +=  " , "
      }
    }
    return str;

  }

  getSpecialInstructionsModal(pSpecialInstructions){
    let comp = null;

    if(pSpecialInstructions && pSpecialInstructions.length>0){
      comp =   <View><Text style={styles.attributeName}>Special Instructions</Text>
                      <Text style={styles.ctnOptions}>{pSpecialInstructions}</Text></View>;
    }
    return comp;
  }
  removeFromModal(){
    this.deleteItem(this.cart,this.state.currentCartProduct.cart_id);
    this._setCart(this.cart);

    store.dispatch({
      type: 'SET_CART_SIZE',
      payload: {
        cartSize: this.cart.length
      }
    })
    const newData = [...this.cart];
    
    let subtotal = this.getSubtotal(this.cart)
    let taxesValue = (subtotal * TAX_VALUE )
    let total = parseFloat( subtotal + taxesValue)
    
    this.setState({
          listViewData: newData,
          subtotal: subtotal.toFixed(2),
          taxesValue: taxesValue.toFixed(2),
          total: total.toFixed(2),
         });
    this.closeModal()

  }
  removeProductFromModal(){
    Alert.alert(
      'Remove Product',
      'Are you sure?',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'Remove', onPress: () => this.removeFromModal()},
      ],
      { cancelable: false }
    )
  }
  getProductTotalModal(){
      return this.getItemTotal(this.state.currentCartProduct);
  }
  onPressCheckout(){
    if(!this.cart||this.cart.length<=0){
      alert("Sorry, your cart is empty. \nPlease add items to your cart:")
      return
    }
    this.props.navigation.navigate("Checkout");
  }
  getEmptyComponent(){
    if(!this.cart)
      return null
    let cartAux = this.cart
     
    if(cartAux.length && cartAux.length>0){
      return null
    }
    let comp = <View style={styles.emptyWrapper}>
                 <Icon name="cart"/><Text style={styles.emptyText}>Your cart is empty, please add items to your cart</Text>
                  <Button onPress={() => this.props.navigation.navigate('Menus') } style={styles.btnMenus}><Text>Our Menus</Text></Button>
                </View>

    return comp
  }
  render() {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    return (
      <Container>

          <Grid>
          <Row style={{backgroundColor:'#f0f0f0','flexDirection':'column'}}size={75}>
              {this.getEmptyComponent()}
              <List 
                dataSource={this.ds.cloneWithRows(this.state.listViewData)}
                renderRow={data =>
                  <ListItem style={styles.listItem} avatar onPress={() => this.openCartProductModal(data) }>
                    <Left>
                        <Thumbnail small source={{ uri: this.getItemPhoto(data.photo) }} />
                    </Left>
                    <Body style={{borderColor:'#ffffff',flexDirection:'row'}}>
                        <Text style={styles.quantity}>{data.quantity}</Text>
                        <Text>{data.name} </Text>
                        
                    </Body>
                    <Right style={{borderColor:'#ffffff'}}>
                        <Icon name="arrow-forward" />
                    </Right>
                   
                  </ListItem>}
                /*renderLeftHiddenRow={data =>
                  <Button full onPress={() => alert(data)}>
                    <Icon active name="information-circle" />
                  </Button>}*/
                renderRightHiddenRow={(data, secId, rowId, rowMap) =>
                  <Button full danger onPress={_ => this.deleteRow(secId, rowId, rowMap,data)}>
                    <Icon active name="trash" />
                  </Button>}
                //leftOpenValue={75}
                rightOpenValue={-75}
              />


          </Row>
          <Row style={styles.ctnValues} size={25}>
              <Text>Sub-Total: ${this.state.subtotal}</Text>
              <Text>Taxes: ${this.state.taxesValue}</Text>
              <Text>Total: ${this.state.total}</Text>

               <Button style={styles.btnCheckout} full iconRight success onPress={()=>this.onPressCheckout()}>
                  <Text>PROCEED TO CHECKOUT </Text>
                  <Icon style={{color:'white'}} name='arrow-forward' />
                </Button>
          </Row>
         
          </Grid>
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              //alert('Modal has been closed.');
            }}>
            <Icon style={styles.modalCloseX} onPress={() => { this.closeModal(); }} name="close" />
            <ScrollView style={{marginTop: 22}}> 
              <View style= {{alignItems:'center'}}> 
                <Image style={styles.productImage} source={{ uri: this.getItemPhoto(this.state.currentCartProduct.photo) }} />
              </View>
              <View>
                <Text style={styles.titleModal}>{this.state.currentCartProduct.name}</Text>
                <Text style={styles.ctnQuantityModal}>Price: ${parseFloat(this.state.currentCartProduct.price).toFixed(2)}    Quantity: {this.state.currentCartProduct.quantity}</Text>
                
                <FlatList 
                  data={this.state.currentCartProduct.attributes}
                  renderItem={({item}) => <View style={{flexDirection:'column'}}>
                      <Text style={styles.attributeName}>{item.name}</Text>
                      <Text style={styles.ctnOptions}>{this.getOptionsText(item)}</Text>
                  </View>
                  }
                  keyExtractor={(item, index) => index.toString()}
                />
                { this.getSpecialInstructionsModal(this.state.currentCartProduct.special_instructions)}
                <Text style={styles.total}>Total: ${this.getProductTotalModal()}  </Text>

                <View style={styles.ctnButtonsModal}>
                  <Button
                    onPress={() => {
                      this.closeModal();
                    }}>
                    <Text>Back to my order</Text>
                  </Button>
                  <Button danger onPress={()=> this.removeProductFromModal()}>
                    <Text>Remove from my order</Text>
                  </Button>
                </View>
              </View>
            </ScrollView>
          </Modal>
      </Container>
    );
  }
}

const styles = StyleSheet.create({

  listItem:{
     borderBottomWidth: 0.5,
     borderBottomColor: '#d6d7da',
     paddingHorizontal:8,
     paddingVertical:2
  },
  attributeName: {
    fontSize:16,
    paddingVertical: 8,
    paddingHorizontal:8,
    backgroundColor:'#f1f1f1',
    textAlign:'center'
  },
  ctnOptions:{
    fontSize:14,
    color:'#222',
    paddingVertical: 8,
    paddingHorizontal:8,
    textAlign:'center'
  },
  ctnQuantityModal:{
      fontSize:14,
      paddingVertical: 8,
      paddingBottom:16,
      textAlign:'center'
  },
  list:{
        backgroundColor:'#ffffff'
    },
  titleModal: {
    fontSize:24,
    marginVertical: 16,
    textAlign:'center',
    marginBottom:0,
  },
  productImage:{
      width:120,
      height:120,
      borderRadius:60,
      resizeMode:'cover',
      marginTop:40
  },
  ctnValues:{
    paddingTop:16,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'flex-end',
  },
  quantity:{
    fontWeight:'bold',

  },
  modalCloseX:{
    fontSize:60,
    position:'absolute',
    right:24,
    top:24,
  
    paddingHorizontal:16,
    zIndex:9999
  },
  ctnButtonsModal:{
    flexDirection:'row',
    justifyContent:'space-between',
    paddingVertical:16,
    paddingHorizontal:3,
  },
  emptyWrapper:{
    position:'absolute',
    zIndex:9999,
    height:'100%',
    paddingVertical:32,
    paddingHorizontal:32,
    justifyContent:'center',
    alignItems:'center'
  },
  emptyText:{
    fontSize:18,
    textAlign:'center',
    fontWeight:'bold'
  },
  btnMenus:{
    backgroundColor:'#de8d2e',
    alignSelf:'center',
    marginTop:24
  },
  btnCheckout:{
    backgroundColor:'#de8d2e',
    marginTop:16,
    height:55
  },
  total:{
    backgroundColor:'#f1f1f1',
    paddingVertical:16,
    fontSize:24,
    textAlign:'center',
  }
});