import React, { useState } from 'react';
import generatePDF from '../utils/generatePDF';

const ImageUploader = () => {

    const [images, setImages] = useState([]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const updated = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        setImages((prev) => [...prev, ...updated]);
    }

    const handleDrop = (e) => {
        e.preventDefault();

        // Get only image files (ignore random dragged items)
        const files = Array.from(e.dataTransfer.files).filter((f) =>
            f.type.startsWith("image/")
        );

        if (files.length === 0) return;

        // Prevent duplicate file names being added
        const newFiles = files.filter(
            (file) => !images.some((img) => img.file.name === file.name)
        );

        const updated = newFiles.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));

        // Add new ones on top of existing
        setImages((prev) => [...prev, ...updated]);
    };

    const handleDelete = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleGeneratePDF = () => {
        generatePDF(images);
    };


    const handleDragOver = (e) =>
        e.preventDefault()

    const clearImages = () => setImages([])


    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4'>
            <h1 className='text-3xl font-bold mb-20'>Span2pdf — images to PDF</h1>

            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className='w-full max-w-lg border-2 border-dashed border-gray-600 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-800 transition'>

                <p className="text-gray-400 mb-2">Drag & Drop your images here</p>
                <p className="text-sm text-gray-500 mb-4">or click below to select</p>

                <input type="file"
                    accept='image/*'
                    multiple
                    onChange={handleFileChange}
                    className='mb-4 cursor-pointer bg-gray-500 rounded-2xl px-4 py-2 pl-10  ml-12'
                />

                {images.length > 0 && (
                    <div className='grid-cols-3 gap-3 mt-4'>
                        {images.map((img, i) => (
                            <div key={i} className="relative group">
                                <img
                                    src={img.preview}
                                    alt={`upload-${i}`}
                                    draggable={false}
                                    onDragStart={(e) => e.preventDefault()}
                                    className="w-full h-24 object-cover rounded-lg border border-gray-700"
                                />
                                <button
                                    onClick={() => handleDelete(i)}
                                    className="absolute top-1 right-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-md opacity-80 hover:opacity-100 transition"
                                >
                                    ✕
                                </button>
                            </div>

                        ))}
                    </div>
                )}
            </div>
            {images.length > 0 && (
                <div className='mt-6 flex gap-2'>
                    <button
                        onClick={clearImages}
                        className='px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg'>
                        Clear All
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                        onClick={handleGeneratePDF}
                    >
                        Generate PDF
                    </button>
                </div>
            )}
        </div>
    )
}

export default ImageUploader