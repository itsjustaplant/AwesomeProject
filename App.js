import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, Pressable,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import * as Camera from 'expo-camera';

import axios from 'axios';

import CameraIcon from './components/CameraIcon';
import FileIcon from './components/FileIcon';

export default function App() {
  const [volume, setVolume] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fafafa',
      alignItems: 'center',
      justifyContent: 'center',
    },
    button: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      width: 180,
      paddingVertical: 12,
      borderRadius: 8,
      marginBottom: 12,
      backgroundColor: '#222222',
    },
    buttonText: {
      color: '#fafafa',
      fontSize: 16,
    },
    result: {
      width: 180,
      textAlign: 'center',
      marginTop: 32,
      fontSize: 16,
      color: '#222222',
    },
  });

  useEffect(() => {
    const getPermissionAsync = async () => {
      await Camera.requestCameraPermissionsAsync();
    };

    getPermissionAsync();
  }, []);

  const makeRequest = async (base64) => {
    try {
      setIsLoading(true);
      const res = await axios.post(
        'https://justaplant.dev/capstone/api/uploadm',
        { file: base64 },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      setVolume(res.data?.volume);
    } catch (e) {
      console.log(e);
      setVolume(0);
    } finally {
      setIsLoading(false);
    }
  };
  const handleCameraTake = async () => {
    const tempFile = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
      base64: true,
    });
    if (tempFile.assets) {
      makeRequest(tempFile.assets[0].base64);
    }
  };

  const handleDocumentPick = async () => {
    const tempFile = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
      base64: true,
    });
    if (tempFile.assets) {
      makeRequest(tempFile.base64);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={handleCameraTake} style={styles.button}>
        <Text style={styles.buttonText}>
          Take a Picture
        </Text>
        <CameraIcon />
      </Pressable>
      <Pressable onPress={handleDocumentPick} style={styles.button} color="#fafafa">
        <Text style={styles.buttonText}>
          Pick a File
        </Text>
        <FileIcon />
      </Pressable>
      <Text style={styles.result}>
        {(volume || volume === 0) && !isLoading ? `The result is ${volume}ml` : ''}
        {isLoading && 'Loading'}
      </Text>
    </View>
  );
}
