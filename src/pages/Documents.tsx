import { FileText, Download, FileOutput, Eye, X, Maximize2, Minimize2, Printer, Search, ExternalLink, ShieldCheck, BookOpen } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { Document as DocumentType } from '../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function Documents() {
  const { documents: officialDocuments, countyBranding } = useData();
  const [filter, setFilter] = useState<'All' | 'Budget' | 'Tender' | 'Policy' | 'Report'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewDoc, setPreviewDoc] = useState<DocumentType | null>(null);
  const [viewMode, setViewMode] = useState<'pdf' | 'summary'>('pdf');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const filteredDocs = officialDocuments.filter(doc => {
    const matchesFilter = filter === 'All' || doc.type === filter;
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Generate or extract PDF Data URL for previewing
  useEffect(() => {
    if (!previewDoc) {
      setPdfUrl(null);
      return;
    }

    try {
      if (previewDoc.fileData && (previewDoc.fileData.startsWith('data:application/pdf') || previewDoc.fileData.startsWith('http') || previewDoc.fileData.startsWith('blob:'))) {
        setPdfUrl(previewDoc.fileData);
      } else {
        const doc = createJsPdfForDoc(previewDoc, countyBranding?.countyName || 'Taita Taveta');
        const dataUri = doc.output('datauristring');
        setPdfUrl(dataUri);
      }
    } catch (err) {
      console.error("Failed to generate PDF Data URI:", err);
      setPdfUrl(null);
    }
  }, [previewDoc, countyBranding]);

  const handleDownload = (docItem: DocumentType) => {
    try {
      if (docItem.fileData) {
        const a = document.createElement('a');
        a.href = docItem.fileData;
        a.download = `${docItem.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        const doc = createJsPdfForDoc(docItem, countyBranding?.countyName || 'Taita Taveta');
        doc.save(`${docItem.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
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
        console.error("Print popup blocked or failed:", err);
      }
    }
  };

  const exportListToPDF = () => {
    const doc = new jsPDF();
    
    // Add title banner
    doc.setFillColor(21, 128, 61);
    doc.rect(0, 0, 210, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text(`COUNTY GOVERNMENT OF ${countyBranding?.countyName?.toUpperCase() || 'TAITA TAVETA'}`, 105, 12, { align: 'center' });
    doc.setFontSize(10);
    doc.text('Official Documents & Tenders Catalog', 105, 19, { align: 'center' });
    
    doc.setTextColor(51, 65, 85);
    doc.setFontSize(9);
    doc.text(`Generated on: ${new Date().toLocaleDateString()} | Total Items: ${filteredDocs.length}`, 14, 32);
    
    // Table data
    const tableColumn = ["Ref ID", "Document Title", "Type", "Date Posted", "File Size"];
    const tableRows = filteredDocs.map((item, index) => [
      `DOC-0${index + 1}`,
      item.title,
      item.type,
      item.datePosted,
      item.size
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 36,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [21, 128, 61], textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    });

    doc.save('Taita_Taveta_Documents_Catalog.pdf');
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <div className="flex items-center space-x-2 text-green-700 text-sm font-semibold mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Public Transparency Portal</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Official Documents & Tenders</h1>
            <p className="text-gray-600 mt-2 max-w-2xl leading-relaxed">
              Access and preview official public records, budget estimates, development plans, and tender invitations instantly in your browser.
            </p>
          </div>

          <button 
            onClick={exportListToPDF}
            className="inline-flex items-center justify-center px-4 py-2.5 bg-green-700 text-white hover:bg-green-800 font-bold rounded-xl text-sm transition-all shadow-sm shrink-0 whitespace-nowrap"
          >
            <FileOutput className="w-4 h-4 mr-2" /> Export Catalog PDF
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 mb-8 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by document title or keyword..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {(['All', 'Budget', 'Tender', 'Policy', 'Report'] as const).map(type => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filter === type 
                    ? 'bg-green-700 text-white shadow-sm' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Document Cards List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <ul className="divide-y divide-gray-100">
            {filteredDocs.map(doc => (
              <li key={doc.id} className="p-6 hover:bg-green-50/30 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 group">
                <div className="flex items-start space-x-4">
                  <div className="p-3.5 bg-green-50 rounded-2xl text-green-700 shrink-0 border border-green-100 group-hover:scale-105 transition-transform">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-green-800 transition-colors">
                      {doc.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2.5 mt-2 text-xs text-gray-500">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        doc.type === 'Tender' ? 'bg-blue-100 text-blue-800' :
                        doc.type === 'Budget' ? 'bg-yellow-100 text-yellow-800' :
                        doc.type === 'Report' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {doc.type}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span>Posted: {doc.datePosted}</span>
                      <span className="text-gray-300">•</span>
                      <span>Size: {doc.size}</span>
                      {doc.fileData && (
                        <>
                          <span className="text-gray-300">•</span>
                          <span className="text-green-700 font-semibold bg-green-50 px-2 py-0.5 rounded">PDF Attached</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0 self-end md:self-center">
                  <button 
                    onClick={() => setPreviewDoc(doc)}
                    className="inline-flex items-center justify-center px-4 py-2 bg-green-700 hover:bg-green-800 text-white font-bold rounded-xl text-xs transition-all shadow-sm"
                  >
                    <Eye className="w-3.5 h-3.5 mr-1.5" /> Preview PDF
                  </button>
                  <button 
                    onClick={() => handleDownload(doc)}
                    className="inline-flex items-center justify-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-colors"
                    title="Download File"
                  >
                    <Download className="w-3.5 h-3.5 mr-1" /> Download
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {filteredDocs.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <FileText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="font-semibold text-gray-700">No documents found matching your filter</p>
              <p className="text-xs text-gray-400 mt-1">Try clearing your search query or selecting 'All'.</p>
            </div>
          )}
        </div>
      </div>

      {/* PDF PREVIEW MODAL */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-gray-900/80 backdrop-blur-sm animate-fade-in">
          <div className={`bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col w-full transition-all duration-200 overflow-hidden ${
            isFullscreen ? 'fixed inset-2 z-50 h-[calc(100vh-16px)]' : 'max-w-5xl h-[90vh]'
          }`}>
            
            {/* Modal Header Bar */}
            <div className="bg-gray-900 text-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-800">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="p-2 bg-green-700/30 text-green-400 rounded-xl shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="font-bold text-sm sm:text-base text-white truncate max-w-xl">{previewDoc.title}</h2>
                  <div className="flex items-center space-x-2 text-xs text-gray-400 mt-0.5">
                    <span className="text-green-400 font-medium">{previewDoc.type}</span>
                    <span>•</span>
                    <span>Posted {previewDoc.datePosted}</span>
                    <span>•</span>
                    <span>{previewDoc.size}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                {/* View Mode Selector */}
                <div className="bg-gray-800 p-1 rounded-xl flex items-center space-x-1 border border-gray-700">
                  <button
                    onClick={() => setViewMode('pdf')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                      viewMode === 'pdf' ? 'bg-green-700 text-white' : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    PDF Viewer
                  </button>
                  <button
                    onClick={() => setViewMode('summary')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                      viewMode === 'summary' ? 'bg-green-700 text-white' : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    Document Summary
                  </button>
                </div>

                {/* Print & Download & External Link */}
                <button
                  onClick={handlePrint}
                  className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl transition-colors"
                  title="Print Document"
                >
                  <Printer className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDownload(previewDoc)}
                  className="p-2 bg-green-700 hover:bg-green-600 text-white rounded-xl transition-colors"
                  title="Download File"
                >
                  <Download className="w-4 h-4" />
                </button>

                {pdfUrl && (
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl transition-colors"
                    title="Open PDF in New Tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}

                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl transition-colors hidden sm:block"
                  title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setPreviewDoc(null)}
                  className="p-2 bg-gray-800 hover:bg-red-600 text-white rounded-xl transition-colors"
                  title="Close Preview"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body View */}
            <div className="flex-1 bg-gray-100 relative overflow-hidden flex flex-col">
              {viewMode === 'pdf' ? (
                pdfUrl ? (
                  <iframe
                    src={pdfUrl}
                    className="w-full h-full border-0 bg-white"
                    title={`PDF Viewer - ${previewDoc.title}`}
                  />
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                    <FileText className="w-12 h-12 text-gray-400 mb-3 animate-pulse" />
                    <p className="text-gray-600 font-semibold">Preparing Document Reader...</p>
                  </div>
                )
              ) : (
                <div className="flex-1 overflow-y-auto p-6 sm:p-10 max-w-4xl mx-auto w-full">
                  <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8 space-y-6">
                    {/* Executive Header */}
                    <div className="border-b border-gray-200 pb-6 text-center sm:text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                          {previewDoc.type} Publication
                        </span>
                        <h2 className="text-2xl font-extrabold text-gray-900 mt-3">{previewDoc.title}</h2>
                        <p className="text-xs text-gray-500 mt-1">County Government of {countyBranding?.countyName || 'Taita Taveta'} • Public Notice</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-xs text-gray-600 space-y-1 shrink-0">
                        <div><strong className="text-gray-900">Ref ID:</strong> TT-DOC-{previewDoc.id.toUpperCase()}</div>
                        <div><strong className="text-gray-900">Date Posted:</strong> {previewDoc.datePosted}</div>
                        <div><strong className="text-gray-900">Size:</strong> {previewDoc.size}</div>
                      </div>
                    </div>

                    {/* Document Overview */}
                    <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
                      <h3 className="font-bold text-gray-900 text-base flex items-center">
                        <BookOpen className="w-4 h-4 mr-2 text-green-700" /> Executive Summary & Objectives
                      </h3>
                      <p>
                        This document is issued by the County Executive of {countyBranding?.countyName || 'Taita Taveta'} for public interest, policy compliance, and administrative record. Residents, development partners, and stakeholders are advised to examine the scheduled objectives and guidelines outlined herein.
                      </p>

                      {previewDoc.type === 'Tender' && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-blue-900 space-y-2 mt-4">
                          <h4 className="font-bold text-xs uppercase tracking-wider text-blue-800">Tender Submission Brief</h4>
                          <ul className="list-disc list-inside text-xs space-y-1 text-blue-800">
                            <li>Eligible bidders must present valid NCA certificates and KRA Tax Compliance.</li>
                            <li>Tender documents should be submitted in sealed envelopes to County Procurement Headquarters.</li>
                            <li>Public bid opening takes place at the County Treasury Auditorium in Voi.</li>
                          </ul>
                        </div>
                      )}

                      {previewDoc.type === 'Budget' && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-yellow-900 space-y-2 mt-4">
                          <h4 className="font-bold text-xs uppercase tracking-wider text-yellow-800">Financial Framework Overview</h4>
                          <p className="text-xs leading-relaxed text-yellow-900">
                            Budget allocations prioritize healthcare infrastructure, rural access road paving, agricultural fertilizer subsidies, and water security across Mwatate, Taveta, Voi, and Wundanyi sub-counties.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action Bar */}
                    <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <p className="text-xs text-gray-500">Official verification provided by County Communication Directorate.</p>
                      <button
                        onClick={() => handleDownload(previewDoc)}
                        className="w-full sm:w-auto px-6 py-2.5 bg-green-700 hover:bg-green-800 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center"
                      >
                        <Download className="w-4 h-4 mr-2" /> Download Complete File
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

// Helper: Generates a blob URL for PDF viewing
function generateOfficialPDFBlobUrl(item: DocumentType, countyName: string): string {
  const doc = createJsPdfForDoc(item, countyName);
  const blob = doc.output('blob');
  return URL.createObjectURL(blob);
}

// Helper: Creates jsPDF instance with official formatting
function createJsPdfForDoc(item: DocumentType, countyName: string): jsPDF {
  const doc = new jsPDF();
  
  // Header Banner
  doc.setFillColor(21, 128, 61); // Green banner
  doc.rect(0, 0, 210, 28, 'F');
  
  doc.setFillColor(234, 179, 8); // Gold line
  doc.rect(0, 28, 210, 3, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text(`COUNTY GOVERNMENT OF ${countyName.toUpperCase()}`, 105, 14, { align: 'center' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('REPUBLIC OF KENYA • OFFICIAL PUBLIC PUBLICATION', 105, 22, { align: 'center' });
  
  // Title
  doc.setTextColor(17, 24, 39);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  const splitTitle = doc.splitTextToSize(item.title, 180);
  doc.text(splitTitle, 14, 42);
  
  const titleY = 42 + (splitTitle.length * 7);
  
  // Metadata
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Document Reference: TT-DOC-${item.id.toUpperCase()}`, 14, titleY);
  doc.text(`Category: ${item.type}   |   Date Published: ${item.datePosted}   |   File Size: ${item.size}`, 14, titleY + 5);
  
  doc.setDrawColor(226, 232, 240);
  doc.line(14, titleY + 9, 196, titleY + 9);
  
  let currentY = titleY + 16;

  // Executive Summary
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(21, 128, 61);
  doc.text('1. EXECUTIVE SUMMARY & OBJECTIVES', 14, currentY);
  
  currentY += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);
  
  const summaryText = `This official document "${item.title}" is published by the County Executive of ${countyName} pursuant to the provisions of the County Governments Act and the Constitution of Kenya. It sets out strategic guidelines, resource frameworks, and statutory procedures for public transparency across Voi, Taveta, Mwatate, and Wundanyi sub-counties.`;
  const splitSummary = doc.splitTextToSize(summaryText, 182);
  doc.text(splitSummary, 14, currentY);
  
  currentY += (splitSummary.length * 5) + 8;

  // Schedule Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(21, 128, 61);
  doc.text('2. KEY PROVISIONS & SCHEDULE', 14, currentY);
  currentY += 4;

  if (item.type === 'Tender') {
    autoTable(doc, {
      startY: currentY,
      head: [['Requirement Item', 'Specification Details', 'Compliance Standard']],
      body: [
        ['Tender Reference', `TT/CG/${item.id}/2026`, 'Mandatory'],
        ['Eligibility Criteria', 'Registered Firms with Valid Tax Compliance & NCA License', 'Strict'],
        ['Submission Deadline', '21 Days from Date of Advertisement (10:00 AM)', 'Hard Deadline'],
        ['Bid Security', '2% of Total Tender Sum from Reputable Bank', 'Required'],
        ['Opening Venue', 'County Treasury Headquarters, Supply Chain Office, Voi', 'Public Opening']
      ],
      theme: 'grid',
      headStyles: { fillColor: [21, 128, 61], fontSize: 9 },
      styles: { fontSize: 8.5, cellPadding: 3 }
    });
  } else if (item.type === 'Budget') {
    autoTable(doc, {
      startY: currentY,
      head: [['Sector / Department', 'Recurrent Allocation (KES)', 'Development Allocation (KES)', 'Total (KES)']],
      body: [
        ['Health Services', '1,250,000,000', '480,000,000', '1,730,000,000'],
        ['Public Works & Infrastructure', '320,000,000', '890,000,000', '1,210,000,000'],
        ['Agriculture & Livestock', '210,000,000', '350,000,000', '560,000,000'],
        ['Education & Social Services', '410,000,000', '290,000,000', '700,000,000'],
        ['Finance & Economic Planning', '550,000,000', '120,000,000', '670,000,000']
      ],
      theme: 'grid',
      headStyles: { fillColor: [21, 128, 61], fontSize: 9 },
      styles: { fontSize: 8.5, cellPadding: 3 }
    });
  } else {
    autoTable(doc, {
      startY: currentY,
      head: [['Pillar / Objective', 'Target Outcome', 'Responsible Directorate']],
      body: [
        ['Infrastructure Modernization', 'Paving rural access roads and market stalls', 'Public Works & Housing'],
        ['Healthcare Improvement', 'Equipping dispensaries and Universal Health Coverage', 'Health Services'],
        ['Water Conservation', 'Water pans, boreholes, and climate resilient forestry', 'Environment & Water'],
        ['Economic Empowerment', 'Youth revolving credit and trader support programs', 'Trade & Cooperatives']
      ],
      theme: 'grid',
      headStyles: { fillColor: [21, 128, 61], fontSize: 9 },
      styles: { fontSize: 8.5, cellPadding: 3 }
    });
  }

  // Stamp Box
  const finalY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 14 : currentY + 40;
  if (finalY < 240) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text('3. OFFICIAL CERTIFICATION', 14, finalY);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text('Issued by the Office of the County Secretary & Head of Public Service.', 14, finalY + 6);
    doc.text('Email: info@taitataveta.go.ke | Website: www.taitataveta.go.ke', 14, finalY + 11);
    
    doc.setDrawColor(21, 128, 61);
    doc.rect(140, finalY + 2, 55, 22);
    doc.setTextColor(21, 128, 61);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.text(`${countyName.toUpperCase()} COUNTY`, 167.5, finalY + 8, { align: 'center' });
    doc.text('OFFICIAL DOCUMENT', 167.5, finalY + 13, { align: 'center' });
    doc.text('VERIFIED PUBLIC RECORD', 167.5, finalY + 18, { align: 'center' });
  }

  // Page Numbers
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Page ${i} of ${totalPages} — Official ${countyName} County Public Document`, 105, 288, { align: 'center' });
  }

  return doc;
}

