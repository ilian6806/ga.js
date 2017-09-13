# ga.js
Platform independent js SDK for tracking via google analytics HTTP interface

![](https://img.shields.io/gemnasium/mathiasbynens/he.svg) ![](https://img.shields.io/npm/l/express.svg)

Usage:

```javascript
ga.init({
    trackingId: 'UA-12345678-99',
    appName: 'My app',
    appVersion: '1.0.0.0'
}).trackSession(true);
```
```javascript
ga.trackView('main_view');
```
```javascript
ga.trackEvent('Event category', 'Event action');
```
