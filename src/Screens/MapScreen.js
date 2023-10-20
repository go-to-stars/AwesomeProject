import React, { useState, useEffect } from "react";
import {
  StyleSheet,  
  View,  
  Dimensions,
  
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import * as Location from "expo-location";

export default function MapScreen() {
  const navigation = useNavigation();  
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("У доступі до місцезнаходження відмовлено");
      }

      let location = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setLocation(coords);
    })();
  }, []);

  return (

    <View style={styles.container}>      
      <MapView
        style={styles.mapStyle}
        provider={PROVIDER_GOOGLE}
        region={{
          ...location,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
      >
        {location && (
          <Marker title="I am here" coordinate={location} description="Hello" />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",    
    paddingTop: 58,    
  },
  paragraph: {
    position: "absolute",
    top: 3,
    paddingHorizontal: 10,
    textAlign: "center",
    color: "#000",
    backgroundColor: "rgba(255, 255, 255, 0.50)",
    borderRadius: 5,
    zIndex: 5,
  },
  errorParagraph: {
    position: "absolute",
    top: 3,
    paddingHorizontal: 10,
    textAlign: "center",
    color: "red",
    backgroundColor: "rgba(255, 255, 255, 0.50)",
    borderRadius: 5,
    zIndex: 5,
  },
  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
