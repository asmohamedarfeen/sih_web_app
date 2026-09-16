# PSWMS Stress & Burnout Multi-Modal Dataset Dictionary

This dataset represents a standardized multi-modal defense stress telemetry environment incorporating structured HR metrics, Transformer-extracted NLP behavioral indicators, and physiological sensor telemetry.

## Feature Categories

### 1. Structured HR Features
| Feature Name | Type | Range / Values | Description |
|---|---|---|---|
| `personnel_id` | String | DEF-10000+ | Unique Personnel Identifier |
| `rank` | Categorical | Sepoy, Naik, Havildar, Subedar, Major, Colonel | Military hierarchy level |
| `rank_tier` | Integer | 1 to 4 | Hierarchical tier (1=Enlisted, 4=Senior Officer) |
| `deployment_zone` | Categorical | Peace, Field Outpost, High Altitude, CI | Operational duty environment |
| `deployment_risk_index` | Float | 0.15 to 0.90 | Risk multiplier based on deployment terrain |
| `tenure_months` | Integer | 6 to 360 | Months of active military service |
| `overtime_hours` | Float | 0.0 to 48.0 | Weekly overtime duty hours exceeding standard shift |
| `leave_deficit_days` | Integer | 0 to 45 | Earned annual leave days cancelled or deferred |
| `duty_rotation_cycle` | Integer | 1 to 4 | Operational rotation phase |
| `peer_incident_count` | Integer | 0 to 4 | Operational or interpersonal friction incidents in past year |
| `shift_irregularity_score` | Float | 0.0 to 1.0 | Schedule volatility index |

### 2. Transformer-Generated Behavioral Features
*Features derived from RoBERTa/DeBERTa embeddings of daily check-in journals and peer logs.*
| Feature Name | Type | Range | Description |
|---|---|---|---|
| `sentiment_polarity` | Float | -1.0 to +1.0 | Valence score (-1: severe distress, +1: positive motivation) |
| `negative_affect_score` | Float | 0.0 to 1.0 | NLP anxiety, agitation, and frustration density |
| `linguistic_fatigue_index` | Float | 0.0 to 1.0 | Semantic complexity decline & disjointed phrasing |
| `self_isolation_score` | Float | 0.0 to 1.0 | Frequency of withdrawal from mess hall & group activities |
| `cognitive_overload_score`| Float | 0.0 to 1.0 | Reaction latency & error correction frequency in field logs |

### 3. Physiological & Telemetry Wellness Features
*Sensor telemetry captured via defense-grade wearable smartbands.*
| Feature Name | Type | Range | Clinical Relevance |
|---|---|---|---|
| `avg_sleep_hours` | Float | 3.2 to 9.5 | Average daily sleep duration |
| `deep_sleep_ratio` | Float | 0.05 to 0.42 | Ratio of restorative Stage 3 / REM sleep |
| `hrv_rmssd` | Float | 14.0 to 98.0 ms | Root Mean Square of Successive Differences (Heart Rate Variability). Key indicator of autonomic parasympathetic recovery. |
| `resting_heart_rate` | Integer | 48 to 118 bpm | Nocturnal resting heart rate |
| `daily_step_count` | Integer | 1,200 to 24,000 | Physical activity level & mobility |
| `hydration_adherence_ratio` | Float | 0.15 to 1.0 | Adherence to recommended daily fluid intake |
| `late_night_screen_minutes` | Integer | 0 to 220 min | Screen illumination between 23:00 and 04:00 |
| `screen_time_hours` | Float | 0.8 to 8.5 hrs | Total daily off-duty screen exposure |

### 4. Ground Truth Targets
| Target Name | Type | Encoding | Purpose |
|---|---|---|---|
| `stress_probability` | Float | 0.0 to 1.0 | Calibrated continuous likelihood of clinical acute stress |
| `burnout_probability` | Float | 0.0 to 1.0 | Likelihood of chronic occupational exhaustion |
| `risk_level` | Categorical | LOW, MEDIUM, HIGH | Multi-class operational triage category |
| `welfare_risk` | Integer | 0 (Low), 1 (Medium), 2 (High) | Numerical target for ordinal classifiers |
