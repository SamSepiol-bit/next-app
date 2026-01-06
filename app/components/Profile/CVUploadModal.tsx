// components/Profile/CVUploadModal.tsx
"use client";

import { useState, useRef } from 'react';
import { X, Upload, FileText, Loader2, CheckCircle, AlertCircle, Download } from 'lucide-react';
import { updateCandidateCV } from '@/app/lib/api/cvApi.service';
import { data } from 'react-router-dom';

interface CVUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentCVName?: string;
  currentCVUrl?: string;
}

export default function CVUploadModal({
  isOpen,
  onClose,
  onSuccess,
  currentCVName,
  currentCVUrl
}: CVUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        setError('Please upload a valid document (PDF, DOC, DOCX, TXT)');
        return;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size should be less than 10MB');
        return;
      }

      setSelectedFile(file);
      setFileName(file.name.replace(/\.[^/.]+$/, "")); // Remove extension for name
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile || !fileName.trim()) {
      setError('Please select a file and enter a name');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      await updateCandidateCV({
        cv_document: selectedFile,
        cv_document_name: fileName.trim()
      });

      setSuccess(true);
      
      // Reset form and close after success
      setTimeout(() => {
        setSuccess(false);
        setSelectedFile(null);
        setFileName('');
        onSuccess();
        onClose();
      }, 2000);

    } catch (err: any) {
      setError(err.message || 'Failed to upload CV');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadCurrentCV = () => {
    if (currentCVUrl) {
      window.open(currentCVUrl, '_blank');
    }
  };

  console.log('Profile data:', data.candidate);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
        onClick={isSubmitting ? undefined : onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div 
            className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-gray-800 dark:to-gray-900 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="w-8 h-8" />
                  <div>
                    <h2 className="text-xl font-bold">Update CV</h2>
                    <p className="text-blue-100 dark:text-gray-300 text-sm">
                      Upload your resume/CV document
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="p-2 hover:bg-white/20 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit} className="p-6">
              {error && (
                <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 mr-2" />
                    <p className="text-red-800 dark:text-red-300">{error}</p>
                  </div>
                </div>
              )}

              {success && (
                <div className="mb-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400 mr-2" />
                    <p className="text-green-800 dark:text-green-300 font-medium">
                      CV uploaded successfully!
                    </p>
                  </div>
                </div>
              )}

              {/* Current CV Section */}
              {currentCVName && (
                <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                    Current CV
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                      <span className="text-sm text-blue-700 dark:text-blue-300 truncate max-w-[200px]">
                        {currentCVName}
                      </span>
                    </div>
                    {currentCVUrl && (
                      <button
                        type="button"
                        onClick={handleDownloadCurrentCV}
                        className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        View
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* File Upload Area */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Select CV Document <span className="text-red-500">*</span>
                </label>
                
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    selectedFile
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/10 dark:border-green-600'
                      : 'border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isSubmitting}
                  />
                  
                  <div className="flex flex-col items-center">
                    <Upload className={`w-12 h-12 mb-3 ${
                      selectedFile ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'
                    }`} />
                    
                    {selectedFile ? (
                      <>
                        <p className="text-green-700 dark:text-green-300 font-medium mb-1">
                          {selectedFile.name}
                        </p>
                        <p className="text-sm text-green-600 dark:text-green-400">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-700 dark:text-gray-300 font-medium mb-1">
                          Click to upload CV
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          PDF, DOC, DOCX, TXT (Max 10MB)
                        </p>
                      </>
                    )}
                  </div>
                </div>
                
                {selectedFile && (
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Ready to upload
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setFileName('');
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                      className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                      disabled={isSubmitting}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* CV Name Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  CV Document Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="e.g., My Resume 2024, John_Doe_CV"
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Give your CV a descriptive name (without file extension)
                </p>
              </div>

              {/* Footer Actions */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedFile}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 mr-2" />
                      Upload CV
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}