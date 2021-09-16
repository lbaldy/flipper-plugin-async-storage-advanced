# `rn-flipper-async-storage-advanced`

This is a client package for the flipper-plugin-async-storage-adavanced plugin.

This package supports async-storage https://github.com/react-native-async-storage/async-storage.

It has to be installed side by site with `react-native-flipper` package.

For detailed installation instructions please refer to the main readme file.

## Installation

Obviously async-storage itself is a dependency.

Unless you already have it installed in your project, please install `react-native-flipper`

`npm i react-native-flipper --save`

Once installed you can go ahead and install the actual package.

`npm i rn-flipper-async-storage-advanced --save`

## Usage

To use this package in your project, first you need to import it:

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
          AsyncStorage.setItem('sads', 'das');
        }}>
        <Text>add</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
```

That's it, now you should be able to see your async storage keys via the `flipper-plugin-async-storage-advanced`
