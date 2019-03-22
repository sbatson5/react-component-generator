# An Opinionated React Component Generator

## Helping to enforce convention within a react project

In an effort to help remove a lot of boilerplate/duplication, this CLI allows
you to generate components from the command line.
It takes care of placing components in the correct directory, adding routes to
the appropriate directory and updates our router.

To get started.

```bash
npm install -g react-component-generator
```
(this isn't published yet)

To add a component, simply use the generate command:

```bash
rcg generate component my-component
```

This will add a new component to the `/components` directory named `my-component.js`.

```javascript
import React from 'react';

export default function myComponent({}) {
  return (
    <div>
    </div>
  );
}
```

This works with nested directories.
You can also use aliased commands such `gen`, `new` or `g` for the generate command.

```bash
rcg g component navigation/sidebar/menu-items
```

`reacte-component-generator` will create the appropriate directories if they exist.

## Routes

Routes follow a similar pattern but will be put into a `routes` directory.
This is a somewhat opinionated approach, but the idea is that components used
to serve routes should be separate than traditional components.

```bash
rcg g route profile
```

This will add a new component to the `/routes` directory named `profile.js`;
This will also import and add the route to your `App.js` file.
Note: this makes the assumption you are using `react-router`.

```javascript
import React, { Component } from 'react';
import Profile from './routes/profile';
import './App.css';
import { BrowserRouter as Router, Route } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Route path="/profile" exact component={Profile} />
        </div>
      </Router>
    );
  }
}

export default App;
```

## Specifying class components

By default, `react-component-generator` adds function components, as that seems
to be the recommended pattern going forward.
However, it can generate class components by using the `--class` flag.

```bash
rcg g component my-component --class
```

Generates:
```javascript
import React, { Component } from 'react';

class MyComponent extends Component {
  render() {
    return (
      <div>
      </div>
    );
  }
}
```

This works for both routes and components.

## Deleting components

Similar to generating components, they can quickly be removed with the `delete`
command.

```bash
rcg destroy component my-component
```

This will remove any javascript file by that name in the `components` directory.
This command can be aliased to `del`, `d`, or `destroy`.

## But I Want Different Defaults

In your project, create a `.react-component-generator` file.
This is a text file that follows a JSON format and is read at runtime to find
project-specific defaults.

Currently the settings you specify:

`componentType` - this can be `class` or `function`
  * `class` will generate class-based components by default (without
    requiring the `--class flag`)
  * `function` is the default and does not need to be specified

`componentsDirectory` - indicates the directory components will be created
`routesDirectory` - indicates the directory routes will be created

```json
{
  "componentType": "class",
  "componentsDirectory": "partials",
  "routesDirectory": "pages"
}
```

## Coming soon:
Specify where the Router exists -- the assumption now is that it lives in
`src/App.js` but that may not be the case for ever project.
Specify the wrapping element that holds the routes -- the assumption is that
it is the default `div` with a class of `App` that is added by
`create-react-app`.
