import React, { useState } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  Lightbulb, 
  ArrowRight, 
  Zap,
  Target,
  RefreshCw,
  Cpu
} from 'lucide-react';
import { AIAnalysisResult } from '../types/campaign';

interface AiAdvisorCardProps {
  analysis: AIAnalysisResult;
  onRefreshAnalysis: () => void;
}

export const AiAdvisorCard: React.FC<AiAdvisorCardProps> = ({ analysis, onRefreshAnalysis }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleRefresh = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      onRefreshAnalysis();
      setIsAnalyzing(false);
    }, 450);
  };

  const getStatusBadge = () => {
    switch (analysis.trendStatus) {
      case 'positive':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <TrendingUp className="w-3.5 h-3.5" />
            Tăng Trưởng Tích Cực
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <AlertTriangle className="w-3.5 h-3.5" />
            Cảnh Báo Bão Hòa (Fatigue)
          </span>
        );
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <TrendingDown className="w-3.5 h-3.5" />
            Nguy Cơ Đốt Ngân Sách
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Vận Hành Ổn Định
          </span>
        );
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-indigo-500/30 p-6 shadow-2xl shadow-indigo-950/40">
      {/* Background ambient decorative light */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Cpu className="w-5 h-5 text-indigo-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">
                AI Growth Copilot
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Machine Analysis
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Mô hình học máy tự động chẩn đoán xu hướng và đề xuất 03 hành động thực chiến
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {getStatusBadge()}
          <button
            onClick={handleRefresh}
            disabled={isAnalyzing}
            title="Quét lại dữ liệu với AI"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 transition-all hover:scale-105 active:scale-95"
          >
            <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin text-indigo-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Trend Evaluation Callout */}
      <div className="mt-5 p-4 rounded-xl bg-slate-900/90 border border-slate-800/90">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="space-y-1.5 flex-1">
            <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              {analysis.trendTitle}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {analysis.trendSummary}
            </p>
          </div>
        </div>

        {/* Diagnostic Pills */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 mt-4 pt-3 border-t border-slate-800/60">
          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-slate-400">Chỉ số CTR (Hook Ads)</span>
              <span className={`font-bold ${
                analysis.metricsAssessment.ctrEvaluation.status === 'good' ? 'text-emerald-400' :
                analysis.metricsAssessment.ctrEvaluation.status === 'average' ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {analysis.metricsAssessment.ctrEvaluation.status === 'good' ? 'Tốt' : 
                 analysis.metricsAssessment.ctrEvaluation.status === 'average' ? 'Trung bình' : 'Kém'}
              </span>
            </div>
            <p className="text-slate-400 line-clamp-2">{analysis.metricsAssessment.ctrEvaluation.text}</p>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-slate-400">Chỉ số CPC (Đấu thầu)</span>
              <span className={`font-bold ${
                analysis.metricsAssessment.cpcEvaluation.status === 'good' ? 'text-emerald-400' :
                analysis.metricsAssessment.cpcEvaluation.status === 'average' ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {analysis.metricsAssessment.cpcEvaluation.status === 'good' ? 'Tối ưu' : 
                 analysis.metricsAssessment.cpcEvaluation.status === 'average' ? 'Chấp nhận được' : 'Đắt đỏ'}
              </span>
            </div>
            <p className="text-slate-400 line-clamp-2">{analysis.metricsAssessment.cpcEvaluation.text}</p>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-slate-400">Chỉ số CPA (Lợi nhuận đơn)</span>
              <span className={`font-bold ${
                analysis.metricsAssessment.cpaEvaluation.status === 'good' ? 'text-emerald-400' :
                analysis.metricsAssessment.cpaEvaluation.status === 'average' ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {analysis.metricsAssessment.cpaEvaluation.status === 'good' ? 'Sinh lời tốt' : 
                 analysis.metricsAssessment.cpaEvaluation.status === 'average' ? 'Biên độ mỏng' : 'Báo động'}
              </span>
            </div>
            <p className="text-slate-400 line-clamp-2">{analysis.metricsAssessment.cpaEvaluation.text}</p>
          </div>
        </div>
      </div>

      {/* 03 GỢI Ý CẢI THIỆN CHIẾN DỊCH (Requirement 4) */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3.5">
          <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            03 Gợi Ý Cải Thiện Chiến Dịch Thực Chiến:
          </h4>
          <span className="text-xs text-slate-400">Được tối ưu theo thuật toán Meta/TikTok Ads</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {analysis.recommendations.map((rec, index) => (
            <div
              key={rec.id || index}
              className="flex flex-col justify-between rounded-xl p-4 bg-slate-950/60 border border-slate-800/90 hover:border-indigo-500/40 hover:bg-slate-900/80 transition-all hover:-translate-y-0.5 group shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                    rec.category === 'Creative' ? 'bg-pink-500/15 text-pink-400 border border-pink-500/30' :
                    rec.category === 'Budget & Bid' ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30' :
                    rec.category === 'Audience' ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30' :
                    'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    #{index + 1} {rec.category}
                  </span>
                  <span className="text-[10px] font-semibold text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                    {rec.impact}
                  </span>
                </div>

                <h5 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors mb-1.5">
                  {rec.title}
                </h5>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {rec.description}
                </p>
              </div>

              <div className="pt-2.5 border-t border-slate-800/80">
                <div className="flex items-start gap-1.5 text-xs text-emerald-400">
                  <Zap className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-400" />
                  <span className="font-semibold text-slate-200">
                    Hành động: <span className="font-normal text-emerald-300">{rec.actionStep}</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
