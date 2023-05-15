# Guide: General Frontend Development

## Using the API
This repository uses the `fetch` API, but we follow certain patterns to catch common errors that occur with our API. Examples of those patterns are below.

For GET requests:
```
try {
  const response = await fetch(backendURI + 'YOUR_ENDPOINT_HERE');
  const data = await response.json();
  
  // do whatever you want with the data here
} catch (error) {
  // show error message or whatever else you need
}
```

For POST requests:
```
try {
  const response = await fetch(backendURI + 'YOUR_ENDPOINT_HERE', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ YOUR_DATA_KEY_HERE: YOUR_DATA_VALUE_HERE }),
  });

  if (!response.ok) {
    throw new Error(`Status: ${response.status}`);
  }

  const data = await response.json();
  
  if (data.error) {
    throw new Error(data.error);
  }
  
  // show success message or whatever else you need
} catch (error) {
  // show error message or whatever else you need
}
```