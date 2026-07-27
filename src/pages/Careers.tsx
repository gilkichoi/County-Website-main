import React, { useState, useEffect } from 'react';
import { 
  Briefcase, Clock, ChevronRight, Search, FileText, Eye, Download, 
  Building2, FileOutput, ShieldCheck, CheckCircle2, AlertCircle, X, 
  Printer, Share2, Layers, Filter, Sparkles, Building, ExternalLink
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { Vacancy } from '../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Live Countdown Hook for Real-time Application Deadline
function useCountdown(deadlineIso: string) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const target = new Date(deadlineIso).getTime();
      const diff = target - now;

      if (isNaN(diff) || diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [deadlineIso]);

  return timeLeft;
}

// Countdown Ticker Badge
function CountdownBadge({ deadline }: { deadline: string }) {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(deadline);

  if (isExpired) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
        <AlertCircle className="w-3.5 h-3.5 mr-1 text-gray-500 shrink-0" />
        Application Closed
      </span>
    );
  }

  const isUrgent = days < 3;

  return (
    <div className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-mono font-bold border shadow-2xs ${
      isUrgent 
        ? 'bg-amber-50 text-amber-900 border-amber-300' 
        : 'bg-emerald-50 text-emerald-900 border-emerald-300'
    }`}>
      <span className="relative flex h-2 w-2 mr-2">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isUrgent ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
        <span className={`relative inline-flex rounded-full h-2 w-2 ${isUrgent ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
      </span>
      <Clock className="w-3.5 h-3.5 mr-1.5 text-gray-600 shrink-0" />
      <span>{days}d : {String(hours).padStart(2, '0')}h : {String(minutes).padStart(2, '0')}m : {String(seconds).padStart(2, '0')}s</span>
    </div>
  );
}

// Generate Official Vacancy Document PDF
function createJsPdfForVacancy(job: Vacancy, countyName: string, departments: any[]) {
  const doc = new jsPDF();
  const getDeptName = (id: string) => departments.find(d => d.id === id)?.name || 'General Administration';
  
  const featuredDeptIds = job.departmentIds && job.departmentIds.length > 0 ? job.departmentIds : [job.departmentId];
  const featuredDeptNames = featuredDeptIds.map(getDeptName).join(', ');

  // Header Banner
  doc.setFillColor(21, 128, 61);
  doc.rect(0, 0, 210, 32, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text(`COUNTY GOVERNMENT OF ${countyName.toUpperCase()}`, 105, 12, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('COUNTY PUBLIC SERVICE BOARD', 105, 20, { align: 'center' });
  doc.setFontSize(8.5);
  doc.text('Official Job Vacancy Announcement', 105, 26, { align: 'center' });

  // Job Details Header Box
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 38, 182, 38, 3, 3, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(job.title, 18, 48);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(194, 65, 12);
  doc.text(`Reference No: ${job.referenceNo || 'TTC/CPSB/2026/001'}`, 18, 55);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Featured Department(s): ${featuredDeptNames}`, 18, 62);
  doc.text(`Terms: ${job.type} | Positions: ${job.positionsCount || 1} | Date Posted: ${job.datePosted || '2026-07-27'}`, 18, 69);

  // Application Deadline Notice Box
  doc.setFillColor(254, 243, 199);
  doc.setDrawColor(245, 158, 11);
  doc.roundedRect(14, 80, 182, 13, 2, 2, 'FD');

  doc.setTextColor(146, 64, 14);
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  const deadlineStr = new Date(job.deadline).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' });
  doc.text(`APPLICATION DEADLINE: ${deadlineStr.toUpperCase()}`, 105, 88, { align: 'center' });

  // Section 1: Overview & Description
  doc.setTextColor(21, 128, 61);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('1. Job Position Overview', 14, 102);

  doc.setTextColor(51, 65, 85);
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  const descLines = doc.splitTextToSize(
    job.description || 'The County Public Service Board invites applications from suitably qualified Kenyan citizens for the vacancy post detailed herein.',
    182
  );
  doc.text(descLines, 14, 108);

  let currentY = 108 + descLines.length * 5 + 6;

  // Section 2: Key Requirements & Qualifications
  doc.setTextColor(21, 128, 61);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('2. Key Requirements & Academic Qualifications', 14, currentY);
  currentY += 6;

  const reqList = job.requirements || [
    'Must be a Kenyan Citizen holding a valid National ID Card.',
    'Bachelor degree or Diploma from a recognized University/College in relevant discipline.',
    'Satisfy requirements of Chapter Six of the Constitution of Kenya 2010.',
    'Proven track record of integrity and excellent interpersonal skills.'
  ];

  reqList.forEach((req) => {
    doc.setTextColor(51, 65, 85);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const bulletText = `•  ${req}`;
    const bulletLines = doc.splitTextToSize(bulletText, 178);
    doc.text(bulletLines, 18, currentY);
    currentY += bulletLines.length * 5 + 2;
  });

  currentY += 4;

  // Section 3: How to Apply
  doc.setTextColor(21, 128, 61);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('3. How to Apply & Submission Guidelines', 14, currentY);
  currentY += 6;

  doc.setTextColor(51, 65, 85);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  const applyText = `All applications should be submitted in sealed envelopes clearly stating the Position Title and Reference Number on top, addressed to:\n\nThe Secretary / CEO\nCounty Public Service Board\nCounty Government of Taita Taveta\nP.O. Box 1062 - 80304, Mwatate Headquarters, Kenya.\n\nNote: Hand-delivered applications can be dropped at the County Public Service Board Registry offices in Mwatate. Only shortlisted candidates will be contacted. Taita Taveta County is an equal opportunity employer.`;
  const applyLines = doc.splitTextToSize(applyText, 182);
  doc.text(applyLines, 14, currentY);

  // Footer stamp
  doc.setDrawColor(203, 213, 225);
  doc.line(14, 275, 196, 275);
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(8);
  doc.text(`Official Document | Ref: ${job.referenceNo || 'TTC/CPSB/2026/001'} | Taita Taveta County Public Service Board`, 105, 282, { align: 'center' });

  return doc;
}

export function Careers() {
  const { 
    vacancies, 
    departments, 
    countyBranding, 
    incrementVacancyViews, 
    incrementVacancyDownloads 
  } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'closed'>('active');

  const [previewJob, setPreviewJob] = useState<Vacancy | null>(null);
  const [viewMode, setViewMode] = useState<'pdf' | 'summary'>('pdf');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const getDeptName = (id: string) => departments.find(d => d.id === id)?.name || 'General Administration';

  // Filter Logic
  const filteredVacancies = vacancies.filter(job => {
    const isExpired = new Date(job.deadline).getTime() < new Date().getTime();
    
    if (statusFilter === 'active' && isExpired) return false;
    if (statusFilter === 'closed' && !isExpired) return false;

    if (selectedType !== 'All' && job.type !== selectedType) return false;

    if (selectedDept !== 'All') {
      const deptMatch = job.departmentId === selectedDept || (job.departmentIds && job.departmentIds.includes(selectedDept));
      if (!deptMatch) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = job.title.toLowerCase().includes(q);
      const matchRef = job.referenceNo?.toLowerCase().includes(q);
      const matchDesc = job.description?.toLowerCase().includes(q);
      const matchDept = getDeptName(job.departmentId).toLowerCase().includes(q);
      if (!matchTitle && !matchRef && !matchDesc && !matchDept) return false;
    }

    return true;
  });

  // Calculate global statistics
  const totalVacanciesCount = vacancies.length;
  const activeVacanciesCount = vacancies.filter(j => new Date(j.deadline).getTime() >= new Date().getTime()).length;
  const totalViewsCount = vacancies.reduce((acc, j) => acc + (j.viewsCount || 0), 0);
  const totalDownloadsCount = vacancies.reduce((acc, j) => acc + (j.downloadsCount || 0), 0);

  // Generate or extract PDF Data URL for previewing
  useEffect(() => {
    if (!previewJob) {
      setPdfUrl(null);
      return;
    }

    try {
      if (previewJob.fileData && (previewJob.fileData.startsWith('data:application/pdf') || previewJob.fileData.startsWith('http') || previewJob.fileData.startsWith('blob:'))) {
        setPdfUrl(previewJob.fileData);
      } else {
        const doc = createJsPdfForVacancy(previewJob, countyBranding?.countyName || 'Taita Taveta', departments);
        const dataUri = doc.output('datauristring');
        setPdfUrl(dataUri);
      }
    } catch (err) {
      console.error("Failed to generate Vacancy PDF Data URI:", err);
      setPdfUrl(null);
    }
  }, [previewJob, countyBranding, departments]);

  const handleOpenPreview = (job: Vacancy) => {
    incrementVacancyViews(job.id);
    setPreviewJob(job);
    setViewMode('pdf');
  };

  const handleDownload = (job: Vacancy) => {
    incrementVacancyDownloads(job.id);
    try {
      if (job.fileData) {
        const a = document.createElement('a');
        a.href = job.fileData;
        a.download = `${job.title.replace(/[^a-zA-Z0-9]/g, '_')}_Vacancy.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        const doc = createJsPdfForVacancy(job, countyBranding?.countyName || 'Taita Taveta', departments);
        doc.save(`${job.title.replace(/[^a-zA-Z0-9]/g, '_')}_Vacancy.pdf`);
      }
    } catch (err) {
      console.error("Failed to download PDF:", err);
    }
  };

  const handlePrint = () => {
    if (pdfUrl) {
      try {
        const printWindow = window.open(pdfUrl, '_blank');
        if (printWindow) {
          printWindow.focus();
          setTimeout(() => {
            try {
              printWindow.print();
            } catch (e) {
              console.error(e);
            }
          }, 500);
        }
      } catch (err) {
        console.error("Print blocked:", err);
      }
    }
  };

  const exportCatalogPDF = () => {
    const doc = new jsPDF();
    
    doc.setFillColor(21, 128, 61);
    doc.rect(0, 0, 210, 26, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(15);
    doc.text(`COUNTY GOVERNMENT OF ${countyBranding?.countyName?.toUpperCase() || 'TAITA TAVETA'}`, 105, 12, { align: 'center' });
    doc.setFontSize(9.5);
    doc.text('County Public Service Board - Vacancy & Careers Catalog', 105, 19, { align: 'center' });
    
    doc.setTextColor(51, 65, 85);
    doc.setFontSize(8.5);
    doc.text(`Generated: ${new Date().toLocaleDateString()} | Total Filtered Vacancies: ${filteredVacancies.length}`, 14, 33);

    const tableColumn = ["Ref No", "Job Title", "Department(s)", "Terms", "Deadline", "Positions", "Views", "Downloads"];
    const tableRows = filteredVacancies.map((item) => {
      const deptIds = item.departmentIds && item.departmentIds.length > 0 ? item.departmentIds : [item.departmentId];
      const deptNames = deptIds.map(getDeptName).join(', ');
      return [
        item.referenceNo || 'N/A',
        item.title,
        deptNames,
        item.type,
        new Date(item.deadline).toLocaleDateString(),
        String(item.positionsCount || 1),
        String(item.viewsCount || 0),
        String(item.downloadsCount || 0)
      ];
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 37,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2.5 },
      headStyles: { fillColor: [21, 128, 61], textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    });

    doc.save('Taita_Taveta_Vacancies_Catalog.pdf');
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10 sm:py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Banner Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 pb-8">
          <div>
            <div className="flex items-center space-x-2 text-green-700 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>County Public Service Board Portal</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Careers & Public Vacancies
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-2xl leading-relaxed">
              Explore open positions, inspect job descriptions, and download official vacancy document announcements.
            </p>
          </div>

          <button
            onClick={exportCatalogPDF}
            className="inline-flex items-center justify-center px-4 py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 self-start md:self-auto"
          >
            <FileOutput className="w-4 h-4 mr-2" />
            Export Vacancies Catalog
          </button>
        </div>

        {/* Global Analytics Overview Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs flex items-center space-x-3">
            <div className="p-3 bg-green-50 text-green-700 rounded-xl shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xl font-extrabold text-gray-900">{activeVacanciesCount}</span>
              <span className="text-xs text-gray-500 font-medium">Active Openings</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs flex items-center space-x-3">
            <div className="p-3 bg-blue-50 text-blue-700 rounded-xl shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xl font-extrabold text-gray-900">{totalVacanciesCount}</span>
              <span className="text-xs text-gray-500 font-medium">Total Career Posts</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs flex items-center space-x-3">
            <div className="p-3 bg-amber-50 text-amber-700 rounded-xl shrink-0">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xl font-extrabold text-gray-900">{totalViewsCount}</span>
              <span className="text-xs text-gray-500 font-medium">Document Views</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs flex items-center space-x-3">
            <div className="p-3 bg-orange-50 text-orange-700 rounded-xl shrink-0">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xl font-extrabold text-gray-900">{totalDownloadsCount}</span>
              <span className="text-xs text-gray-500 font-medium">PDF Downloads</span>
            </div>
          </div>
        </div>

        {/* Search & Filtering Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-2xs border border-gray-200 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative sm:col-span-2">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search job title, ref no, or requirements..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-green-500 focus:bg-white outline-none"
              />
            </div>

            {/* Department Filter */}
            <div>
              <select
                value={selectedDept}
                onChange={e => setSelectedDept(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option value="All">All Departments</option>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            {/* Employment Type Filter */}
            <div>
              <select
                value={selectedType}
                onChange={e => setSelectedType(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option value="All">All Employment Terms</option>
                <option value="Full-time">Full-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Part-time">Part-time</option>
                <option value="Temporary">Temporary</option>
              </select>
            </div>
          </div>

          {/* Status Tab Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100 text-xs">
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] mr-1">Status:</span>
              <button
                onClick={() => setStatusFilter('active')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  statusFilter === 'active'
                    ? 'bg-green-700 text-white shadow-2xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Active Vacancies ({vacancies.filter(j => new Date(j.deadline).getTime() >= new Date().getTime()).length})
              </button>
              <button
                onClick={() => setStatusFilter('closed')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  statusFilter === 'closed'
                    ? 'bg-green-700 text-white shadow-2xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Closed / Past ({vacancies.filter(j => new Date(j.deadline).getTime() < new Date().getTime()).length})
              </button>
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  statusFilter === 'all'
                    ? 'bg-green-700 text-white shadow-2xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Show All ({vacancies.length})
              </button>
            </div>

            <div className="text-gray-500 font-medium">
              Showing <strong>{filteredVacancies.length}</strong> vacancy posts
            </div>
          </div>
        </div>

        {/* Vacancies List */}
        <div className="space-y-4">
          {filteredVacancies.map(job => {
            const isExpired = new Date(job.deadline).getTime() < new Date().getTime();
            const featuredDeptIds = job.departmentIds && job.departmentIds.length > 0 ? job.departmentIds : [job.departmentId];

            return (
              <div
                key={job.id}
                className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs hover:shadow-md hover:border-green-300 transition-all p-5 sm:p-6 space-y-4"
              >
                {/* Top Bar: Ref No, Type Badge & Countdown Ticker */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-2.5 py-1 bg-orange-50 text-orange-800 font-mono font-bold rounded-md border border-orange-200/80">
                      REF: {job.referenceNo || 'TTC/CPSB/2026/001'}
                    </span>
                    <span className="px-2.5 py-1 bg-green-50 text-green-800 font-bold rounded-md border border-green-200/80">
                      {job.type}
                    </span>
                    {job.positionsCount && (
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-800 font-bold rounded-md border border-blue-200/80">
                        {job.positionsCount} {job.positionsCount === 1 ? 'Position' : 'Positions'}
                      </span>
                    )}
                  </div>

                  {/* Real-time Deadline Countdown Ticker */}
                  <div>
                    <CountdownBadge deadline={job.deadline} />
                  </div>
                </div>

                {/* Main Body */}
                <div className="space-y-3">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                    {job.title}
                  </h3>

                  {/* Featured Departments */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider shrink-0 flex items-center">
                      <Building2 className="w-3.5 h-3.5 mr-1 text-gray-500" />
                      Featured Depts:
                    </span>
                    {featuredDeptIds.map(dId => (
                      <span
                        key={dId}
                        className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg border border-gray-200/80"
                      >
                        <Building className="w-3 h-3 mr-1 text-green-700 shrink-0" />
                        {getDeptName(dId)}
                      </span>
                    ))}
                  </div>

                  {/* Short Description */}
                  {job.description && (
                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>
                  )}
                </div>

                {/* Bottom Bar: Document Analytics & Actions */}
                <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Views & Downloads Analytics */}
                  <div className="flex items-center space-x-4 text-xs text-gray-500 font-medium">
                    <span className="flex items-center" title="Times users viewed this vacancy document">
                      <Eye className="w-3.5 h-3.5 mr-1 text-blue-600" />
                      <strong>{job.viewsCount || 0}</strong>
                      <span className="ml-1 text-gray-400">views</span>
                    </span>

                    <span className="flex items-center" title="Times document was downloaded">
                      <Download className="w-3.5 h-3.5 mr-1 text-orange-600" />
                      <strong>{job.downloadsCount || 0}</strong>
                      <span className="ml-1 text-gray-400">downloads</span>
                    </span>

                    <span className="flex items-center text-gray-400">
                      <FileText className="w-3.5 h-3.5 mr-1 text-green-600" />
                      <span>{job.fileSize || '1.2 MB'}</span>
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleOpenPreview(job)}
                      className="inline-flex items-center px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition-all border border-gray-200 shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1.5 text-blue-700" />
                      Preview PDF
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownload(job)}
                      className="inline-flex items-center px-3.5 py-2 bg-green-700 hover:bg-green-800 text-white rounded-xl text-xs font-bold transition-all shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5 mr-1.5" />
                      Download PDF
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredVacancies.length === 0 && (
            <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-gray-200 space-y-3">
              <Briefcase className="w-10 h-10 text-gray-300 mx-auto" />
              <h3 className="font-bold text-gray-800 text-base">No Matching Vacancies Found</h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                No job openings matched your search filters. Try clearing your search query or selecting a different status filter.
              </p>
            </div>
          )}
        </div>

        {/* PDF Preview & Summary Modal */}
        {previewJob && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              
              {/* Modal Header */}
              <div className="p-5 bg-gradient-to-r from-green-900 to-green-800 text-white flex items-center justify-between shrink-0">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2 text-green-300 text-[11px] font-bold uppercase tracking-wider">
                    <span>{previewJob.referenceNo || 'REF: TTC/CPSB/2026/001'}</span>
                    <span>•</span>
                    <span>{previewJob.type}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold pr-4 line-clamp-1">{previewJob.title}</h3>
                </div>

                <button
                  type="button"
                  onClick={() => setPreviewJob(null)}
                  className="p-2 hover:bg-white/10 rounded-full text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Mode Selector Bar */}
              <div className="px-5 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between shrink-0 text-xs">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('pdf')}
                    className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                      viewMode === 'pdf'
                        ? 'bg-green-700 text-white shadow-2xs'
                        : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-200'
                    }`}
                  >
                    PDF Document Viewer
                  </button>
                  <button
                    onClick={() => setViewMode('summary')}
                    className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                      viewMode === 'summary'
                        ? 'bg-green-700 text-white shadow-2xs'
                        : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-200'
                    }`}
                  >
                    Job Summary & Specs
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="p-1.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 rounded-lg text-xs font-bold"
                    title="Print Document"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownload(previewJob)}
                    className="inline-flex items-center px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold transition-all shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5 mr-1" />
                    Download PDF
                  </button>
                </div>
              </div>

              {/* Modal Content Body */}
              <div className="flex-1 overflow-y-auto p-5 min-h-[400px]">
                {viewMode === 'pdf' ? (
                  pdfUrl ? (
                    <iframe
                      title="Vacancy PDF Document Viewer"
                      src={pdfUrl}
                      className="w-full h-[500px] rounded-xl border border-gray-200"
                    ></iframe>
                  ) : (
                    <div className="p-12 text-center text-gray-500">
                      Generating document preview...
                    </div>
                  )
                ) : (
                  <div className="space-y-6 text-sm text-gray-700">
                    <div className="p-4 bg-green-50/70 border border-green-200 rounded-2xl space-y-2">
                      <h4 className="font-bold text-green-950 text-base">Position Overview</h4>
                      <p className="leading-relaxed text-gray-800">{previewJob.description}</p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider">
                        Featured Departments
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {(previewJob.departmentIds && previewJob.departmentIds.length > 0
                          ? previewJob.departmentIds
                          : [previewJob.departmentId]
                        ).map(dId => (
                          <span
                            key={dId}
                            className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 font-bold rounded-lg text-xs border border-gray-200"
                          >
                            <Building2 className="w-3.5 h-3.5 mr-1.5 text-green-700" />
                            {getDeptName(dId)}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider">
                        Requirements & Qualifications
                      </h4>
                      <ul className="space-y-2">
                        {(previewJob.requirements || [
                          'Must be a Kenyan Citizen holding a valid National ID Card.',
                          'Bachelor degree or Diploma from a recognized University/College in relevant discipline.',
                          'Satisfy requirements of Chapter Six of the Constitution of Kenya 2010.'
                        ]).map((req, i) => (
                          <li key={i} className="flex items-start">
                            <CheckCircle2 className="w-4 h-4 text-green-600 mr-2 shrink-0 mt-0.5" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-1">
                      <h4 className="font-bold text-amber-950 text-xs uppercase tracking-wider">Application Deadline</h4>
                      <p className="text-sm font-extrabold text-amber-900">
                        {new Date(previewJob.deadline).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
                      </p>
                      <p className="text-xs text-amber-800">
                        Applications received after this time will not be considered by the Public Service Board.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between shrink-0 text-xs text-gray-500">
                <div className="flex items-center space-x-3">
                  <span>Views: <strong className="text-gray-800">{previewJob.viewsCount || 0}</strong></span>
                  <span>Downloads: <strong className="text-gray-800">{previewJob.downloadsCount || 0}</strong></span>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewJob(null)}
                  className="px-4 py-2 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors"
                >
                  Close Window
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
