# NOTE: As of this creation, R1P does NOT use new architecture.
# However, the upgrade guide https://react-native-community.github.io/upgrade-helper/?from=0.67.4&to=0.70.6 did NOT mark this as new architecture only
# So for now, leaving this file in despite usage of older architecture

cmake_minimum_required(VERSION 3.13)

# Define the library name here.
project(reponepersonal_appmodules)

# This file includes all the necessary to let you build your application with the New Architecture.
include(${REACT_ANDROID_DIR}/cmake-utils/ReactNative-application.cmake)
