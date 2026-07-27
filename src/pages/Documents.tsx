import { FileText, Download, FileOutput } from 'lucide-react';
import { useState } from 'react';
import { useData } from '../context/DataContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function Documents() {
  const { documents: officialDocuments } = useData();
  const [filter, setFilter] = useState<'All' | 'Budget' | 'Tender' | 'Policy'>('All');

  const filteredDocs = filter === 'All' 
    ? officialDocuments 
    : officialDocuments.filter(doc => doc.type === filter);

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Official Documents & Tenders', 14, 22);
    
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Prepare table data
    const tableColumn = ["Title", "Type", "Date Posted", "Size"];
    const tableRows = filteredDocs.map(item => [
      item.title,
      item.type,
      item.datePosted,
      item.size
    ]);

    // Add table
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [21, 128, 61] }, // green-700
      alternateRowStyles: { fillColor: [249, 250, 251] }, // gray-50
    });

    // Save the PDF
    doc.save('Taita_Taveta_Documents.pdf');
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Official Documents & Tenders</h1>
            <p className="text-lg text-gray-600">
              Access public records, budget estimates, development plans, and open tender opportunities.
            </p>
          </div>
          <button 
            onClick={exportToPDF}
            className="inline-flex items-center justify-center px-4 py-2 bg-green-700 text-white hover:bg-green-800 font-medium rounded-lg text-sm transition-colors shrink-0 whitespace-nowrap shadow-sm"
          >
            <FileOutput className="w-4 h-4 mr-2" /> Export to PDF
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {['All', 'Budget', 'Tender', 'Policy'].map(type => (
            <button
              key={type}
              onClick={() => setFilter(type as any)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === type 
                  ? 'bg-green-600 text-white' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Document List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <ul className="divide-y divide-gray-100">
            {filteredDocs.map(doc => (
              <li key={doc.id} className="p-6 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start">
                  <div className="p-3 bg-gray-100 rounded-lg text-gray-500 mr-4 shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{doc.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        doc.type === 'Tender' ? 'bg-blue-100 text-blue-700' :
                        doc.type === 'Budget' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-200 text-gray-700'
                      }`}>
                        {doc.type}
                      </span>
                      <span>Posted: {doc.datePosted}</span>
                      <span>Size: {doc.size}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    if (doc.fileData) {
                      const a = document.createElement('a');
                      a.href = doc.fileData;
                      a.download = doc.title;
                      a.click();
                    } else {
                      alert('No file attached to this document.');
                    }
                  }}
                  className="inline-flex items-center justify-center px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 font-medium rounded-lg text-sm transition-colors shrink-0">
                  <Download className="w-4 h-4 mr-2" /> Download
                </button>
              </li>
            ))}
          </ul>
          {filteredDocs.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              No documents found for this category.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
