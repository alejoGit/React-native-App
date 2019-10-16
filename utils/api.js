const BASE_API = 'https://gofuu.net/api/v1/';

class Api {
  async getFullMenus(id) {
    const query = await fetch(`${BASE_API}location/${id}/full-menus`);
    const  data = await query.json();
    return data;
  }

  async checkOrderAvailability(id) {
    const query = await fetch(`${BASE_API}check-order-availability/${id}/`);
    const  data = await query.json();
    return data;
  }

  async getHours(id,date) {
   
    const query = await fetch(`${BASE_API}day-hours`, {
	  method: 'POST',
	  headers: {
	    Accept: 'application/json',
	    'Content-Type': 'application/json',
	  },
	  body: JSON.stringify({
	    location_id: id,
	    day: date,
	  }),
	});
	
	const  data = await query.json();

    return data;
  }

  async sendOrder(postData) {
   
    const query = await fetch(`${BASE_API}create/order`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
  });
  
  const  data = await query.json();

    return data;
  }
  
}

export default new Api();
