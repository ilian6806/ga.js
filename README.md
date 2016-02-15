# ga.js
Platform independent library for tracking via google analytics HTTP interface

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
