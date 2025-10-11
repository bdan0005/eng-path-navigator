from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType
import joblib

# Load your model and scaler
clf = joblib.load("pred_model.pkl")
scaler = joblib.load("scaler.pkl")

# Option 1: just the classifier, scale in JS
initial_type = [('float_input', FloatTensorType([None, 34]))]  # 34 features
onnx_model = convert_sklearn(clf, initial_types=initial_type)

with open("model.onnx", "wb") as f:
    f.write(onnx_model.SerializeToString())

# Option 2: include scaler in pipeline
from sklearn.pipeline import Pipeline
pipeline = Pipeline([('scaler', scaler), ('clf', clf)])
onnx_model = convert_sklearn(pipeline, initial_types=[('float_input', FloatTensorType([None, 34]))])
with open("pipeline.onnx", "wb") as f:
    f.write(onnx_model.SerializeToString())
