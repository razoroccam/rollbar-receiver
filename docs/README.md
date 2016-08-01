# Design docs / notes

There is an example integration inside `./test-page.html` which should mostly work at send exceptions/etc 
to a locally running copy of this application. (you'll need to use the chrome console to create errors etc)

## Example "exception" JSON

This is a typical request body as created by the rollbar JS client

```
{
  "access_token": "POST_CLIENT_ITEM_ACCESS_TOKEN",
  "data": {
    "environment": "production",
    "endpoint": "http://localhost:3000/",
    "uuid": "64551860-0968-4a09-e5c1-7b2cb57dd10c",
    "level": "error",
    "platform": "browser",
    "framework": "browser-js",
    "language": "javascript",
    "body": {
      "trace": {
        "exception": {
          "class": "TestRollbarError",
          "message": "testing window.onerror",
          "description": "TestRollbarError: testing window.onerror"
        },
        "frames": [
          {
            "filename": "file:///tmp/rollbar/index.html",
            "lineno": null,
            "method": "[anonymous]"
          }
        ]
      }
    },
    "request": {
      "url": "file:///tmp/rollbar/index.html",
      "query_string": "",
      "user_ip": "$remote_ip"
    },
    "client": {
      "runtime_ms": 3665,
      "timestamp": 1469715631,
      "javascript": {
        "browser": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36",
        "language": "en-US",
        "cookie_enabled": true,
        "screen": {
          "width": 1280,
          "height": 800
        },
        "plugins": [
          {
            "name": "Widevine Content Decryption Module",
            "description": "Enables Widevine licenses for playback of HTML audio/video content. (version: 1.4.8.903)"
          },
          {
            "name": "Shockwave Flash",
            "description": "Shockwave Flash 22.0 r0"
          },
          {
            "name": "Chrome PDF Viewer",
            "description": ""
          },
          {
            "name": "Native Client",
            "description": ""
          },
          {
            "name": "Chrome PDF Viewer",
            "description": "Portable Document Format"
          }
        ]
      }
    },
    "server": {},
    "notifier": {
      "name": "rollbar-browser-js",
      "version": "1.9.1"
    }
  }
}
```