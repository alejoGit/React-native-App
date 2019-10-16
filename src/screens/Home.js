import React, { Component } from 'react';
import {  View, StyleSheet, Image, Alert,AsyncStorage,Linking} from 'react-native';
import { Container, Header, Content, List, ListItem, Text, Left, Right, Icon, Body, Title } from 'native-base';
import store from '../../store';
// import openMap from 'react-native-open-maps';
import { Provider } from 'react-redux';
import { showLocation } from 'react-native-map-link';
import { Popup } from 'react-native-map-link';



export default class Home extends Component {
		

	/* async getSize  ()  {
	  let size
	  try {
	    size = await AsyncStorage.getItem('GOFUU_CART');
	    if (size !== null) {
	      size = JSON.parse(size).length
	      
	      return size
	    }
	  } catch (error) {
	    // Error retrieving data
	    console.log(error.message);
	  }
	  return size;
	}

	async componentWillMount(){
		let siz = await this.getSize()
		store.dispatch({
	        type: 'SET_CART_SIZE',
	        payload: {
	          cartSize: siz
	        }
	      })
		console.log(this.props.navigation.state)
	}*/
	constructor(props){
		super(props)
		
		this.state = {isVisible:false}
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
	_getCart = async () => {
      try {
        let cartAux = await AsyncStorage.getItem('GOFUU_CART');
        if (cartAux !== null) {
          // We have data!!
         
          cartAux = JSON.parse(cartAux);
          
          return cartAux.length;
        }
       } catch (error) {
         // Error retrieving data
       }
    }
	async componentWillMount(){
	
		if(!store.getState().cartSize){
			let num = await this._getCart()
		
			store.dispatch({
	            type: 'SET_CART_SIZE',
	            payload: {
	              cartSize: num
	            }
	          })
		}	
		this._setupCart()
	}
  	orderNowOnPress(index) {
	 	this.props.navigation.navigate("Menus")
	}
	onPressAddress(){
		//openMap({ latitude: 35.2004, longitude: -80.743441 });
		showLocation({
		    latitude: 35.2004,
		    longitude: -80.743441,
		    //sourceLatitude: -8.0870631,  // optionally specify starting location for directions
		   //sourceLongitude: -34.8941619,  // not optional if sourceLatitude is specified
		    title: 'Karmale Café',  // optional
		    //googleForceLatLon: false,  // optionally force GoogleMaps to use the latlon for the query instead of the title
		    //googlePlaceId: 'ChIJGVtI4by3t4kRr51d_Qm_x58',  // optionally specify the google-place-id
		    //dialogTitle: 'This is the dialog Title', // optional (default: 'Open in Maps')
		    //dialogMessage: 'This is the amazing dialog Message', // optional (default: 'What app would you like to use?')
		    //cancelText: 'This is the cancel button text', // optional (default: 'Cancel')
		    //appsWhiteList: ['google-maps'] // optionally you can set which apps to show (default: will show all supported apps installed on device)
		    // app: 'uber'  // optionally specify specific app to use
		})
		//this.setState({isVisible:true})

	}
	render() {
    return (
    <Provider
        store={store}
    >
   <Container>
		<Header noLeft>
          <Left/>
          <Body>
            <Title>Karmale Cafe</Title>
          </Body>
          <Right />
        </Header>
		<Content>
			<View style={styles.ctnImage}>
				<Image style={styles.mainImage} source={require('../../assets/img/home.jpg')} />
			</View>
			<List>
				<ListItem onPress={() => this.orderNowOnPress() }>
					<Left>
						<Icon name="ios-restaurant" />
						<Text>Order Now</Text>
					</Left>
					<Right>
						<Icon name="arrow-forward" />
					</Right>
				</ListItem>
				<ListItem onPress={()=> Linking.openURL('https://www.facebook.com/KarmaleCafe/') }>
					<Left>
						<Icon name="logo-facebook" />
						<Text>Facebook</Text>
					</Left>
					<Right>
						<Icon name="arrow-forward" />
					</Right>
				</ListItem>
				<ListItem onPress={()=> Linking.openURL('tel:7045663077') }>
					<Left>
						<Icon name="call" />
						<Text>Call Now</Text>
					</Left>
					<Right>
						<Icon name="arrow-forward" />
					</Right>
				</ListItem>
				<ListItem onPress={()=> this.onPressAddress() }>
					<Left>
						<Icon name="locate" />
						<Text>Get Address</Text>
					</Left>
					<Right>
						<Icon name="arrow-forward" />
					</Right>
				</ListItem>
				<ListItem onPress={()=> Linking.openURL('mailto:karmale@karmalecafe.com') }>
					<Left>
						<Icon name="mail" />
						<Text>Contact Now</Text>
					</Left>
					<Right>
						<Icon name="arrow-forward" />
					</Right>
				</ListItem>
			</List>
			

				<Popup
				    isVisible={this.state.isVisible}
				    onCancelPressed={() => this.setState({ isVisible: false })}
				    onAppPressed={() => this.setState({ isVisible: false })}
				    onBackButtonPressed={() => this.setState({ isVisible: false })}
				    modalProps={{ // you can put all react-native-modal props inside.
				        animationIn: 'slideInUp'
				    }}
				    appsWhiteList={ ['apple-maps','google-maps']}
				    options={{ /* See `showLocation` method above, this accepts the same options. */ }}
				    style={{ /* Optional: you can override default style by passing your values. */ }}
				/>
      	</Content>
     </Container>
     </Provider>
    );
  }

}

const styles = StyleSheet.create({

  ctnImage: {
    backgroundColor: '#f1f1f1',
    justifyContent:'center',
    alignItems:'center',
     height:250,
  },
  mainImage:{
      width:'100%',
      resizeMode:'contain'
  }
})