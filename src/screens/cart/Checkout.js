import React, { Component } from 'react';
import { ListView, StyleSheet, AsyncStorage, View, FlatList, Image , Alert,ActivityIndicator} from 'react-native';
import { Container, Header, Content, Button, Icon, Text, Left, Right, Body,Footer, Segment,Item,Picker,Input} from 'native-base';
import API from '../../../utils/api';
import { StackActions, NavigationActions } from 'react-navigation';
import moment from 'moment';
import store from '../../../store';
const LOCATION_ID = 9;
export default class Checkout extends Component {
  static navigationOptions = {
        headerTitle: 'Checkout',
        
    };
  constructor(props) {
    super(props);
    //this._getCart();
    this.state = {
      currentForWhen:'now',
      currentTip:0,
      currentDay:'',
      currentHours:[],
      currentTime: '',
      name:'',
      email:'',
      phone:'',
      promoCode:'',
      total:0,
      showTimeComponent:false,
      isLoading:false
    };
    this.dayOptions = []
    this.dayOptions[0] = moment()
    this.dayOptions[1] =  moment().add(1,'day')
    this.dayOptions[2] = moment().add(2,'day')
    this.dayOptions[3] = moment().add(3,'day')
    this.dayOptions[4] = moment().add(4,'day')
  }

  async componentDidMount() {
    this.props.navigation.addListener('willFocus', (playload)=>{
      //console.log(playload);
      this._getCart();
      this.state = {
        currentForWhen:'now',
        currentTip:0,
        currentDay:'',
        currentHours:[],
        currentTime: '',
        name:'',
        email:'',
        phone:'',
        promoCode:'',
        total:0,
        showTimeComponent:false
      }
    });

    this.checkOrderAvailability()
  }
  async checkOrderAvailability(){
    const orderAvailability = await API.checkOrderAvailability(LOCATION_ID);
    let error = orderAvailability.error
    if(error==undefined){
      //console.log("SE PUEDE REALIZAR LA ORDEN")
    }else{
      alert("Sorry, right now we are not receiving orders. Please select order for later")
      this.setState({currentForWhen:'later'})
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
        let taxesValue = (subtotal * 0.0825 )
        let total = parseFloat( subtotal + taxesValue)
        
        //console.log(total)
        this.setState({
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
  onPressForWhenOption(option){
    if(option =='now'){
      if(this.state.currentForWhen !='now'){
        this.setState({ 
          currentForWhen:'now',
          currentDay:'',
          currentTime:''
        })
        this.checkOrderAvailability()
      }
    }
    if(option =='later'){
      if(this.state.currentForWhen !='later'){
        this.setState({currentForWhen:'later'})
        
      }
    } 
  }
  onPressTipOption(option){
    this.setState({currentTip:option})
  }
  getDayOptions(){
  

    let arrComponents = [];
    //console.log(JSON.stringify(this.dayOptions))
    for(let i=0; i< this.dayOptions.length; i++){
      arrComponents[i] = <Picker.Item key={i} value={this.dayOptions[i].format('YYYY-MM-DD')} label={this.dayOptions[i].format('dddd DD')} />
    }
    // dayOptions[0] = <Picker.Item key={0} value={dateAux.format('YYYY-MM-DD')} label={dateAux.format('dddd DD')} />; 
    
    // dateAux.add(1,'day');
    // dayOptions[1] = <Picker.Item key={1} value={dateAux.format('YYYY-MM-DD')} label={dateAux.format('dddd DD')} />; 
    
    // dateAux.add(1,'day');
    // dayOptions[2] = <Picker.Item key={2} value={dateAux.format('YYYY-MM-DD')} label={dateAux.format('dddd DD')} />; 

    // dateAux.add(1,'day');
    // dayOptions[3] = <Picker.Item key={3} value={dateAux.format('YYYY-MM-DD')} label={dateAux.format('dddd DD')} />; 
    
    // dateAux.add(1,'day');
    // dayOptions[4] = <Picker.Item key={4} value={dateAux.format('YYYY-MM-DD')} label={dateAux.format('dddd DD')} />; 


    return arrComponents
  }
  async onValueChangeDay(value:string){
   
   
   this.setState({
      currentDay: value,
      showTimeComponent:false,
    })
   let currentHours = await API.getHours( LOCATION_ID , value)
   
  
   var todayAux = moment().format('YYYY-MM-DD');

   var todayAux2 = new Date();
   var hourAux =    ("0" + todayAux2.getHours()).slice(-2) + ":" + ("0" + todayAux2.getMinutes()).slice(-2)+ ":" + ("0" + todayAux2.getSeconds()).slice(-2);
    
     
   if(todayAux==value){
      
      let arrRemoveIndexs = [];
      for(let i=0; i< currentHours.length; i++){
        let hAux = currentHours[i];
        if( Date.parse('01/01/2000 '+hAux) < Date.parse('01/01/2000 '+hourAux) ){
            console.log(hAux);
            arrRemoveIndexs.push(i);
            //currentHours.splice(i,1);
        }
      }
      /*Elimina las horas que pasaron y las cercanas para el pedido for later*/
      for(let i=0; i<arrRemoveIndexs.length; i++){
        currentHours.splice(0,1);
      }
      currentHours.splice(0,1);
      
      if(currentHours.length<=0){
        //$("#idDeliveryDate").find("option").eq(0).remove();
        //self.order.date = $("#idDeliveryDate").find("option").eq(0).val();
        //self.getHours(self.order.date,'<?php echo LOCATION_ID ?>');
        this.dayOptions.splice(0,1)
        this.onValueChangeDay(this.dayOptions[0].format('YYYY-MM-DD'))
      }

    }

    this.setState({
     currentHours: currentHours,
     showTimeComponent: true,
   })
   //this.getHourOptions()
   //this.getTimeComponent()
  }
  getHourOptions(){
    let options = [];
    for (var i = 0; i < this.state.currentHours.length; i++) { 
      optAux = this.state.currentHours[i];
      let hourFormat = moment('2018-01-01 '+optAux).format('h:mm A')
      options.push(<Picker.Item key={i} value={optAux} label={hourFormat} />); 
    }
    return options;
  }
  onValueChangeHour(value:string){
    this.setState({
      currentTime: value,
    });
  }
  getTimeComponent(){
    if(this.state.currentDay.length<=0)
      return null

    if(this.state.showTimeComponent){
      return <View style={styles.subCtnDayHour}>
            <Text style={{marginBottom:8,textAlign:'center'}}>Time?</Text>
            <Item picker>
            <Picker
                  mode="dropdown"
                  iosIcon={<Icon name="ios-arrow-down-outline" />}
                  style={{  backgroundColor:'#f8f8f8' }}
                  textStyle={{fontSize:13}}
                  placeholder="Select Time"
                  placeholderStyle={{ color: "#bfc6ea" }}
                  placeholderIconColor="#007aff"
                  selectedValue={this.state.currentTime}
                  onValueChange={this.onValueChangeHour.bind(this)}
                >
                  {this.getHourOptions()}
                </Picker></Item></View>
    }else{
      return <ActivityIndicator style={{flex:1}} />
    }

  }
  getHourDayComponent(){
    let comp = null
    if(this.state.currentForWhen=='later'){
      comp = <View style={styles.ctnDayHour}>
                <View style={styles.subCtnDayHour}>
                    <Text style={{marginBottom:8,textAlign:'center'}}>Day?</Text>
                    <Item picker>
                      <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="ios-arrow-down-outline" />}
                        style={{   backgroundColor:'#f8f8f8' }}
                        textStyle={{fontSize:13}}
                        placeholder="Select day"
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                        selectedValue={this.state.currentDay}
                        onValueChange={this.onValueChangeDay.bind(this)}
                      >
                      {this.getDayOptions()}
                      </Picker>
                    </Item>
                </View>
                <View style={styles.subCtnDayHour}>
                    {this.getTimeComponent()}
                </View>
              </View>
    }
    return comp;
  }
  isBlank (str) {
    return (!str || /^\s*$/.test(str));
  }
  validateEmail (email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  validateOrderFields(){
    if(this.state.currentForWhen=='later'){
      if(this.state.currentDay.length<=0){
        alert("Please select the day")
        return false
      }
      if(this.state.currentTime.length<=0){
        alert("Please select the time")
        return false
      }
    }
    if(this.isBlank(this.state.name)){
      alert("Please enter your name")
      return false
    } 
    if(this.isBlank(this.state.email)){
      alert("Please enter your e-mail")
      return false
    } 
    if(!this.validateEmail(this.state.email)){
      alert("Please enter a valid e-mail")
      return false
    }
    if(this.isBlank(this.state.phone)){
      alert("Please enter phone number")
      return false
    } 
  

    return true;
  }
  getOrderProductsArray(){
    
  
    let arrOrderProducts = [];
    for(let i=0; i<this.cart.length; i++){
      let productAux = this.cart[i];
      let objProductAux = {};
        objProductAux = {'product_id':productAux.id,'attributes':[],'special_instructions':productAux.special_instructions,'quantity':productAux.quantity}; 
      for(let j=0; j<productAux.attributes.length; j++){
        let attrAux = productAux.attributes[j];
        let objAttributeAux = {};
        objAttributeAux[attrAux.id] = [];
        objProductAux.attributes.push(objAttributeAux);
        for(let k=0; k<attrAux.value.length; k++){
          let optionAux = attrAux.value[k];
          objAttributeAux[attrAux.id].push(optionAux.id);
        }
      }
      arrOrderProducts.push(objProductAux);
    }
    return arrOrderProducts;
  }
  async onPressOrderNow(){
    
    if(this.validateOrderFields()){
      orderData = {
                'location_id':LOCATION_ID,
                'user_id': 1,
                'when':this.state.currentForWhen,
                'payment_method':  'cash',
                'delivery_method': 'pickup',
                'delivery_date': this.state.currentDay,
                'delivery_time': this.state.currentTime,
                'products': this.getOrderProductsArray(),
                'tip': this.state.currentTip,
                'name': this.state.name,
                'email': this.state.email,
                'phone': this.state.phone,
                'promo_code': this.state.promoCode,
                'card_id': '',
                'stripe_token': ''
              }
      this.setState({isLoading:true})        
      let orderResponse = await API.sendOrder(orderData)
      this.setState({isLoading:false})  
      if(orderResponse.mensaje && orderResponse.mensaje=='ok'){
        await AsyncStorage.setItem('GOFUU_CART', '[]')
        store.dispatch({
          type: 'SET_CART_SIZE',
          payload: {
            cartSize: 0
          }
        })
        alert("Thanks for your order")

        const resetAction = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: 'Cart' })],
        });
        this.props.navigation.dispatch(resetAction);

        this.props.navigation.navigate("Home")
      }else{
        let str = "";
        for (var key in orderResponse) {
          //console.log("key " + key + " has value " + myArray[key]);
          str +=  orderResponse[key] +'\n'
        }
        alert(str)
      }      
    }  
  }
  render() {
    if(this.state.isLoading){
      return(
        <View style={{flex: 1,justifyContent:'center', padding: 20}}>
          <ActivityIndicator/>
        </View>
      )
    }
    return (
      <Container>
          <Content style={styles.mainContent}>
              <Text style={styles.title}>When do you want your order?</Text>
              <Segment>
                <Button style={{flex:1,borderColor:'#de8d2e', backgroundColor: this.state.currentForWhen === 'now' ? "#de8d2e" : 'transparent'}}  first active={this.state.currentForWhen == 'now'} onPress={() => this.onPressForWhenOption('now') }><Text style={{flex:1,textAlign:'center', color: this.state.currentForWhen === 'now' ? "#ffffff" : '#de8d2e'}} >Order for now</Text></Button>
                <Button style={{flex:1,borderColor:'#de8d2e', backgroundColor: this.state.currentForWhen === 'later' ? "#de8d2e" : 'transparent'}} last  active={this.state.currentForWhen == 'later'} onPress={() => this.onPressForWhenOption('later') }><Text  style={{flex:1,textAlign:'center', color: this.state.currentForWhen === 'later' ? "#ffffff" : '#de8d2e'}}>Order for later</Text></Button>
              </Segment>
              { this.getHourDayComponent() }
              <Text style={styles.title}>Tip?</Text>
              <Segment>
                <Button style={{flex:1,borderColor:'#de8d2e', backgroundColor: this.state.currentTip === 0 ? "#de8d2e" : 'transparent'}} first active={this.state.currentTip == 0} onPress={() => this.onPressTipOption(0) }><Text style={{flex:1,textAlign:'center', color: this.state.currentTip === 0 ? "#ffffff" : '#de8d2e'}}>0</Text></Button>
                <Button style={{flex:1,borderColor:'#de8d2e', backgroundColor: this.state.currentTip === 10 ? "#de8d2e" : 'transparent'}}   active={this.state.currentTip == 10} onPress={() => this.onPressTipOption(10) }><Text  style={{flex:1,textAlign:'center', color: this.state.currentTip === 10 ? "#ffffff" : '#de8d2e'}}>10%</Text></Button>
                <Button style={{flex:1,borderColor:'#de8d2e', backgroundColor: this.state.currentTip === 15 ? "#de8d2e" : 'transparent'}}   active={this.state.currentTip == 15} onPress={() => this.onPressTipOption(15) }><Text  style={{flex:1,textAlign:'center', color: this.state.currentTip === 15 ? "#ffffff" : '#de8d2e'}}>15%</Text></Button>
                <Button style={{flex:1,borderColor:'#de8d2e', backgroundColor: this.state.currentTip === 20 ? "#de8d2e" : 'transparent'}} last  active={this.state.currentTip == 20} onPress={() => this.onPressTipOption(20) }><Text  style={{flex:1,textAlign:'center', color: this.state.currentTip === 20 ? "#ffffff" : '#de8d2e'}}>20%</Text></Button>
              </Segment>
              <Item>
                <Icon style={styles.icon} active name='person' />
                <Input value={this.state.name}  onChangeText={(text) => {this.setState({name:text}); }} placeholder='Your name'/>
              </Item>
              <Item>
                <Icon style={styles.icon} active name='mail' />
                <Input keyboardType='email-address' value={this.state.email}  onChangeText={(text) => {this.setState({email:text}); }} placeholder='Your e-mail'/>
              </Item>
              <Item>
                <Icon style={styles.icon} active name='call' />
                <Input keyboardType='phone-pad' value={this.state.phone}  onChangeText={(text) => {this.setState({phone:text}); }} placeholder='Your phone'/>
              </Item>
              <Item>
                <Icon style={styles.icon} active name='pricetag' />
                <Input value={this.state.promoCode}  onChangeText={(text) => {this.setState({promoCode:text}); }} placeholder='Promo code'/>
              </Item>
          </Content>
          <Footer style={{backgroundColor:'transparent',borderColor:'transparent'}}>
               <Body style={{alignSelf:'flex-end'}}>
                  <Button style={{backgroundColor:'#de8d2e'}}  full iconRight onPress={() => this.onPressOrderNow() }>
                    <Text>ORDER NOW ${this.state.total}</Text>
                    <Icon style={{color:'white'}} name='send' />
                  </Button>
                </Body>
              </Footer>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  mainContent:{
    paddingHorizontal:16
  },
  title:{
    paddingVertical:8,
    paddingTop:12
  },
  btnSegment:{
    flex:1,
  },
  textSegment:{
    flex:1,
    textAlign:'center'
  },
  ctnDayHour:{
    flexDirection:'row',
    justifyContent:'space-between'
  },
  subCtnDayHour:{
   flex:1,
   marginHorizontal:2,
   alignItems:'center'
  },
  icon:{
    //color:'#2979fc',
    color:'#555',
  },
});