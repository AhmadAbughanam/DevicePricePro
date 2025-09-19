# Model Card: DevicePricePro ML Model

## Model Overview

**Model Name:** DevicePricePro Price Range Classifier  
**Version:** 1.0.0  
**Date:** December 2024  
**Model Type:** Multi-class Classification  
**Framework:** LightGBM with scikit-learn preprocessing  
**File:** lgb_pipeline.pkl

## Model Description

The DevicePricePro ML model predicts device price ranges (categories) based on technical specifications. It uses a LightGBM classifier with advanced preprocessing and feature engineering to classify devices into discrete price categories.

### Model Architecture

```
Input Features → Feature Engineering → Preprocessing Pipeline → Feature Selection → LightGBM → Price Range Classification
      ↓                    ↓                    ↓                    ↓              ↓              ↓
  Raw Features         • px_area            • PowerTransformer   • SelectFromModel  • LightGBM     Price Range
  (20 features)        • ppi_proxy          • StandardScaler     • Top 50% features • 2000 trees   (0,1,2,3)
                       • mem_ratio          • Yeo-Johnson        • Median threshold  • Multiclass
                       • battery_per_wt     transformation
                       • camera_total
                       • log transforms
                       • connectivity_score
```

## Training Data

### Dataset Characteristics

| Attribute               | Value                         |
| ----------------------- | ----------------------------- |
| **Total Samples**       | Training dataset (from train.csv) |
| **Features**            | 20 input features + 8 engineered |
| **Target**              | price_range (0,1,2,3)        |
| **Model Task**          | 4-class classification       |
| **Feature Selection**   | Top 50% by LightGBM importance |

### Feature Description

**Raw Input Features:**
- `battery_power` - Battery capacity in mAh
- `blue` - Bluetooth support (0/1)
- `clock_speed` - Processor clock speed in GHz
- `dual_sim` - Dual SIM support (0/1)
- `fc` - Front camera resolution in MP
- `four_g` - 4G support (0/1)
- `int_memory` - Internal memory in GB
- `m_dep` - Mobile depth in cm
- `mobile_wt` - Mobile weight in grams
- `n_cores` - Number of processor cores
- `pc` - Primary camera resolution in MP
- `px_height` - Pixel height of screen
- `px_width` - Pixel width of screen
- `ram` - RAM in MB
- `sc_h` - Screen height in cm
- `sc_w` - Screen width in cm
- `talk_time` - Talk time in hours
- `three_g` - 3G support (0/1)
- `touch_screen` - Touch screen support (0/1)
- `wifi` - WiFi support (0/1)

**Engineered Features:**
- `px_area` = px_height × px_width (screen resolution)
- `ppi_proxy` = (px_height + px_width) / (sc_h × sc_w) (pixel density proxy)
- `mem_ratio` = int_memory / ram (memory balance ratio)
- `battery_per_wt` = battery_power / mobile_wt (battery efficiency)
- `camera_total` = fc + pc (total camera resolution)
- `log_ram`, `log_px_area`, `log_px_width`, `log_px_height`, `log_battery_power`, `log_int_memory` (log transforms)
- `connectivity_score` = sum of connectivity features (blue, four_g, three_g, wifi, touch_screen, dual_sim)

### Target Classes

| Price Range | Class | Description |
|-------------|-------|-------------|
| **0** | Low Cost | Budget devices |
| **1** | Medium Cost | Mid-range devices |
| **2** | High Cost | Premium devices |
| **3** | Very High Cost | Flagship devices |

## Model Performance

### Training Results

| Metric                        | Value   | Target    |
| ----------------------------- | ------- | --------- |
| **Out-of-Fold Accuracy**     | 91.0%   | > 90% ✓   |
| **Out-of-Fold F1 (macro)**   | 91.0%   | > 90% ✓   |

### Cross-Validation Setup
- **Method**: 5-Fold Stratified Cross-Validation
- **Random State**: 42
- **Shuffle**: True
- **Stratification**: Ensures balanced class distribution in each fold

### Model Configuration

**LightGBM Parameters:**
- `objective`: "multiclass"
- `num_class`: 4
- `n_estimators`: 2000
- `random_state`: 42
- `n_jobs`: -1 (all CPU cores)

**Preprocessing Pipeline:**
- `PowerTransformer`: Yeo-Johnson method for normality
- `StandardScaler`: Zero mean, unit variance scaling
- `SelectFromModel`: Feature selection using LightGBM importance (median threshold)

### Feature Selection Results
- **Selection Method**: LightGBM-based importance ranking
- **Threshold**: Median importance (top 50% features retained)
- **Selected Features**: Approximately 14 out of 28 total features

## Model Pipeline Components

### 1. Feature Engineering (`create_features` function)
```python
def create_features(df):
    df = df.copy()
    df["px_area"] = df["px_height"] * df["px_width"]
    df["ppi_proxy"] = (df["px_height"] + df["px_width"]) / (df["sc_h"] * df["sc_w"] + 1e-6)
    df["mem_ratio"] = df["int_memory"] / (df["ram"] + 1e-6)
    df["battery_per_wt"] = df["battery_power"] / (df["mobile_wt"] + 1e-6)
    df["camera_total"] = df["fc"] + df["pc"]
    # Log transforms for key numeric features
    for c in ["ram", "px_area", "px_width", "px_height", "battery_power", "int_memory"]:
        df[f"log_{c}"] = np.log1p(df[c].clip(lower=0))
    df["connectivity_score"] = df[["blue","four_g","three_g","wifi","touch_screen","dual_sim"]].sum(axis=1)
    df.fillna(0, inplace=True)
    return df
```

### 2. Preprocessing Pipeline
```python
preprocessor = ColumnTransformer(transformers=[
    ("num", Pipeline([
        ("pt", PowerTransformer(method="yeo-johnson")),
        ("scaler", StandardScaler())
    ]), feature_cols)
], remainder="drop")
```

### 3. Feature Selection
```python
feature_selector = SelectFromModel(
    lgb.LGBMClassifier(n_estimators=500, random_state=42),
    threshold="median"
)
```

### 4. Final Model
```python
lgb_model = lgb.LGBMClassifier(
    objective="multiclass",
    num_class=4,
    n_estimators=2000,
    random_state=42,
    n_jobs=-1
)
```

## Model Limitations

### Known Limitations

1. **Dataset-Specific Training**
   - Model trained on specific mobile device dataset format
   - Performance may vary on different device types or specifications

2. **Feature Dependencies**
   - Requires all 20 input features for optimal performance
   - Missing features filled with 0 (may affect accuracy)

3. **Classification vs Regression**
   - Predicts discrete price ranges, not exact prices
   - Cannot provide price estimates between categories

4. **Temporal Constraints**
   - Training data snapshot in time
   - Market dynamics and pricing trends not captured

### Performance Boundaries

- **Reliable Performance**: Devices with similar specifications to training data
- **Reduced Accuracy**: 
  - Devices with unusual feature combinations
  - Extreme values outside training range
  - New device categories not in training data

## Ethical Considerations

### Fairness
- Model predicts based solely on technical specifications
- No demographic or geographic profiling
- Objective feature-based classification

### Transparency
- Feature engineering process fully documented
- Feature importance analysis available
- Pipeline components clearly defined

### Privacy
- No personal data used in training or inference
- Device specifications are public technical information
- No user tracking or behavioral data

## Usage Guidelines

### Recommended Use Cases

✅ **Appropriate Uses:**
- Device price range estimation
- Market segmentation analysis
- Product positioning research
- Competitive analysis
- Educational ML demonstrations

❌ **Not Recommended:**
- Exact price determination
- Financial/investment decisions
- Legal or contractual purposes
- Real-time trading applications

### Input Data Requirements

**Required Format:**
```python
sample_input = {
    "battery_power": 1500,
    "blue": 1,
    "clock_speed": 2.5,
    "dual_sim": 1,
    "fc": 5,
    "four_g": 1,
    "int_memory": 32,
    "m_dep": 0.6,
    "mobile_wt": 150,
    "n_cores": 4,
    "pc": 13,
    "px_height": 800,
    "px_width": 1200,
    "ram": 3000,
    "sc_h": 12,
    "sc_w": 6,
    "talk_time": 15,
    "three_g": 1,
    "touch_screen": 1,
    "wifi": 1
}
```

## Technical Specifications

### Model File
- **Filename**: `lgb_pipeline.pkl`
- **Format**: Python pickle file
- **Size**: Approximately 10-50 MB
- **Dependencies**: scikit-learn, lightgbm, pandas, numpy

### System Requirements
- **Python**: 3.7+
- **LightGBM**: 3.0+
- **Scikit-learn**: 1.0+
- **Memory**: 1GB RAM minimum
- **Storage**: 100MB for model and dependencies
- **CPU**: Any modern processor
- **Inference Time**: <50ms per prediction

### Loading and Usage
```python
import pickle
import pandas as pd

# Load the pipeline
with open('lgb_pipeline.pkl', 'rb') as f:
    pipeline = pickle.load(f)

# Prepare input data
sample_df = pd.DataFrame([sample_input])
sample_df = create_features(sample_df)  # Apply feature engineering

# Make prediction
prediction = pipeline.predict(sample_df)
print(f"Predicted price range: {prediction[0]}")
```

## Monitoring and Maintenance

### Performance Monitoring
- **Accuracy Tracking**: Regular validation on new data
- **Feature Drift Detection**: Monitor input feature distributions
- **Class Balance**: Ensure predictions maintain reasonable class distribution

### Retraining Schedule
- **Model Updates**: As new device data becomes available
- **Feature Engineering**: Periodic review of engineered features
- **Hyperparameter Tuning**: Annual optimization review

### Success Metrics
- Maintain accuracy > 90%
- F1 macro score > 90%
- Balanced predictions across all price ranges
- Low prediction latency (<100ms)

## Contact Information

**Model Owner**: DevicePricePro Team  
**Repository**: https://github.com/yourusername/DevicePricePro  
**Issues**: https://github.com/yourusername/DevicePricePro/issues  
**Model Location**: `backend/models-ai/lgb_pipeline.pkl`

---

**Last Updated**: December 2024  
**Model Accuracy**: 91.0%  
**Next Review**: March 2025
