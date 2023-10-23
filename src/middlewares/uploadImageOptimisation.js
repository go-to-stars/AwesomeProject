import * as ImageManipulator from "expo-image-manipulator";


export default async function uploadImageOptimisation(uri) {
  console.log("Uri:", uri);
  try {
    await ImageManipulator.manipulateAsync(uri, [{ resize: { height: 240 } }], {
      compress: 1,
      format: ImageManipulator.SaveFormat.JPEG,
    })
      .then((result) => {
        const resultManipulate = result.uri;
        return resultManipulate;
      })
      .catch((error) => {
        console.log("Помилка оптимізації зображення:", error.massage);
        return uri;
      });

    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { height: 240 } }],
      { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
    );
    return manipResult.uri;
  } catch (error) {
    console.error("Помилка оптимізації зображення:", error);
    return uri;
  }
}
