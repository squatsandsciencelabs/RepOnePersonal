import UIKit
import Expo
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
// import Firebase
import RNBleManager
import react_native_nordic_dfu

@main
class AppDelegate: ExpoAppDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    // FirebaseApp.configure()
    
    RNNordicDfu.setCentralManagerGetter {
      return SwiftBleManager.getCentralManager()
    }
    // Reset manager delegate since the Nordic DFU lib "steals" control over it
    RNNordicDfu.setOnDFUComplete {
      SwiftBleManager.getCentralManager()?.delegate = SwiftBleManager.getInstance()
    }
    RNNordicDfu.setOnDFUError {
      SwiftBleManager.getCentralManager()?.delegate = SwiftBleManager.getInstance()
    }
    
    let delegate = ReactNativeDelegate()
    let factory = ExpoReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory
    bindReactNativeFactory(factory)

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "RepOnePersonal",
      in: window,
      launchOptions: launchOptions
    )

    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }
}

class ReactNativeDelegate: ExpoReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    // needed to return the correct URL for expo-dev-client.
    bridge.bundleURL ?? bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
