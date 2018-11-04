import { NavigationActions, StackActions } from 'react-navigation';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function dispatch(action) {
  _navigator.dispatch(action);
}

function navigate(routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    })
  );
}

function getActiveScreen() {
  const switchIndex = _navigator.state.nav.index;
  const switchScreen = _navigator.state.nav.routes[switchIndex];
  const stackIndex = switchScreen.index;
  const stackScreen = switchScreen.routes[stackIndex];
  const activeIndex = stackScreen.index;
  const activeScreen = stackScreen.routes[activeIndex];
}

function push(routeName, params) {
  _navigator.dispatch(
    StackActions.push({
      routeName,
      params,
    })
  );
}

export default {
  dispatch,
  getActiveScreen,
  navigate,
  push,
  setTopLevelNavigator,
};