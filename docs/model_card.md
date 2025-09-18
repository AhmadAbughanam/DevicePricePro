# Model Card: DevicePricePro ML Model

## Model Overview

**Model Name:** DevicePricePro Price Predictor  
**Version:** 1.0.0  
**Date:** September 2025  
**Model Type:** Regression (Ensemble)  
**Framework:** Scikit-learn

## Model Description

The DevicePricePro ML model predicts device prices based on technical specifications and market characteristics. It uses an ensemble approach combining multiple algorithms to achieve optimal prediction accuracy across different device categories.

### Model Architecture

```
Input Features → Feature Engineering → Preprocessing Pipeline → Ensemble Model → Price Prediction
      ↓                    ↓                    ↓                    ↓              ↓
  • Brand              • Encoding         • Standard Scaler    • Random Forest   Final Price
  • Specs              • Feature Eng.     • Label Encoder      • Gradient Boost   ($USD)
  • Market Data        • Missing Values   • Outlier Handling   • Linear Reg.
```

## Training Data

### Dataset Characteristics

| Attribute               | Value                         |
| ----------------------- | ----------------------------- |
| **Total Samples**       | 15,847 devices                |
| **Features**            | 12 input features             |
| **Target**              | Price in USD                  |
| **Date Range**          | 2018-2025                     |
| **Device Types**        | Smartphones, Tablets, Laptops |
| **Geographic Coverage** | Global markets                |

### Feature Description

**Categorical Features:**

- `brand` - Device manufacturer (Apple, Samsung, Google, etc.)
- `model_name` - Specific device model
- `operating_system` - OS type (iOS, Android, Windows, etc.)
- `connectivity` - Network capabilities (4G, 5G, WiFi-only)
- `storage_type` - Storage technology (SSD, eMMC, UFS)
- `color` - Device color variant

**Numerical Features:**

- `screen_size` - Display size in inches (3.5 - 17.3)
- `ram_gb` - RAM capacity in GB (1 - 64)
- `storage_gb` - Storage capacity in GB (16 - 2048)
- `battery_mah` - Battery capacity in mAh (500 - 10000)
- `camera_mp` - Primary camera resolution in MP (2 - 108)
- `weight_g` - Device weight in grams (50 - 3000)
- `age_years` - Years since device release (0 - 7)

### Data Sources

1. **Manufacturer Specifications** (60%)

   - Official product pages
   - Technical documentation
   - Press releases

2. **Retail Pricing Data** (25%)

   - E-commerce platforms
   - Carrier pricing
   - Regional market data

3. **Market Research** (15%)
   - Industry reports
   - Analyst predictions
   - Historical pricing trends

### Data Quality

- **Missing Values**: <2% across all features
- **Outliers**: Handled using IQR method
- **Data Validation**: Automated consistency checks
- **Update Frequency**: Monthly refreshes

## Model Performance

### Training Results

| Metric                             | Value   | Benchmark |
| ---------------------------------- | ------- | --------- |
| **Mean Absolute Error (MAE)**      | $89.32  | < $100 ✓  |
| **Root Mean Square Error (RMSE)**  | $156.21 | < $200 ✓  |
| **R² Score**                       | 0.874   | > 0.85 ✓  |
| **Mean Absolute Percentage Error** | 8.9%    | < 10% ✓   |

### Cross-Validation Results (5-fold)

| Fold     | MAE        | RMSE        | R²        |
| -------- | ---------- | ----------- | --------- |
| 1        | $87.45     | $152.31     | 0.879     |
| 2        | $91.23     | $158.67     | 0.871     |
| 3        | $88.91     | $155.43     | 0.876     |
| 4        | $89.87     | $157.89     | 0.872     |
| 5        | $88.14     | $156.75     | 0.875     |
| **Mean** | $89.12\*\* | **$156.21** | **0.874** |

### Performance by Device Category

| Category        | Samples | MAE     | R²    | Notes               |
| --------------- | ------- | ------- | ----- | ------------------- |
| **Smartphones** | 8,945   | $78.23  | 0.891 | Best performance    |
| **Tablets**     | 3,124   | $94.67  | 0.856 | Good performance    |
| **Laptops**     | 2,891   | $142.34 | 0.834 | More variation      |
| **Wearables**   | 887     | $45.12  | 0.923 | Limited price range |

### Feature Importance (SHAP Values)

| Rank | Feature            | Importance | Impact                        |
| ---- | ------------------ | ---------- | ----------------------------- |
| 1    | `brand`            | 0.284      | Premium brands add $200-500   |
| 2    | `ram_gb`           | 0.192      | Each GB adds ~$15-25          |
| 3    | `storage_gb`       | 0.168      | Each GB adds ~$0.80-1.20      |
| 4    | `screen_size`      | 0.143      | Larger screens increase price |
| 5    | `age_years`        | 0.127      | Depreciation ~15% per year    |
| 6    | `operating_system` | 0.086      | iOS premium, Android varied   |

## Model Limitations

### Known Limitations

1. **Geographic Pricing Variations**

   - Model trained on global average prices
   - Local market conditions not fully captured
   - Currency fluctuation effects not modeled

2. **Seasonal Pricing Effects**

   - Launch pricing vs. mature pricing
   - Holiday season adjustments
   - End-of-lifecycle discounting

3. **Limited Feature Coverage**

   - Display quality metrics not included
   - Build quality/materials not quantified
   - Software/ecosystem value not captured

4. **Temporal Constraints**
   - Training data bias toward recent devices
   - Older devices may have reduced accuracy
   - Future market shifts not predicted

### Performance Boundaries

- **Reliable Range**: $50 - $2,000 USD
- **Accuracy Degrades**:
  - Ultra-premium devices (>$2,000)
  - Very old devices (>5 years)
  - Niche/specialized devices
  - Limited edition variants

### Bias Considerations

1. **Brand Bias**: Premium brands may be over-represented
2. **Market Bias**: Western market pricing emphasis
3. **Recency Bias**: Recent devices better represented
4. **Availability Bias**: Popular models over-sampled

## Ethical Considerations

### Fairness

- Model doesn't discriminate based on protected characteristics
- Price predictions based solely on technical specifications
- No demographic or geographic profiling

### Transparency

- Feature importance clearly documented
- SHAP explanations available for all predictions
- Model decisions fully interpretable

### Privacy

- No personal data used in training or inference
- Device specifications are public information
- No user tracking or behavioral data

## Usage Guidelines

### Recommended Use Cases

✅ **Appropriate Uses:**

- Market research and competitive analysis
- Pricing strategy development
- Insurance valuations
- Resale price estimation
- Product positioning analysis

❌ **Not Recommended:**

- Legal/contractual price determinations
- Individual purchase decisions without verification
- Real-time trading/arbitrage
- Warranty or insurance claims

### Implementation Best Practices

1. **Validation**: Always validate predictions with market data
2. **Context**: Consider local market conditions
3. **Updates**: Regularly retrain with fresh data
4. **Monitoring**: Track prediction accuracy over time
5. **Fallbacks**: Have manual review processes for edge cases

## Technical Specifications

### Model Pipeline

```python
Pipeline([
    ('preprocessor', ColumnTransformer([
        ('num', StandardScaler(), numerical_features),
        ('cat', OneHotEncoder(drop='first'), categorical_features)
    ])),
    ('ensemble', VotingRegressor([
        ('rf', RandomForestRegressor(n_estimators=100)),
        ('gb', GradientBoostingRegressor(n_estimators=100)),
        ('lr', LinearRegression())
    ]))
])
```

### System Requirements

- **Python**: 3.9+
- **Scikit-learn**: 1.3.0+
- **Memory**: 2GB RAM minimum
- **Storage**: 50MB for model file
- **CPU**: Any modern processor
- **Inference Time**: <100ms per prediction

### Model Versioning

| Version | Date      | Changes             | Performance  |
| ------- | --------- | ------------------- | ------------ |
| 1.0.0   | Sept 2025 | Initial release     | MAE: $89.32  |
| 0.9.0   | Aug 2025  | Beta testing        | MAE: $95.41  |
| 0.8.0   | July 2025 | Feature engineering | MAE: $102.15 |

## Monitoring and Maintenance

### Performance Monitoring

- **Accuracy Tracking**: Monthly MAE calculation
- **Drift Detection**: Feature distribution monitoring
- **Prediction Intervals**: Confidence score tracking
- **Error Analysis**: Regular residual analysis

### Retraining Schedule

- **Minor Updates**: Quarterly (new devices)
- **Major Updates**: Annually (architecture changes)
- **Emergency Updates**: As needed (significant drift)

### Success Metrics

- Maintain MAE < $100
- R² score > 0.85
- 95% of predictions within 20% of actual
- User satisfaction > 4.0/5.0

## Contact Information

**Model Owner**: DevicePricePro Team  
**Email**: ml-team@devicepricepro.com  
**Documentation**: https://docs.devicepricepro.com  
**Issues**: https://github.com/devicepricepro/issues

**Last Updated**: September 16, 2025  
**Next Review**: December 2025
