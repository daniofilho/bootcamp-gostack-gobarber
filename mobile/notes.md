**Passos para instalar emulador**

https://facebook.github.io/react-native/docs/getting-started.html#android-development-environment

**SDK not found**

- Go to your React-native Project -> Android
- Create a file local.properties
- Open the file

- paste your Android SDK path like below
  in Windows sdk.dir = C:\\Users\\USERNAME\\AppData\\Local\\Android\\sdk
  in macOS sdk.dir = /Users/USERNAME/Library/Android/sdk
  in linux sdk.dir = /home/USERNAME/Android/Sdk

Replace USERNAME with your user name

Now, Run the react-native run-android in your terminal.

**Android - Emulador - /dev/kvm/ permission denied**

https://blog.chirathr.com/android/ubuntu/2018/08/13/fix-avd-error-ubuntu-18-04/

**Para roda o projeto**

`npm start` em uma aba do terminal

`react-native run-android` em outra, apenas na primeira vez

**Habilitar Live Reload**

`CTRL + M` dentro do emulador e habilite `Live Reload`

**Limpar o cache do React Native após instalar alguma dependência**

`react-native start --reset-cache`

#### Reacttotron

Ferramenta de debug:

https://github.com/infinitered/reactotron

https://github.com/infinitered/reactotron/blob/master/docs/quick-start-react-native.md

`yarn add reactotron-react-native`

Crie uma pasta `src`se não tiver e dentro dela crie uma pasta `config` e um arquivo chamado `ReactotronConfig.js`:

```javascript
import Reactotron from 'reactotron-react-native';

if (__DEV_) {
  const tron = Reactotron.configure()
    .useReactNative()
    .connect();
  console.tron = tron;

  tron.clear(); //limpa a timeline a cada novo refresh
}
```

Se estiver com Android Emulator, rode o comando abaixo para fazer o redirecionamento de portas

`adb reverse tcp:9090 tcp:9090`

#### Rotas / Navegação

`yarn add react-navigation react-navigate-gesture-handler react-native-reanimated`

No Android precisamos de um próximo passo.

Acesse: https://kmagiera.github.io/react-native-gesture-handler/docs/getting-started.html

Abra o arquivo MainActivity.java que fica em `android/app/src/main/java/com/APPNAME` e deixe ele com as linhas:

```java
package com.modulo06;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "modulo06";
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
      return new ReactActivityDelegate(this, getMainComponentName()) {
        @Override
        protected ReactRootView createRootView() {
        return new RNGestureHandlerEnabledRootView(MainActivity.this);
        }
      };
    }
}
```

Ao final, rode `yarn react-native run-android` para recompilar.

**Problema ENOSPC**

https://stackoverflow.com/questions/22475849/node-js-what-is-enospc-error-and-how-to-solve

**Ícones**

`yarn add react-native-vector-icons`

Em seguida é necessário linka-la ao projeto

`yarn link react-native-vector-icons`

Ao final, rode `yarn react-native run-android` para recompilar.

#### "Local Storage"

Por padrão o React Native não possui local storage, então usa-seoutra lib:

`yarn add @react-native-community/async-storage`

Ao final, rode `yarn react-native run-android` para recompilar. ( no iOS é `pod install`)
