async function onTrack(event, settings) {
    api_key = await getApiCredentials(event);
    await subscribeToList(event, api_key);
    console.log("User added to list and event created");
}

async function getApiCredentials(event) {
    switch (true) {
        case (
            event.properties.AreaId === '21' ||
            event.properties.areaId === '21' ||
            event.properties.AreaId === 21 ||
            event.properties.areaId === 21
        ):
            api_key = 'pk_ea49c255d8d685836ca7a77281e01b328c';
            break;
        case (
            event.properties.AreaId === '24' ||
            event.properties.areaId === '24' ||
            event.properties.AreaId === 24 ||
            event.properties.areaId === 24
        ):
            api_key = 'pk_d5c9650b5af7004e8d767c131932d8cd63';
            break;
        case (
            event.properties.AreaId === '30' ||
            event.properties.areaId === '30' ||
            event.properties.AreaId === 30 ||
            event.properties.areaId === 30
        ):
            api_key = 'pk_39c1ec4dd57c1a24233c59fc79f83208bb';
            break;
        case (
            event.properties.shopId === 'philipsonwine.test' ||
            event.properties.shopId === 'wineshop.test'
        ):
            api_key = 'pk_5af4b342a8fb14994020f017aaa503a7b7';
            break;
        default:
            api_key = 'no_api';
    }

    //console.log(api_key); // for debugging
    //console.log(headers); // for debugging
    return api_key;

}

async function subscribeToList(event, api_key){
    const url = 'https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/';
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        revision: '2024-02-15',
        'content-type': 'application/json',
        Authorization: `Klaviyo-API-Key ${api_key}`,
    },
      body: JSON.stringify({
        data: {
          type: 'profile-subscription-bulk-create-job',
          attributes: {
            custom_source: event.properties.origin,
            profiles: {
              data: [
                {
                  type: 'profile',
                  attributes: {
                    email: event.properties.email,
                    phone_number: event.properties.mobile,
                    subscriptions: {
                      email: {marketing: {consent: 'SUBSCRIBED'}}
                    }
                  }
                }
              ]
            }
          },
          relationships: {list: {data: {type: 'list', id: event.properties.listId}}}
        }
      })
    };
    fetch(url, options)
}
    const event = {
        "anonymousId": "test123zzz45@pw.dk",
        "context": {
          "library": {
            "name": "Analytics.NET",
            "version": "3.8.1"
          }
        },
        "event": "Subscribed to list",
        "integrations": {},
        "messageId": "1ea56a4f-2754-4511-a0f7-9b93d666a273",
        "originalTimestamp": "2024-04-23T15:31:48.5271722+02:00",
        "properties": {
          "AreaId": "21",
          "ShopId": "SHOP1",
          "device": "Desktop",
          "email": "123test123zzz45@pw.dk",
          "listId": "W3HXiX",
          "name": "test123",
          "origin": "WebsiteSidemenuSignup",
          "url": "https://philipsonwine.com/"
        },
        "receivedAt": "2024-04-23T13:31:59.693Z",
        "sentAt": "2024-04-23T13:31:58.465Z",
        "timestamp": "2024-04-23T13:31:49.754Z",
        "type": "track",
        "userId": null,
        "writeKey": "REDACTED"
      }
      

onTrack(event, {});
