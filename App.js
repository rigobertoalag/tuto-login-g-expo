import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'

//web: 767879504164-ad1vn342d5og6l5bvqq8adi37d9qtobt.apps.googleusercontent.com
//ios: 767879504164-dpqaoe6i1mue7jm6bvfvk964igj80aeu.apps.googleusercontent.com
//android: 767879504164-l4hgc9p546idkag27u5i7g482gaul6k6.apps.googleusercontent.com

WebBrowser.maybeCompleteAuthSession()

export default function App() {
  const [accessToken, setAccessToken] = useState('')
  const [user, setUser] = useState('')
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: "767879504164-ad1vn342d5og6l5bvqq8adi37d9qtobt.apps.googleusercontent.com",
    iosClientId: "767879504164-dpqaoe6i1mue7jm6bvfvk964igj80aeu.apps.googleusercontent.com",
    androidClientId: "767879504164-l4hgc9p546idkag27u5i7g482gaul6k6.apps.googleusercontent.com"
  })

  useEffect(() => {
    if (response?.type === 'success') {
      setAccessToken(response.authentication.accessToken)
      accessToken && fetchUserInfo()
    }
  }, [response, accessToken])

  const fetchUserInfo = async () => {
    let response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    const userInfo = await response.json()
    setUser(userInfo)
  }

  const ShowUserInfo = () => {
    if (user) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 35, fontWeight: 'bold', marginBottom: 20 }}>Welcome</Text>
          <Image source={{ uri: user.picture }} style={{ width: 100, borderRadius: 50 }} />
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{user.name}</Text>
        </View>
      )
    }
  }

  return (
    <View style={styles.container}>
      {accessToken && <ShowUserInfo />}
      {!accessToken &&
        <>
          <Text style={{ fontSize: 35, fontWeight: 'bold' }}>Welcome</Text>
          <Text style={{ fontSize: 25, fontWeight: 'bold', marginBottom: 20, color: 'gray' }}>Please login</Text>
          <TouchableOpacity
            disabled={!request}
            onPress={() => {
              promptAsync()
            }}
          >
            <Image
              source={{ uri: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png' }}
              style={{ width: 200, height: 66 }}
              resizeMode='contain'
            />
            <Text>Click here</Text>
          </TouchableOpacity>
        </>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
