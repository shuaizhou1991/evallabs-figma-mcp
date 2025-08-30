'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Dataset } from '@/lib/datasets';
import { useToast } from '@/hooks/use-toast';

interface DatasetContentDisplayProps {
  dataset: Dataset;
}

interface DataRow {
  [key: string]: any;
}

interface ColumnWidth {
  [key: string]: number;
}

export default function DatasetContentDisplay({ dataset }: DatasetContentDisplayProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCell, setSelectedCell] = useState<{ row: DataRow; column: string; value: any } | null>(null);
  const [columnWidths, setColumnWidths] = useState<ColumnWidth>({});
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploadedData, setUploadedData] = useState<DataRow[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const resizeInfoRef = useRef({ startX: 0, startWidth: 0, column: '' });
  
  const itemsPerPage = 20;
  
  // Use uploaded data if available, otherwise use dataset data
  const data = uploadedData.length > 0 ? uploadedData : (dataset.actualData || []);
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = data.slice(startIndex, startIndex + itemsPerPage);
  
  const columns = data.length > 0 ? Object.keys(data[0]) : [];
  
  // Initialize column widths
  useEffect(() => {
    setColumnWidths(prevWidths => {
      const newColumnWidths: ColumnWidth = {};
      let hasNewColumns = false;
      columns.forEach(column => {
        if (!prevWidths[column]) {
          hasNewColumns = true;
          // Set default width based on column name and content
          let width = Math.max(column.length * 8, 120);
          if (column.includes('review') || column.includes('text') || column.includes('description')) {
            width = 300;
          } else if (column.includes('name') || column.includes('location')) {
            width = 150;
          }
          newColumnWidths[column] = width;
        }
      });

      if (hasNewColumns) {
        return { ...prevWidths, ...newColumnWidths };
      } else {
        return prevWidths; // Return the old state to prevent re-render
      }
    });
  }, [columns]);

  const handleCellClick = (row: DataRow, column: string, value: any) => {
    setSelectedCell({ row, column, value });
  };
  
  const handleCloseDialog = () => {
    setSelectedCell(null);
  };

  // File processing functions
  const parseCSV = (text: string): DataRow[] => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length === 0) return [];
    
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const rows = lines.slice(1).map((line, index) => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      const row: DataRow = { id: index + 1 };
      headers.forEach((header, i) => {
        row[header] = values[i] || '';
      });
      return row;
    });
    
    return rows;
  };

  const parseJSONL = (text: string): DataRow[] => {
    const lines = text.split('\n').filter(line => line.trim());
    return lines.map((line, index) => {
      try {
        const parsed = JSON.parse(line);
        return { id: index + 1, ...parsed };
      } catch {
        return { id: index + 1, data: line };
      }
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!['csv', 'jsonl'].includes(fileExtension || '')) {
      toast({
        title: "Invalid File Format",
        description: "Please upload a CSV or JSONL file.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    try {
      const text = await file.text();
      let parsedData: DataRow[] = [];
      
      if (fileExtension === 'csv') {
        parsedData = parseCSV(text);
      } else if (fileExtension === 'jsonl') {
        parsedData = parseJSONL(text);
      }
      
      if (parsedData.length === 0) {
        toast({
          title: "Empty File",
          description: "The uploaded file appears to be empty or invalid.",
          variant: "destructive",
        });
        return;
      }
      
      // Save to localStorage
      const existingDatasets = localStorage.getItem('datasets');
      const datasets = existingDatasets ? JSON.parse(existingDatasets) : [];
      const updatedDatasets = datasets.map((d: Dataset) => 
        d.id === dataset.id 
          ? { ...d, actualData: parsedData, updated: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) }
          : d
      );
      localStorage.setItem('datasets', JSON.stringify(updatedDatasets));

      setUploadedData(parsedData);
      setCurrentPage(1);
      
      toast({
        title: "File Uploaded Successfully",
        description: `Loaded ${parsedData.length} records from ${file.name}`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        title: "Upload Error",
        description: "Failed to process the uploaded file. Please check the format and try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Column resizing logic
  const handleMouseDown = (column: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    resizeInfoRef.current = {
      startX: event.clientX,
      startWidth: columnWidths[column] || 120,
      column: column,
    };
    setIsResizing(column);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const { startX, startWidth, column } = resizeInfoRef.current;
      const diff = e.clientX - startX;
      const newWidth = Math.max(50, startWidth + diff);
      setColumnWidths(prev => ({
        ...prev,
        [column]: newWidth,
      }));
    };

    const handleMouseUp = () => {
      setIsResizing(null);
    };

    if (isResizing) {
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const handleDeleteDataset = async () => {
    setIsDeleting(true);

    try {
      // Get existing datasets from localStorage
      const existingDatasets = localStorage.getItem('datasets');
      let datasets: Dataset[] = existingDatasets ? JSON.parse(existingDatasets) : [];
      
      // Find the dataset and clear its data
      const updatedDatasets = datasets.map((d: Dataset) => {
        if (d.id === dataset.id) {
          return { ...d, actualData: [] }; // or undefined, but [] is safer
        }
        return d;
      });
      
      // Save updated datasets to localStorage
      localStorage.setItem('datasets', JSON.stringify(updatedDatasets));
      
      // Simulate a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Dataset Content Deleted",
        description: `The content for ${dataset.name} has been successfully deleted.`,
        variant: "default",
      });
      
      // Clear local state to re-render the component in its empty state
      setUploadedData([]);
      setShowDeleteDialog(false);
      
    } catch (error) {
      console.error('Error deleting dataset content:', error);
      toast({
        title: "Error",
        description: "Failed to delete dataset content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const formatCellValue = (value: any): string => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string' && value.length > 100) {
      return `${value.substring(0, 100)}...`;
    }
    return String(value);
  };

  // Show upload interface if no data
  if (data.length === 0) {
    return (
      <div className="space-y-4">
        {/* Upload Area */}
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center bg-slate-50 hover:bg-slate-100 transition-colors">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Upload Dataset</h3>
              <p className="text-sm text-slate-600 mb-4">
                Upload a CSV or JSONL file to view your dataset contents
              </p>
              
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className={`inline-flex items-center space-x-2 px-6 py-3 rounded-md text-sm font-medium transition-colors ${isUploading ? 'bg-slate-400 text-white cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span>Upload Document</span>
                  </>
                )}
              </button>
            </div>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.jsonl"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {/* Simplified Delete Dialog */}
        {showDeleteDialog && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-sm w-full">
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-slate-900">Delete this dataset?</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-600">
                      Are you sure you want to delete the dataset document? This will affect all evaluations related to this dataset.
                    </p>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowDeleteDialog(false)}
                      className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleDeleteDataset}
                      disabled={isDeleting}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${isDeleting ? 'bg-red-400 text-white cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700 cursor-pointer'}`}
                    >
                      {isDeleting ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Deleting...
                        </div>
                      ) : (
                        'Delete Document'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with title and delete button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Dataset Card</h2>
          <p className="text-sm text-slate-500">{data.length.toLocaleString()} rows</p>
        </div>
        <button
          onClick={() => setShowDeleteDialog(true)}
          className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span className="text-sm font-medium">Delete Document</span>
        </button>
      </div>
      
      {/* Data Table with improved column resizing */}
      <div className="border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table ref={tableRef} className="w-full min-w-full table-fixed">
            <thead className="bg-slate-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column}
                    className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider border-r border-slate-200 last:border-r-0 relative select-none"
                    style={{ width: columnWidths[column] || 120, minWidth: 50 }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">
                        {column.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).replace(/_/g, ' ')}
                      </span>
                    </div>
                    {/* Enhanced resize handle */}
                    <div
                      className="absolute top-0 right-0 w-2 h-full cursor-col-resize"
                      onMouseDown={(e) => handleMouseDown(column, e)}
                      style={{
                        opacity: isResizing === column ? 1 : 0,
                        transition: 'opacity 0.2s',
                      }}
                    />
                    <div 
                      className="absolute top-0 right-0 w-px h-full"
                      style={{
                        background: isResizing === column ? '#475569' : '#e2e8f0',
                      }}
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {currentData.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-slate-50 transition-colors">
                  {columns.map((column) => (
                    <td
                      key={column}
                      className="px-4 py-3 text-sm text-slate-900 border-r border-slate-200 last:border-r-0 cursor-pointer hover:bg-blue-50 transition-colors"
                      style={{ width: columnWidths[column] || 120, minWidth: 50 }}
                      onClick={() => handleCellClick(row, column, row[column])}
                    >
                      <div className="truncate" title={String(row[column])}>
                        {formatCellValue(row[column])}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-slate-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(startIndex + itemsPerPage, data.length)}</span> of{' '}
                  <span className="font-medium">{data.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                    let pageNumber;
                    if (totalPages <= 7) {
                      pageNumber = i + 1;
                    } else {
                      if (currentPage <= 4) {
                        pageNumber = i + 1;
                      } else if (currentPage >= totalPages - 3) {
                        pageNumber = totalPages - 6 + i;
                      } else {
                        pageNumber = currentPage - 3 + i;
                      }
                    }
                    
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === pageNumber ? 'z-10 bg-slate-50 border-slate-500 text-slate-600' : 'bg-white border-slate-300 text-slate-500 hover:bg-slate-50'}`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Cell Detail Dialog */}
      {selectedCell && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] flex flex-col">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">
                  {selectedCell.column.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).replace(/_/g, ' ')}
                </h3>
                <button
                  onClick={handleCloseDialog}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 flex-1 overflow-hidden">
              <textarea
                value={String(selectedCell.value)}
                readOnly
                className="w-full h-full min-h-[300px] p-4 border border-slate-300 rounded-md bg-white text-slate-900 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                style={{ whiteSpace: 'pre-wrap' }}
              />
            </div>
            
            <div className="p-4 bg-slate-50 rounded-b-lg">
              <div className="text-sm text-slate-600">
                Character count: {String(selectedCell.value).length}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Simplified Delete Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-sm w-full">
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-slate-900">Delete this dataset?</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-600">
                      Are you sure you want to delete the dataset document? This will affect all evaluations related to this dataset.
                    </p>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowDeleteDialog(false)}
                      className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleDeleteDataset}
                      disabled={isDeleting}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${isDeleting ? 'bg-red-400 text-white cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700 cursor-pointer'}`}
                    >
                      {isDeleting ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Deleting...
                        </div>
                      ) : (
                        'Delete Document'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
      )}
    </div>
  );
}