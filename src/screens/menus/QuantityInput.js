import React, { Component } from 'react';
import{ Dimensions, FlatList,StyleSheet,TextInput,View} from 'react-native';
import {  List, Form , Icon, Text } from 'native-base';

import store from '../../../store';

export default class QuantityInput  extends Component {
    constructor(props) {
    super(props);
    this.state = { text: '1' };
    this.parentUpdateQuantity = this.props.parent.parentUpdateQuantity.bind(props.parent);
  }
  onChangeText(text){
      this.setState({text})
      try{
        let num = parseInt(text)
        if(isNaN(num)){
          //console.log("isNaN")
          num = 1
        }

        //console.log(num)
        this.parentUpdateQuantity(num)
      }catch(e){
        console.log(e)
      }
  }
  render() {
   
    return (
        
        <View style={{backgroundColor:'white',alignItems:'center'}}>
          <Text style={styles.quantityTitle}>Cantidad</Text>
          <TextInput
              keyboardType='numeric'
              style={styles.inputNumber}
              onChangeText={(text) => this.onChangeText(text)}
              value={this.state.text}
            />
        </View>
     
    );
  }
}

const styles = StyleSheet.create({
  inputNumber:{
    height: 40,
    width:60,
    borderColor: 'gray',
    borderWidth: 1,
    textAlign:'center',
    marginVertical:4,
    marginBottom:20
  },
  quantityTitle: {
    fontSize:16,
    paddingVertical: 8,
    paddingHorizontal:8,
  }
})