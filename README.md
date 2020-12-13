# Colonial Wars Main
This is ``colonialwars-main``, the component that makes Colonial Wars run.
This repository includes:
- A class (``ColonialwarsManager``) to manage the execution of Colonial Wars
App server and Colonial Wars Game server processes.

## Running the full app
### Running from source
To run the full Colonial Wars application from source, you will need:
- ``colonialwars-main`` (this repository), to manage the execution of the other
components;
- ``colonialwars-appserver``, to run the Colonial Wars application server that
will serve non-game server routes; and,
- ``colonialwars-gameserver``, to run the Colonial Wars game server that will
run the actual game.

Those repositories need to be put in this directory format:
```none
[project-root]/
 |-- colonialwars-appserver/
 |-- colonialwars-gameserver/
 |-- colonialwars-main/
```
Then, you must ``cd`` into ``colonialwars-main``, and run ``npm start`` (but make sure
you have all the dependencies installed first).
### Running from binaries
Current not available.

## Running the tests
Download this repository somehow, ``cd`` into the project root, and run:
```sh
npm install
npm test
```
(just like any other Node.JS project.)
