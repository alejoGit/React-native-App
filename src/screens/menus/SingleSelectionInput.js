import React, { Component } from 'react';
import{ Dimensions, FlatList} from 'react-native';
import { View, List, Form, Item, Picker , Icon } from 'native-base';

import store from '../../../store';

export default class SingleSelectionInput extends Component {
    constructor(props) {
    super(props);
    this.parentUpdatePrice = this.props.parent.parentUpdatePrice.bind(props.parent);
    this.state = {
      selected: undefined
    };
    
  }
  onValueChange(value: string) {
    let self = this;
    this.setState({
      selected: value
    });
    let attributes = store.getState().attributes;
    let attrAux = attributes.find(function(obj){
        return parseInt(obj.id) === parseInt(self.props.id);
    }); 
    let option = this.findOption(value);
    attrAux.value = [{'id':value,'name':option.name,'price':option.price}];
    store.dispatch({
        type: 'SET_CURRENT_ATTRIUBTES',
        payload: {
          attributes
        }
      })
    this.parentUpdatePrice();
    //console.log('----------------');
    //console.log(JSON.stringify(attrAux));
  }
  findOption(pId){
    let self = this;
    let optAux = this.props.options.find(function(obj){
        return parseInt(obj.id) === parseInt(pId);
    }); 
    return optAux;
  }
  getOptionLabel(pOption){
    let str = pOption.name;
    if(pOption.price>0){
      str += " + $"+pOption.price.toFixed(2);
    }
    return str;
  }
  render() {
    const options = [];
    for (var i = 0; i < this.props.options.length; i++) { 
      optAux = this.props.options[i];
      options.push(<Picker.Item key={i} value={optAux.id} label={this.getOptionLabel(optAux)} />); 
    }
    return (
    
      
        <View style={{backgroundColor:'white',alignItems:'center'}}>
          <Form>
            <Item picker>
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="ios-arrow-down-outline" />}
                style={{ width:  Dimensions.get('window').width - 30 }}
                placeholder="Select an option"
                placeholderStyle={{ color: "#777777" }}
                placeholderIconColor="#007aff"
                selectedValue={this.state.selected}
                onValueChange={this.onValueChange.bind(this)}
              >
              
                
                {options}
              </Picker>
            </Item>
          </Form>
        </View>
     
    );
  }
}