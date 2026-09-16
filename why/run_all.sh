#!/usr/bin/env bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
PYTHON_BIN="/opt/anaconda3/envs/hrms-env/bin/python"

echo "=========================================================="
echo "🛡️ PSWMS XGBoost Stress & Burnout Benchmarking Suite"
echo "=========================================================="

echo "1. Downloading benchmarks & generating multi-modal defense dataset..."
$PYTHON_BIN "$DIR/data/download_external_data.py"

echo "2. Training models & executing multi-model benchmarks..."
PYTHONPATH="$DIR/src" $PYTHON_BIN "$DIR/src/benchmark_engine.py"

echo "3. Generating and executing pre-rendered Jupyter Notebook..."
$PYTHON_BIN "$DIR/notebooks/build_notebook.py"

echo ""
echo "🎉 Complete Pipeline Executed Successfully!"
echo "   - Notebook: $DIR/notebooks/stress_burnout_xgboost_benchmark.ipynb"
echo "   - Report:   $DIR/reports/benchmark_report.md"
echo "   - Visuals:  $DIR/reports/"
echo "   - Models:   $DIR/models/"
