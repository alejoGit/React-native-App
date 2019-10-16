import React, { Component } from 'react';
import {   FlatList , StyleSheet } from 'react-native';
import { View, Text, Left, Right, ListItem, Body, CheckBox} from 'native-base';
import SingleSelectionInput from './SingleSelectionInput';
import MultipleSelectionInput from './MultipleSelectionInput';
import QuantityInput from './QuantityInput';

class ProductAttributes extends Component {
	constructor(props) {
        super(props);   
        this.attributesSize = this.props.attributes.length;
        this.updatePrice = this.props.parent.updatePrice.bind(props.parent);
        this.updateQuantity = this.props.parent.updateQuantity.bind(props.parent);
        
    } 

    isRequired(pRequired){
        if(pRequired==0){
            return "";
        }
        else if(pRequired==1){
            return <Text>*</Text>;
        }
    }
    parentUpdatePrice(){
        this.updatePrice()
    }
    parentUpdateQuantity(num){
       //onsole.log("Num from ProductAttributes "+ num)
       this.updateQuantity(num)
    }
    getAttributeComponent(attr){

    	if(attr.type=='single_selection'){
    		return ( 
    			<View>
    				<Text style={styles.attributeName}>{attr.name} {this.isRequired(attr.required)}</Text>
    				<SingleSelectionInput {...attr} parent={this} />
    			</View>
    		);
    	}else if(attr.type == 'multiple_selection'){
    		return( 
    			<View>
    				<Text style={styles.attributeName}>{attr.name} {this.isRequired(attr.required)}</Text>
                    <MultipleSelectionInput {...attr} parent={this}    />
    			</View>
    		);
    	}
    } 
	render() {
		let mainComponent;
		if(this.attributesSize <=0 ){
			mainComponent = <QuantityInput parent={this} />
		}else{

			mainComponent = 
			<FlatList //style={styles.list}
                data={this.props.attributes}
                renderItem={({item}) => this.getAttributeComponent(item)

                	
                    	
                    
                    
                }
                keyExtractor={(item, index) => index.toString()}
              />
		}

		return (
			<View>{mainComponent}</View>
		);
	}
}
const styles = StyleSheet.create({

  attributeName: {
    fontSize:16,
    paddingVertical: 8,
    paddingHorizontal:8,
  }
})
export default ProductAttributes;