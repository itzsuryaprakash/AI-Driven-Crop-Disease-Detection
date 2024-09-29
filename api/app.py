from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"], 
)

MODEL = tf.keras.models.load_model("D:/VSC/SIH/saved_models/bean.keras")
CLASS_NAMES = ["bean_angular_leaf_spot", "bean_healthy", "bean_rust"]


def read_file_as_image(data) -> np.ndarray:
    try:
        image = Image.open(BytesIO(data))
        image = np.array(image)
        return image
    except Exception as e:
        print(f"Error reading image: {e}")
        raise

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        image = read_file_as_image(await file.read())
        img_batch = np.expand_dims(image, 0)
        predictions = MODEL.predict(img_batch)
        predicted_class = CLASS_NAMES[np.argmax(predictions[0])]
        confidence = np.max(predictions[0])
        return {
            'class': predicted_class,
            'confidence': float(confidence)
        }
    except Exception as e:
        print(f"Error during prediction: {e}")
        return {"error": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host='localhost', port=8001)