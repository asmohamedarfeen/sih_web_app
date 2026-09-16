#!/usr/bin/env bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
PYTHON_BIN="/opt/anaconda3/envs/hrms-env/bin/python"

echo "=========================================================="
echo "🔍 PSWMS SHAP Decision Explainability Suite"
echo "=========================================================="

echo "1. Running TreeSHAP explanations & generating clinical dossiers..."
PYTHONPATH="$DIR/src:$(dirname "$DIR")/src" $PYTHON_BIN "$DIR/src/shap_explainer_engine.py"

echo "2. Running Explainability Benchmark (SHAP vs LIME vs Permutation vs Gain)..."
PYTHONPATH="$DIR/src:$(dirname "$DIR")/src" $PYTHON_BIN "$DIR/src/explainability_benchmark.py"

echo "3. Building & pre-rendering complete Jupyter Notebook..."
$PYTHON_BIN "$DIR/notebooks/build_shap_notebook.py"

echo ""
echo "🎉 SHAP Explainability Pipeline Completed Successfully!"
echo "   - Notebook: $DIR/notebooks/shap_explainability_analysis.ipynb"
echo "   - Report:   $DIR/reports/shap_executive_report.md"
echo "   - Visuals:  $DIR/reports/"
echo "   - Metrics:  $DIR/reports/shap_benchmark_metrics.json"
