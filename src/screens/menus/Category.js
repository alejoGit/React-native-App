import React, { Component } from 'react';
import {  View, StyleSheet, Image, Alert, FlatList} from 'react-native';
import { Container, Header, Content, ListItem, Text, Left, Right, Icon, Body, Title, Thumbnail } from 'native-base';

import { Provider } from 'react-redux';
import store from '../../../store';

export default class Category extends Component {
    static navigationOptions = {
        headerTitle: "Category",
    };
     constructor(props) {
        super(props);        
        this.menus = store.getState().menus;  
        this.currentMenu = this.findCurrentMenu();
        this.currentCategory = this.findCurrentCategory();      
        this.currentProducts = this.currentCategory.products;
    }  
    productOnPress(id) {
        this.props.navigation.navigate("Product", {
              menuId: this.props.navigation.getParam('menuId'),
              categoryId: this.props.navigation.getParam('categoryId'),
              productId: id,
            });
    }

    
    findCurrentMenu(){
        let self = this;
        let menuAux = this.menus.find(function(obj){
            return parseInt(obj.id) === parseInt(self.props.navigation.getParam('menuId'));
        }); 
        return menuAux;
    }
    findCurrentCategory(){
        let self = this;
        let catAux = this.currentMenu.categories.find(function(obj){
            return parseInt(obj.id) === parseInt(self.props.navigation.getParam('categoryId'));
        }); 
        return catAux;
    }
    cutString(str){
        if(str.length > 30){
            return str.substring(0, 30) +'...';
        }else{
            return str;
        }
    }
    getItemPhoto(photo){
        if(photo && photo.length>0){
            return photo;
        }else{
            return "https://gofuu.net/assets/img/productplaceholder.jpg";
        }
    }
    render() {
    return (
        <Provider
            store={store}
        >
        <Container>
            <Content>
                <Text style={styles.title}> {this.currentCategory.name}</Text>
                <FlatList style={styles.list}
                data={this.currentProducts}
                renderItem={({item}) => <ListItem avatar onPress={() => this.productOnPress(item.id) }>
                        <Left>
                            <Thumbnail small source={{ uri: this.getItemPhoto(item.photo) }} />
                        </Left>
                        <Body>
                            <Text>{item.name}</Text>
                            <Text note>{this.cutString(item.description)}</Text>
                        </Body>
                        <Right>
                            <Icon name="arrow-forward" />
                        </Right>
                    </ListItem>
                }
                keyExtractor={(item, index) => index.toString()}
              />
            </Content>
        </Container>
        </Provider>
    );
  }

}

const styles = StyleSheet.create({
  list:{
        backgroundColor:'#ffffff'
    },
  title: {
    fontSize:24,
    marginVertical: 16,
    textAlign:'center'
  }
})
