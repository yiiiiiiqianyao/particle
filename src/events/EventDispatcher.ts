// @ts-nocheck
export class EventDispatcher {

  _listeners = null;
  initialize = function () { };
  addEventListener(type, listener) {
    if (!this._listeners) {
      this._listeners = {};
    } else {
      this.removeEventListener(type, listener);
    }

    if (!this._listeners[type]) this._listeners[type] = [];
    this._listeners[type].push(listener);

    return listener;
  }

  removeEventListener(type, listener) {
    if (!this._listeners) return;
    if (!this._listeners[type]) return;

    var arr = this._listeners[type];
    for (var i = 0, l = arr.length; i < l; i++) {
      if (arr[i] === listener) {
        if (l === 1) {
          delete this._listeners[type];
        }
        // allows for faster checks.
        else {
          arr.splice(i, 1);
        }
        break;
      }
    }
  }

  removeAllEventListeners(type) {
    if (!type) this._listeners = null;
    else if (this._listeners) delete this._listeners[type];
  }

  dispatchEvent(eventName, eventTarget) {
    var ret = false,
      listeners = this._listeners;

    if (eventName && listeners) {
      var arr = listeners[eventName];
      if (!arr) return ret;

      arr = arr.slice();
      // to avoid issues with items being removed or added during the dispatch

      var handler,
        i = arr.length;
      while (i--) {
        var handler = arr[i];
        ret = ret || handler(eventTarget);
      }
    }

    return !!ret;
  }

  hasEventListener(type) {
    var listeners = this._listeners;
    return !!(listeners && listeners[type]);
  }
}
