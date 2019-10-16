import React, { Component } from 'react';
import {  View, StyleSheet, Image, Alert, FlatList,ActivityIndicator} from 'react-native';
import { Container, Header, Content, List, ListItem, Text, Left, Right, Icon, Body, Title, Footer } from 'native-base';

import API from '../../../utils/api';

import { Provider } from 'react-redux';
import store from '../../../store';
const LOCATION_ID = 9;
export default class Menus extends Component {
    static navigationOptions = {
        headerTitle: 'Menus',
        header:<Header noLeft>
                  <Left/>
                  <Body>
                    <Title>Menus</Title>
                  </Body>
                  <Right />
                </Header>
    };

    constructor(props){
        super(props);
        this.state = { isLoading : true}
      }
    async componentDidMount(){
        const menus = await API.getFullMenus(LOCATION_ID);
       
        this.setState({
            isLoading: false,
            dataSource: menus,
        })
        store.dispatch({
          type: 'SET_MENUS_LIST',
          payload: {
            menus
          }
        })
    }
    menuOnPress(id) {
        this.props.navigation.navigate("Menu", {
              menuId: id,
            });
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
        <Provider
            store={store}
        >
        <Container>
            <Content>
                <View style={styles.ctnImage}>
                  <Image style={styles.mainImage} source={require('../../../assets/img/logo.png')} />
                </View>
                <FlatList style={styles.list}
                data={this.state.dataSource}
                renderItem={({item}) => <ListItem onPress={() => this.menuOnPress(item.id) }>
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
    ctnImage: {
      backgroundColor: '#f1f1f1',
      justifyContent:'center',
      alignItems:'center',
       height:150,
    },
    mainImage:{
        width:'60%',
        resizeMode:'contain'
    },
    title: {
      fontSize:32,
      marginVertical: 16,
      textAlign:'center'
    }
})
