import React, { useState } from 'react';
import { Plus, Trash2, Upload, Image as ImageIcon, Link as LinkIcon, Check } from 'lucide-react';

interface GalleryUploaderProps {
  gallery?: string[];
  onChange: (gallery: string[]) => void;
  compressAndReadImage: (file: File) => Promise<string>;
  label?: string;
}

export function GalleryUploader({
  gallery = [],
  onChange,
  compressAndReadImage,
  label = "Photo Gallery Pictures"
}: GalleryUploaderProps) {
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const newImages: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
          const dataUrl = await compressAndReadImage(file);
          newImages.push(dataUrl);
        }
      }
      onChange([...gallery, ...newImages]);
    } catch (err) {
      console.error('Failed to compress gallery image:', err);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleAddUrl = () => {
    if (urlInput.trim()) {
      onChange([...gallery, urlInput.trim()]);
      setUrlInput('');
      setShowUrlInput(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updated = gallery.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-3 bg-white p-4 rounded-2xl border border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="font-bold text-gray-800 text-xs flex items-center">
          <ImageIcon className="w-4 h-4 mr-1.5 text-emerald-700" />
          {label} ({gallery.length} Images)
        </label>

        <div className="flex items-center space-x-2">
          <label className="inline-flex items-center px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold cursor-pointer transition-colors border border-emerald-200">
            <Upload className="w-3.5 h-3.5 mr-1" />
            {uploading ? 'Processing...' : 'Upload Photos'}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="inline-flex items-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors border border-gray-200"
          >
            <LinkIcon className="w-3.5 h-3.5 mr-1" />
            Add Image URL
          </button>
        </div>
      </div>

      {showUrlInput && (
        <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-xl border border-gray-200">
          <input
            type="url"
            placeholder="Paste image URL (e.g., https://images.unsplash.com/...)"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-xs outline-none"
          />
          <button
            type="button"
            onClick={handleAddUrl}
            className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-bold"
          >
            Add
          </button>
        </div>
      )}

      {/* Gallery Thumbnails Grid */}
      {gallery.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-1">
          {gallery.map((img, idx) => (
            <div key={idx} className="relative group rounded-xl overflow-hidden border border-gray-200 shadow-2xs aspect-square">
              <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-1">
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-sm"
                  title="Remove from gallery"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-xs">
          No gallery images added yet. Click <strong>Upload Photos</strong> or <strong>Add Image URL</strong> to attach pictures.
        </div>
      )}
    </div>
  );
}
