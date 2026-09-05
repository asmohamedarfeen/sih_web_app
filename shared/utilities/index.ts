import { RiskLevel } from '../enums';
import { RISK_SCORE_THRESHOLDS } from '../constants';

export const calculateRiskLevel = (score: number): RiskLevel => {
  if (score >= RISK_SCORE_THRESHOLDS.CRITICAL) return RiskLevel.CRITICAL;
  if (score >= RISK_SCORE_THRESHOLDS.HIGH) return RiskLevel.HIGH;
  if (score >= RISK_SCORE_THRESHOLDS.MODERATE) return RiskLevel.MODERATE;
  return RiskLevel.LOW;
};

export const sanitizeString = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};
