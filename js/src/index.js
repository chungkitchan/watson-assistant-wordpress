/* global settings */

import 'core-js/fn/symbol';
import 'core-js/fn/promise';
import 'core-js/fn/object';
import 'core-js/es6/map';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';

if (typeof localStorage !== 'undefined') {
    try {
        localStorage.setItem('localStorage', 1);
        localStorage.removeItem('localStorage');
    } catch (e) {
        Storage.prototype._setItem = Storage.prototype.setItem;
        Storage.prototype.setItem = function() {};
    }
}

function renderApp() {
  ReactDOM.render(
    <App
      title={settings.title}
      minimized={settings.minimized === 'yes'}
      isMobile={window.matchMedia("(max-width:768px)").matches}
      fullScreen={settings.fullScreen === 'yes'}
      position={settings.position}
      fabConfig={settings.fabConfig}
      callConfig={settings.callConfig}
    />,
    document.getElementById('watsonconv-chat-box')
  );
}

if (typeof(sessionStorage) !== 'undefined' &&
    sessionStorage.getItem('chat_bot_state') !== null)
{
  renderApp();
} else {
  setTimeout(renderApp, settings.delay*1000);
}
