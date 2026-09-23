import React, { useState } from 'react';
import {
  GitFork,
  ChevronRight,
  ChevronDown,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Search,
} from 'lucide-react';

export interface UnitNode {
  id: string;
  name: string;
  level: 'CORPS' | 'DIVISION' | 'BRIGADE' | 'BATTALION' | 'COMPANY';
  commander: string;
  location: string;
  headcount: number;
  readinessPct: number;
  riskTier: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  primaryIssue?: string;
  children?: UnitNode[];
}

export const DEFENSE_UNIT_TREE_DATA: UnitNode = {
  id: 'corps-15',
  name: 'XV Corps (Chinar Corps)',
  level: 'CORPS',
  commander: 'Lt Gen A. K. Sengupta, UYSM, AVSM',
  location: 'Badami Bagh Cantonment, Srinagar (J&K)',
  headcount: 48500,
  readinessPct: 92.4,
  riskTier: 'MEDIUM',
  primaryIssue: 'Forward LOC weather & prolonged deployments',
  children: [
    {
      id: 'div-19',
      name: '19th Infantry Division (Dagger Division)',
      level: 'DIVISION',
      commander: 'Maj Gen Vikram Dev Singh',
      location: 'Baramulla Sector',
      headcount: 16200,
      readinessPct: 91.0,
      riskTier: 'MEDIUM',
      primaryIssue: 'High night sentry hours in forward areas',
      children: [
        {
          id: 'bde-161',
          name: '161 Infantry Brigade (Rampur)',
          level: 'BRIGADE',
          commander: 'Brigadier S. K. Nair',
          location: 'Rampur Garrison',
          headcount: 3600,
          readinessPct: 88.5,
          riskTier: 'HIGH',
          primaryIssue: 'Severe sleep deprivation & deferred leave buildup',
          children: [
            {
              id: 'bn-bravo',
              name: 'Bravo Battalion (2nd Rajputana Rifles)',
              level: 'BATTALION',
              commander: 'Col R. S. Rathore',
              location: 'LOC Forward Sector B-2',
              headcount: 495,
              readinessPct: 88.0,
              riskTier: 'CRITICAL',
              primaryIssue: 'Continuous watch hours (Overtime > 24h/wk)',
              children: [
                {
                  id: 'coy-a-bravo',
                  name: 'Alpha Company (A Coy)',
                  level: 'COMPANY',
                  commander: 'Maj D. P. Yadav',
                  location: 'Observation Post Siachen B-4',
                  headcount: 98,
                  readinessPct: 84.0,
                  riskTier: 'HIGH',
                  primaryIssue: 'Hypoxia strain & 8 consecutive night vigils',
                },
                {
                  id: 'coy-b-bravo',
                  name: 'Bravo Company (B Coy)',
                  level: 'COMPANY',
                  commander: 'Capt Sarah Connor',
                  location: 'Ridge Patrol Base North',
                  headcount: 101,
                  readinessPct: 89.0,
                  riskTier: 'MEDIUM',
                  primaryIssue: 'Moderate fatigue from pack transport patrols',
                },
                {
                  id: 'coy-c-bravo',
                  name: 'Charlie Company (C Coy)',
                  level: 'COMPANY',
                  commander: 'Maj Anil Kumble',
                  location: 'Tactical Forward Outpost Charlie',
                  headcount: 96,
                  readinessPct: 76.5,
                  riskTier: 'CRITICAL',
                  primaryIssue: 'Consecutive duty days: 14 without rotation',
                },
                {
                  id: 'coy-d-bravo',
                  name: 'Delta Company (D Coy)',
                  level: 'COMPANY',
                  commander: 'Capt Rameshwar Singh',
                  location: 'Forward Supply Base Delta',
                  headcount: 102,
                  readinessPct: 79.0,
                  riskTier: 'CRITICAL',
                  primaryIssue: 'Sleep deprivation (<4.1h/day wearable average)',
                },
                {
                  id: 'coy-e-bravo',
                  name: 'Echo Company (E Coy - Reserve)',
                  level: 'COMPANY',
                  commander: 'Capt Sandeep Patil',
                  location: 'Battalion Base Camp',
                  headcount: 98,
                  readinessPct: 96.0,
                  riskTier: 'LOW',
                  primaryIssue: 'SHAPE-1 Standby; fully rested',
                },
              ],
            },
            {
              id: 'bn-alpha',
              name: 'Alpha Battalion (10 Para SF)',
              level: 'BATTALION',
              commander: 'Col Ajay Varma, SM',
              location: 'Special Forces Staging Area',
              headcount: 510,
              readinessPct: 94.0,
              riskTier: 'LOW',
              primaryIssue: 'High operational tempo, optimal morale baseline',
              children: [
                {
                  id: 'coy-a-alpha',
                  name: 'Team 1 (Combat Assault)',
                  level: 'COMPANY',
                  commander: 'Maj R. N. Yadav',
                  location: 'Quick Reaction Post 1',
                  headcount: 102,
                  readinessPct: 95.0,
                  riskTier: 'LOW',
                },
                {
                  id: 'coy-b-alpha',
                  name: 'Team 2 (Airborne Recon)',
                  level: 'COMPANY',
                  commander: 'Capt Vikas Thapa',
                  location: 'Helipad Forward Base',
                  headcount: 105,
                  readinessPct: 93.0,
                  riskTier: 'LOW',
                },
              ],
            },
          ],
        },
        {
          id: 'bde-53',
          name: '53 Infantry Brigade (Uri Sector)',
          level: 'BRIGADE',
          commander: 'Brigadier Manmohan Rawat',
          location: 'Uri Sector Headquarters',
          headcount: 3800,
          readinessPct: 90.0,
          riskTier: 'MEDIUM',
          primaryIssue: 'Cross-border artillery alert readiness',
          children: [
            {
              id: 'bn-echo',
              name: 'Echo Battalion (5th Gorkha Rifles)',
              level: 'BATTALION',
              commander: 'Col B. K. Thapa',
              location: 'Uri Forward Redoubt',
              headcount: 470,
              readinessPct: 78.0,
              riskTier: 'CRITICAL',
              primaryIssue: 'Sleep deprivation & 9 consecutive high-stress shifts',
              children: [
                {
                  id: 'coy-a-echo',
                  name: 'Gorkha A Coy',
                  level: 'COMPANY',
                  commander: 'Subedar Gurpreet Singh',
                  location: 'Pass Overlook Post',
                  headcount: 94,
                  readinessPct: 74.0,
                  riskTier: 'CRITICAL',
                  primaryIssue: 'Mother hospitalized + acute vigil stress',
                },
                {
                  id: 'coy-b-echo',
                  name: 'Gorkha B Coy',
                  level: 'COMPANY',
                  commander: 'Subedar Major H. R. Joshi',
                  location: 'Bunker Complex 7',
                  headcount: 92,
                  readinessPct: 77.0,
                  riskTier: 'CRITICAL',
                  primaryIssue: 'High biometric HRV depletion observed',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'div-28',
      name: '28th Infantry Division (Kupwara)',
      level: 'DIVISION',
      commander: 'Maj Gen Pradeep Chahar',
      location: 'Kupwara High Ground',
      headcount: 15800,
      readinessPct: 93.5,
      riskTier: 'LOW',
      primaryIssue: 'Routine rotation proceeding on schedule',
      children: [
        {
          id: 'bde-68',
          name: '68 Mountain Brigade (Lolab Valley)',
          level: 'BRIGADE',
          commander: 'Brigadier K. S. Gill',
          location: 'Lolab Forward Hub',
          headcount: 3400,
          readinessPct: 94.2,
          riskTier: 'LOW',
          children: [
            {
              id: 'bn-delta',
              name: 'Delta Battalion (Madras Regiment)',
              level: 'BATTALION',
              commander: 'Col S. Ramanathan',
              location: 'Lolab Base',
              headcount: 520,
              readinessPct: 94.0,
              riskTier: 'LOW',
            },
          ],
        },
      ],
    },
  ],
};

interface UnitHierarchyTreeProps {
  onSelectUnit?: (unit: UnitNode) => void;
  selectedUnitId?: string;
}

export const UnitHierarchyTree: React.FC<UnitHierarchyTreeProps> = ({
  onSelectUnit,
  selectedUnitId,
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'corps-15': true,
    'div-19': true,
    'bde-161': true,
    'bn-bravo': true,
  });
  const [filterQuery, setFilterQuery] = useState('');
  const [activeUnit, setActiveUnit] = useState<UnitNode>(DEFENSE_UNIT_TREE_DATA);

  const toggleExpand = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  const handleUnitClick = (node: UnitNode) => {
    setActiveUnit(node);
    if (onSelectUnit) {
      onSelectUnit(node);
    }
  };

  const getTierBadge = (tier: UnitNode['riskTier']) => {
    switch (tier) {
      case 'CRITICAL':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'HIGH':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'MEDIUM':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'LOW':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  const getLevelColor = (level: UnitNode['level']) => {
    switch (level) {
      case 'CORPS':
        return 'text-accent-900 bg-accent-50 border-accent-200';
      case 'DIVISION':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'BRIGADE':
        return 'text-purple-700 bg-purple-50 border-purple-200';
      case 'BATTALION':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'COMPANY':
        return 'text-teal-700 bg-teal-50 border-teal-200';
    }
  };

  const renderTree = (node: UnitNode, depth = 0) => {
    const isExpanded = expandedNodes[node.id];
    const isSelected = (selectedUnitId || activeUnit.id) === node.id;
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} className="space-y-1">
        <div
          onClick={() => handleUnitClick(node)}
          className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all border ${
            isSelected
              ? 'bg-primary/10 border-primary text-primary font-bold shadow-xs'
              : 'bg-white hover:bg-slate-50 border-slate-200/80 text-slate-700'
          }`}
          style={{ marginLeft: `${depth * 20}px` }}
        >
          <div className="flex items-center gap-2 min-w-0">
            {hasChildren ? (
              <button
                type="button"
                onClick={(e) => toggleExpand(node.id, e)}
                className="w-5 h-5 rounded hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors shrink-0"
              >
                {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            ) : (
              <span className="w-5 h-5 flex items-center justify-center text-slate-400 shrink-0">
                &bull;
              </span>
            )}

            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border font-mono shrink-0 ${getLevelColor(node.level)}`}>
              {node.level}
            </span>

            <span className="text-xs font-bold truncate">
              {node.name}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
              {node.headcount.toLocaleString()} Troops
            </span>
            <span className="text-[10px] font-mono font-bold text-slate-900 hidden md:inline">
              {node.readinessPct}% Ready
            </span>
            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${getTierBadge(node.riskTier)}`}>
              {node.riskTier}
            </span>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="space-y-1 pl-2 border-l border-slate-200 ml-3">
            {node.children!.map((child) => renderTree(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm text-slate-800 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-accent-50 text-accent-800 border border-accent-200">
              Interactive Unit Hierarchy
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Corps &rarr; Division &rarr; Brigade &rarr; Battalion &rarr; Company
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <GitFork className="w-5 h-5 text-accent-700" />
            <span>Chain of Command &amp; Tactical Force Tree</span>
          </h2>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Navigate through operational defense echelons to inspect systemic burnout clusters, staffing strength, and company outposts.
          </p>
        </div>

        {/* Quick Search */}
        <div className="relative self-start sm:self-auto min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search echelon / unit..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Main Grid: Tree Browser on Left, Detailed Unit Dossier on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Tree (7 cols) */}
        <div className="lg:col-span-7 space-y-2 max-h-[620px] overflow-y-auto pr-2 custom-scrollbar">
          {renderTree(DEFENSE_UNIT_TREE_DATA)}
        </div>

        {/* Right Column: Selected Unit Strategic Breakdown (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-50/70 border border-slate-200 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border font-mono ${getLevelColor(activeUnit.level)}`}>
                    {activeUnit.level} ECHELON
                  </span>
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${getTierBadge(activeUnit.riskTier)}`}>
                    {activeUnit.riskTier} RISK
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900 mt-1.5 leading-tight">
                  {activeUnit.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{activeUnit.location}</span>
                </p>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black font-mono text-primary block">
                  {activeUnit.readinessPct}%
                </span>
                <span className="text-[9px] uppercase font-bold text-slate-500">Readiness Index</span>
              </div>
            </div>

            {/* Officer & Personnel Metrics */}
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Commanding Officer:</span>
                <span className="font-bold text-slate-900">{activeUnit.commander}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Active Personnel Strength:</span>
                <span className="font-mono font-bold text-accent-700">{activeUnit.headcount.toLocaleString()} Troops</span>
              </div>
            </div>

            {/* Primary Stress Vector */}
            {activeUnit.primaryIssue && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs space-y-1">
                <div className="text-[10px] font-extrabold uppercase text-rose-700 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Primary Stress &amp; Operational Friction Point</span>
                </div>
                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  {activeUnit.primaryIssue}
                </p>
              </div>
            )}

            {/* Children count summary */}
            {activeUnit.children && activeUnit.children.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                  Subordinate Formations ({activeUnit.children.length})
                </span>
                <div className="space-y-1.5">
                  {activeUnit.children.map((child) => (
                    <div
                      key={child.id}
                      onClick={() => handleUnitClick(child)}
                      className="p-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-xs cursor-pointer transition-colors"
                    >
                      <span className="font-semibold text-slate-800">{child.name}</span>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${getTierBadge(child.riskTier)}`}>
                        {child.readinessPct}% &bull; {child.riskTier}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5 text-primary font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Synced with Defense Manpower Database</span>
            </span>
            <span className="font-mono text-accent-700 font-bold">MHA Echelon Standard</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitHierarchyTree;
