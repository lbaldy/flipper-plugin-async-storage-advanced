# `flipper-plugin-async-storage-advanced`

A client plugin for this Flipper plugin (https://www.npmjs.com/package/flipper-plugin-async-storage-advanced).

This client plugin is an AsyncStorage implementation. So if your mobile app uses Async Storage, this will work for you.

## Usage

#### Install the package

`npm i rn-flipper-async-storage-advanced --save`

Once the package is installed, simply import it

`import FlipperAsyncStorage from 'rn-flipper-async-storage-advanced';`

and include the component somewhere in you main component, example below adds it inside App.js

```
const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <FlipperAsyncStorage />  <--- This line
      <TouchableOpacity
        onPress={() => {
          AsyncStorage.setItem('testKey', 'testValue');
        }}>
        <Text>add</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
```
