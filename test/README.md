# Tests

Nothing automated, maybe when the design gets a bit more solidifed someone might write some.

## Manual testing...

Get the server running and then run the following curl requests against wherever you have the local API running
and something should get stored in the database. 
The first one is a CORS request that browsers will always send, it should get an HTTP 204 response
The second one is the actual tracked exception from the client, you should recieve an HTTP 200 response with no body.


```
curl 'http://localhost:3000/item/' -X OPTIONS -H 'Pragma: no-cache' -H 'Access-Control-Request-Method: POST' -H 'Origin: null' -H 'Accept-Encoding: gzip, deflate, sdch' -H 'Accept-Language: en-US,en;q=0.8' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36' -H 'Accept: */*' -H 'Cache-Control: no-cache' -H 'Connection: keep-alive' -H 'Access-Control-Request-Headers: content-type, x-rollbar-access-token' --compressed

curl 'http://localhost:3000/item/' -H 'Pragma: no-cache' -H 'Origin: null' -H 'Accept-Encoding: gzip, deflate' -H 'Accept-Language: en-US,en;q=0.8' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36' -H 'Content-Type: application/json' -H 'Accept: */*' -H 'X-Rollbar-Access-Token: POST_CLIENT_ITEM_ACCESS_TOKEN' -H 'Cache-Control: no-cache' -H 'Connection: keep-alive' --data-binary '{"access_token":"POST_CLIENT_ITEM_ACCESS_TOKEN","data":{"environment":"production","endpoint":"http://localhost:3000/","uuid":"f44e9462-06d2-4995-d193-798b60a0a984","level":"error","platform":"browser","framework":"browser-js","language":"javascript","body":{"trace":{"exception":{"class":"TestRollbarError","message":"testing window.onerror","description":"TestRollbarError: testing window.onerror"},"frames":[{"filename":"file:///tmp/rollbar/index.html","lineno":null,"method":"[anonymous]"}]}},"request":{"url":"file:///tmp/rollbar/index.html","query_string":"","user_ip":"$remote_ip"},"client":{"runtime_ms":157925891,"timestamp":1469957239,"javascript":{"browser":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36","language":"en-US","cookie_enabled":true,"screen":{"width":1280,"height":800},"plugins":[{"name":"Widevine Content Decryption Module","description":"Enables Widevine licenses for playback of HTML audio/video content. (version: 1.4.8.903)"},{"name":"Shockwave Flash","description":"Shockwave Flash 22.0 r0"},{"name":"Chrome PDF Viewer","description":""},{"name":"Native Client","description":""},{"name":"Chrome PDF Viewer","description":"Portable Document Format"}]}},"server":{},"notifier":{"name":"rollbar-browser-js","version":"1.9.1"}}}' --compressed
```