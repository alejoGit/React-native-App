import React, { Component } from 'react';
import{ Dimensions, FlatList} from 'react-native';
import { View, List, Form, Icon, ListItem, CheckBox, Body, Text } from 'native-base';

import store from '../../../store';

export default class MultipleSelectionInput extends Component {
    constructor(props) {
    super(props);
    let checkboxStates = this.getInitialCheckboxStates();
    this.parentUpdatePrice = this.props.parent.parentUpdatePrice.bind(props.parent);
    this.state = {
      checkboxStates: checkboxStates
    };
 
  }
  getInitialCheckboxStates(){
    let arrAux = [];
    for(let i=0; i<this.props.options.length; i++){
      arrAux[i] = false;
    }
    return arrAux;
  }
  
  findOption(pId){
    let self = this;
    let optAux = this.props.options.find(function(obj){
        return parseInt(obj.id) === parseInt(pId);
    }); 
    return optAux;
  }
  getPrice(pOption){
      if(pOption.price>0){
          return '+ $'+pOption.price.toFixed(2);
      }
      else{
          return "";
      }
  }
  deleteItem(pArray,id){
      let objAux = pArray.find(function(obj){
          return parseInt(obj.id) === parseInt(id);
      }); 
      //alert(objAux);
    let index = pArray.indexOf(objAux);
      pArray.splice(index,1);
  }
  addOrRemoveItem(item){
    let self = this;
    let attributes = store.getState().attributes;
    let attrAux = attributes.find(function(obj){
        return parseInt(obj.id) === parseInt(self.props.id);
    }); 
    let option = this.findOption(item.id);

   
    
    let optionAux = attrAux.value.find(function(obj){
        return parseInt(obj.id) === parseInt(item.id);
    }); 

    if(optionAux){
      //console.log("SI ESTá"+ JSON.stringify(optionAux));
      this.deleteItem(attrAux.value, item.id);
    }else{
      //console.log("NO ESTA");
      attrAux.value.push({'id':item.id,'name':option.name,'price':option.price});
    }
    store.dispatch({
        type: 'SET_CURRENT_ATTRIUBTES',
        payload: {
          attributes
        }
      })
  }
  onPressCheckbox(index,item){
    
    let checkboxStatesAux = this.state.checkboxStates;
    if( checkboxStatesAux[parseInt(index)] ){
      checkboxStatesAux[parseInt(index)]  = false;
    }else{
      checkboxStatesAux[parseInt(index)] = true;
    }
    this.setState({
       checkboxStates: checkboxStatesAux
    });
    this.addOrRemoveItem(item);
    this.parentUpdatePrice();

  }
  render() {
    const options = [];
    for (var i = 0; i < this.props.options.length; i++) { 
      //optAux = this.props.options[i];
      //options.push(<Picker.Item key={i} value={optAux.id} label={optAux.name} />); 
    }
    return (
        <View style={{backgroundColor:'white',alignItems:'center'}}>        
        
            <FlatList 
              extraData={this.state}
              data={this.props.options}
              renderItem={({item,index}) => 
                <ListItem
                  onPress={() => this.onPressCheckbox(index,item) }
                  style={{ width:  Dimensions.get('window').width - 30 }}>
                  <CheckBox
                    onPress={() => this.onPressCheckbox(index,item) }
                    checked= { this.state.checkboxStates[parseInt(index)] } />
                    <Body>
                      <Text>{item.name} {this.getPrice(item)}</Text>
                    </Body>
                </ListItem>  
              }
              keyExtractor={(item, index) => index.toString()}
            />
                
        </View>
     
    );
  }
}