async function onTrack(event, settings) {
	try {
		let api_key = '';
		if (
			event.properties.shopId === 'philipsonwine.test' ||
			event.properties.ShopId === 'philipsonwine.test'
		) {
			api_key = 'RjlNRzh1UXlTQkhqWWFNTk5CV3ptYlhTc3N4TThFUlg=';
		} else {
			api_key = 'RkhDUTVFZ21pbHJUczJ2eXlvUVNpUG9PaThtTE9EVWc=';
		} 

		console.log('Using API key:', api_key);

		const map_list = {
			W3HXiX: 'Tilbudsmail (DK)',
			WZRhmw: 'Primeur (DK)',
			WyFZu3: 'Fine Wine (DK)',
			UfTjQQ: 'En gang om ugen (DK)',
			XyQjF7: 'Spiritus (DK)',
			TnWzSk: 'Tilbudsmail (SE)',
			UdQpnC: 'Primeur (SE)',
			TKuBqr: 'Fine Wine (SE)',
			UkuDSx: 'En gang om ugen (SE)',
			Wv476Z: 'Tilbudsmail (TEST)',
			Sv44m5: 'Primeur (TEST)',
			YfsYsX: 'Fine Wine (TEST)',
			WSnihL: 'En gang om ugen (TEST)',
			THsfMc: 'Wineshop'
		};
        // Create my map
		const myMap = createMap(map_list);
		const listName = myMap.get(event.properties.listId);


		const segmentEndpoint = 'https://events.eu1.segmentapis.com/v1/identify';
		const segmentHeaders = {
			Authorization: `Basic ${api_key}`,
			'Content-Type': 'application/json'
		};

		let traitValue = '';
		let body; // Declare the body variable here

switch (event.event) {
    case 'Subscribed to list':
    case 'Subscribed to List':
        traitValue = 'True';
        body = {
            userId: event.userId || null,
            anonymousId: event.anonymousId,
            traits: {
                [listName]: traitValue,
                [event.properties.listId]: traitValue,
                email: event.properties.email,
                Consent: 'True',
                consent_audience: true
            }
        };
        break;
    case 'Unsubscribed from list':
    case 'Unsubscribed from List':
        traitValue = 'False';
        body = {
            userId: event.userId || null,
            anonymousId: event.anonymousId,
            traits: {
                [listName]: traitValue,
                [event.properties.listId]: traitValue,
                email: event.properties.email
            }
        };
        break;
    default:
        console.log("Event doesn't match criteria:", event.event);
        return;
}

		const response = await fetch(segmentEndpoint, {
			method: 'POST',
			headers: segmentHeaders,
			body: JSON.stringify(body)
		});

		if (response.status === 200) {
			console.log('Segment POST request successful!');
			console.log(body);
			const responseBody = await response.json();
			console.log(
				`Updated user to ${
					traitValue === 'True' ? 'subscribed' : 'unsubscribed'
				}`
			);
		} else {
			console.log(
				'Segment POST request failed with status code:',
				response.status
			);
			const responseBody = await response.json();
			console.log('Response:', responseBody);
		}
	} catch (error) {
		console.log('Error:', error.message);
	}
}


// Create a map function
function createMap(map_list) {
	const map = new Map();
	for (const key in map_list) {
		map.set(key, map_list[key]);
	}
	return map;
}
