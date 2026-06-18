# IMPORTS
import pandas as pd
import numpy as np
from sklearn.tree import DecisionTreeRegressor
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split, TimeSeriesSplit, cross_val_score
from sklearn.metrics import mean_squared_error, mean_absolute_error
import matplotlib.pyplot as plt

# LOAD AND FILTER DATA
markets = ['SP500', 'SSE', 'NIKKEI225', 'FTSE100', 'DAX40']

df = pd.read_csv("Index_Levels.csv")
df['Date'] = pd.to_datetime(df['Date'])

df_filtered = df[df['Index'].isin(markets)].copy()

# CALCULATE DAILY RETURNS AND ADDITIONAL FEATURES
df_filtered['Prev_Close'] = df_filtered.groupby('Index')['Close'].shift(1)
df_filtered['Return'] = (df_filtered['Close'] - df_filtered['Prev_Close']) / df_filtered['Prev_Close']

# Opening Gap — overnight sentiment
df_filtered['Gap'] = (df_filtered['Open'] - df_filtered['Prev_Close']) / df_filtered['Prev_Close']

# Daily Range — intraday volatility
df_filtered['Range'] = (df_filtered['High'] - df_filtered['Low']) / df_filtered['Close']

# Volume Ratio — conviction behind the move
df_filtered['Vol_5day_avg'] = df_filtered.groupby('Index')['Volume'].transform(lambda x: x.rolling(5).mean())
df_filtered['VolRatio'] = df_filtered['Volume'] / df_filtered['Vol_5day_avg']

# PIVOT: ROWS = DATES, COLUMNS = INDEX FEATURES
features = ['Return', 'Gap', 'Range', 'VolRatio']
dfs = []

for feat in features:
    pivoted = df_filtered.pivot(index='Date', columns='Index', values=feat)
    pivoted.columns = [f'{col}_{feat}' for col in pivoted.columns]
    dfs.append(pivoted)

pivoted_df = pd.concat(dfs, axis=1).dropna()

# DEFINE FEATURES (X) AND TARGET (Y)
X = pivoted_df[[col for col in pivoted_df.columns if not col.startswith('SP500')]]
y = pivoted_df['SP500_Return']

# TRAIN/TEST SPLIT (NO SHUFFLE - PRESERVE TIME ORDER)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, shuffle=False
)

test_dates = y_test.index  # capture dates from the index before resetting

# 5-FOLD TIME SERIES CROSS-VALIDATION
tscv = TimeSeriesSplit(n_splits=5)

models = {
    #'Decision Tree': DecisionTreeRegressor(max_depth=5),
    'Linear Regression': LinearRegression(),
    #'Random Forest': RandomForestRegressor(n_estimators=100, max_depth=5, random_state=42)
}

for model_name, model in models.items():

    mae_scores = cross_val_score(model, X_train, y_train, cv=tscv, scoring='neg_mean_absolute_error')
    mse_scores = cross_val_score(model, X_train, y_train, cv=tscv, scoring='neg_mean_squared_error')

    print(f"\n{'='*40}")
    print(f"5-Fold Cross Validation Performance — {model_name}")
    print("(evaluated on training data only)")
    print('='*40)
    print(f"CV MAE  - Mean: {-mae_scores.mean():.6f},  Std: {mae_scores.std():.6f}")
    print(f"CV MSE  - Mean: {-mse_scores.mean():.6f},  Std: {mse_scores.std():.6f}")
    print(f"CV RMSE - Mean: {np.sqrt(-mse_scores).mean():.6f},  Std: {np.sqrt(-mse_scores).std():.6f}")

    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)

    test_mae  = mean_absolute_error(y_test, y_pred)
    test_mse  = mean_squared_error(y_test, y_pred)
    test_rmse = np.sqrt(test_mse)
    dir_acc   = np.mean(np.sign(y_pred) == np.sign(y_test))

    print(f"\n{'='*40}")
    print(f"Final Test Set Performance — {model_name}")
    print("(held-out data, never seen during training or CV)")
    print('='*40)
    print(f"Test MAE:             {test_mae:.6f}")
    print(f"Test MSE:             {test_mse:.6f}")
    print(f"Test RMSE:            {test_rmse:.6f}")
    print(f"Directional Accuracy: {dir_acc:.4f}")

    # Store RF predictions for the output table
    
    # PLOT PREDICTED VS ACTUAL FOR EACH MODEL
    plt.figure(figsize=(14, 5))
    plt.plot(test_dates, y_test.values, label='Actual Return', color='orange', alpha=0.8, linewidth=1)
    plt.plot(test_dates, y_pred, label='Predicted Return', color='blue', alpha=0.7, linewidth=1)
    plt.axhline(0, color='gray', linestyle='--', linewidth=0.8)
    plt.title(f'{model_name}: Predicted vs Actual SP500 Returns')
    plt.xlabel('Date')
    plt.ylabel('Daily Return')
    plt.legend()
    plt.tight_layout()
    plt.savefig(f'{model_name.replace(" ", "_")}_predictions.png', dpi=150)
    plt.show()
    
    if model_name == 'Random Forest':
        y_pred_rf = y_pred
    if model_name == 'Linear Regression':
        y_pred_lr = y_pred

# FINAL RESULTS TABLE — LINEAR REGRESSION
output_df = pd.DataFrame({
    'Date': test_dates,
    'Predicted Return': y_pred_lr.round(4),
    'Actual Return': y_test.values.round(4),
    'Error %': ((y_pred_lr - y_test.values) / np.abs(y_test.values).clip(min=1e-10) * 100).round(2)
})

print()
print("=" * 60)
print("SP500 PREDICTION RESULTS — LINEAR REGRESSION")
print("=" * 60)
print(output_df.to_string(index=False))
print("=" * 60)
