import { getAvailableYears } from '../config/fiscal-years';
import { getPeriodRange } from '../logic/fiscal-utils';

export default function MetricCards({ 
  fiscalData, year, employees, totalUtilidad, mode, 
  onOpenUtilities, onUpdateFiscalData, fiscalYear, setFiscalYear,
  region, setRegion
}) {
  const headcount = employees?.length || 0;
  const range = getPeriodRange(mode, fiscalYear, region);

  const formatDateLabel = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T00:00:00'); // Ensure local timezone
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${date.getDate().toString().padStart(2, '0')} ${months[date.getMonth()]}`;
  };
  
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {fiscalData.isUnknown ? (
        <EditableCard 
          title={`SBU ${fiscalYear}`} 
          icon="payments" 
          fiscalData={fiscalData} 
          subtitle={range.label} 
          onChange={onUpdateFiscalData}
          periodSelector={
            <div className="flex flex-col gap-2 items-end">
              <PeriodSelector value={fiscalYear} onChange={setFiscalYear} />
              {mode === 'decimo4' && <RegionToggle value={region} onChange={setRegion} />}
            </div>
          }
          range={range}
          formatDateLabel={formatDateLabel}
        />
      ) : (
        <Card 
          title={`SBU ${fiscalYear}`} 
          icon="payments" 
          value={`$${fiscalData.sbu?.toFixed(2) || '0.00'}`} 
          subtitle={range.label} 
          periodSelector={
            <div className="flex flex-col gap-2 items-end">
              <PeriodSelector value={fiscalYear} onChange={setFiscalYear} />
              {mode === 'decimo4' && <RegionToggle value={region} onChange={setRegion} />}
            </div>
          }
          range={range}
          formatDateLabel={formatDateLabel}
        />
      )}
      
      {mode === 'utilidades' ? (
        <Card 
          title="Utilidades a Repartir" 
          icon="account_balance_wallet" 
          value={`$${totalUtilidad.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          subtitle="Haz clic para calcular participación 15%"
          onClick={onOpenUtilities}
          interactive
          extra={
            <div className="flex gap-3 mt-1">
              <span className="text-[10px] text-slate-500"><span className="font-bold">10%:</span> ${(totalUtilidad * 0.1).toLocaleString()}</span>
              <span className="text-[10px] text-slate-500"><span className="font-bold">5%:</span> ${(totalUtilidad * 0.05).toLocaleString()}</span>
            </div>
          }
        />
      ) : (
        <Card 
          title="Proyección Anual" 
          icon="trending_up" 
          value="$--" 
          subtitle="Cálculo basado en ingresos actuales" 
        />
      )}
      
      <Card 
        title="Nómina Activa" 
        icon="groups" 
        value={headcount} 
        unit="empleados"
        extra={
          <div className="w-full bg-slate-100 h-1 rounded-full mt-3">
            <div className="bg-primary h-1 rounded-full transition-all duration-1000" style={{ width: '100%' }}></div>
          </div>
        }
      />
    </section>
  );
}

function RegionToggle({ value, onChange }) {
  return (
    <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
      <button 
        onClick={() => onChange('sierra')}
        className={`px-2 py-0.5 rounded-md text-[9px] font-black transition-all ${
          value === 'sierra' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        SIERRA/AMAZ
      </button>
      <button 
        onClick={() => onChange('costa')}
        className={`px-2 py-0.5 rounded-md text-[9px] font-black transition-all ${
          value === 'costa' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        COSTA/GALAP
      </button>
    </div>
  );
}

function PeriodSelector({ value, onChange }) {
  const years = getAvailableYears();
  
  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-slate-100/80 border border-slate-200 rounded-lg group-hover:bg-white transition-colors">
      <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Periodo</span>
      <select 
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="bg-transparent border-none text-[13px] font-black focus:ring-0 p-0 pr-6 text-primary cursor-pointer h-5 leading-none"
      >
        {years.map(y => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </div>
  );
}

function Card({ title, icon, value, subtitle, unit, extra, onClick, interactive, periodSelector, range, formatDateLabel }) {
  return (
    <div 
      onClick={onClick}
      className={`bg-white p-4 rounded-lg border border-slate-200 shadow-sm transition-all group relative overflow-hidden ${
        interactive ? 'cursor-pointer hover:shadow-md hover:border-primary/30' : ''
      }`}
    >
      <div className="flex justify-between items-start mb-0.5 h-12">
        <div className="flex flex-col">
          <h3 className={`headline-font text-[11px] font-bold uppercase tracking-wider ${
            interactive ? 'text-primary' : 'text-on-surface-variant'
          }`}>{title}</h3>
          <span className="text-[10px] text-slate-400 font-medium">{subtitle}</span>
        </div>
        
        {periodSelector ? (
          <div onClick={(e) => e.stopPropagation()}>{periodSelector}</div>
        ) : (
          <div className="bg-slate-50 p-2 rounded-full">
            <span className={`material-symbols-outlined text-sm ${
              interactive ? 'text-primary' : 'text-slate-400'
            }`}>{icon}</span>
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2 mt-2">
        <div className="text-2xl font-bold headline-font text-on-surface">
          {value} {unit && <span className="text-sm font-normal text-slate-400">{unit}</span>}
        </div>
      </div>

      {range && (
        <div className="mt-3 py-1.5 px-3 bg-slate-50 rounded-lg flex items-center justify-between border border-slate-100">
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Desde</span>
            <span className="text-[10px] font-bold text-slate-600">{formatDateLabel(range.start)} {new Date(range.start + 'T00:00:00').getFullYear()}</span>
          </div>
          <div className="h-4 w-px bg-slate-200"></div>
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Hasta</span>
            <span className="text-[10px] font-bold text-slate-600">{formatDateLabel(range.end)} {new Date(range.end + 'T00:00:00').getFullYear()}</span>
          </div>
        </div>
      )}
      
      {extra}
    </div>
  );
}

function EditableCard({ title, icon, fiscalData, subtitle, onChange, periodSelector, range, formatDateLabel }) {
  return (
    <div className="bg-white p-4 rounded-lg border border-amber-200 shadow-sm hover:shadow-md transition-shadow group ring-2 ring-amber-50 ring-offset-2 relative overflow-hidden">
      <div className="flex justify-between items-start mb-0.5 h-12">
        <div className="flex flex-col">
          <h3 className="headline-font text-[11px] font-bold text-amber-600 uppercase tracking-wider">{title}</h3>
          <span className="text-[10px] text-amber-500/70 font-medium">{subtitle}</span>
        </div>
        {periodSelector && (
          <div onClick={(e) => e.stopPropagation()}>{periodSelector}</div>
        )}
      </div>
      <div className="space-y-3 mt-2">
        <div>
          <label className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter block mb-0.5">SBU (Sueldo Básico)</label>
          <div className="flex items-center gap-1">
            <span className="text-xl font-bold headline-font text-on-surface">$</span>
            <input 
              type="number"
              value={fiscalData.sbu || ''}
              onChange={(e) => onChange({ sbu: parseFloat(e.target.value) || 0 })}
              className="text-xl font-bold headline-font text-on-surface bg-amber-50/50 focus:bg-white rounded-lg px-2 py-1 w-full outline-none border border-amber-100 focus:border-amber-300 transition-all"
            />
          </div>
        </div>
        <div>
          <label className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter block mb-0.5">Salario Digno (Proyectado)</label>
          <div className="flex items-center gap-1">
            <span className="text-xl font-bold headline-font text-on-surface">$</span>
            <input 
              type="number"
              value={fiscalData.digno || ''}
              onChange={(e) => onChange({ digno: parseFloat(e.target.value) || 0 })}
              className="text-xl font-bold headline-font text-on-surface bg-amber-50/50 focus:bg-white rounded-lg px-2 py-1 w-full outline-none border border-amber-100 focus:border-amber-300 transition-all"
            />
          </div>
        </div>
      </div>

      {range && (
        <div className="mt-3 py-1.5 px-3 bg-amber-50/50 rounded-lg flex items-center justify-between border border-amber-100">
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-amber-400 uppercase tracking-tighter">Desde</span>
            <span className="text-[10px] font-bold text-amber-600">{formatDateLabel(range.start)} {new Date(range.start + 'T00:00:00').getFullYear()}</span>
          </div>
          <div className="h-4 w-px bg-amber-200"></div>
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-black text-amber-400 uppercase tracking-tighter">Hasta</span>
            <span className="text-[10px] font-bold text-amber-600">{formatDateLabel(range.end)} {new Date(range.end + 'T00:00:00').getFullYear()}</span>
          </div>
        </div>
      )}
    </div>
  );
}
