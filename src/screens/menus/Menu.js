import React, { Component,Platform } from 'react';
import {  View, StyleSheet, Image, Alert, FlatList} from 'react-native';
import { Container, Header, Content, List, ListItem, Text, Left, Right, Icon, Body, Title ,Button} from 'native-base';

import { Provider } from 'react-redux';
import store from '../../../store';

export default class Menu extends Component {

    static navigationOptions = {
        headerTitle: "Menu",
        //headerTitleStyle: { color: '#fff' },
        //headerStyle: { backgroundColor: '#ff0000' },
    };
     constructor(props) {
        super(props);        
        this.menus = store.getState().menus;  
        this.currentMenu = this.findCurrentMenu();      
        this.currentCategories = this.currentMenu.categories;
    } 
   
    findCurrentMenu(){
        let self = this;
        let menuAux = this.menus.find(function(obj){
            return parseInt(obj.id) === parseInt(self.props.navigation.getParam('menuId'));
        }); 
        return menuAux;
    }
    categoryOnPress(id) {

        this.props.navigation.navigate("Category", {
              menuId: this.props.navigation.getParam('menuId'),
              categoryId: id,
            });
    }
    render() {
    return (
        <Provider
            store={store}
        >
        <Container>
            <Content>
                <Text style={styles.title}> {this.currentMenu.name}</Text>
                <FlatList style={styles.list}
                data={this.currentCategories}
                renderItem={({item}) => <ListItem onPress={() => this.categoryOnPress(item.id) }>
                        <Left>
                            <Icon name="book" />
                            <Text>{item.name}</Text>
                        </Left>
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
