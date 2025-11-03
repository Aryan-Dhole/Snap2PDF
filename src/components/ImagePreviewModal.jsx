import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Dialog } from "@headlessui/react";

const ImagePreviewModal = ({ isOpen, image, onClose, onCropComplete }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropAreaChange = useCallback((_, areaPixels) => {
        setCroppedAreaPixels(areaPixels);
    }, []);

    const onCropDone = useCallback(async () => {
        if (!image || !croppedAreaPixels) return;
        try {
            const croppedImage = await getCroppedImg(image, croppedAreaPixels);
            onCropComplete(croppedImage);
            onClose();
        } catch (err) {
            console.error(err);
        }
    }, [image, croppedAreaPixels, onCropComplete, onClose]);

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center"
        >
            <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
            <div className="relative bg-gray-800 rounded-xl shadow-lg p-4 w-[90%] max-w-lg text-white">
                <h2 className="text-lg font-semibold mb-2">Crop Image</h2>

                <div className="relative w-full h-64 bg-gray-900 rounded-lg overflow-hidden">
                    <Cropper
                        image={image || ""}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropAreaChange}
                    />
                </div>

                <div className="flex items-center gap-3 mt-3">
                    <input
                        type="range"
                        min={1}
                        max={3}
                        step={0.1}
                        value={zoom}
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="w-full"
                        aria-label="Zoom"
                    />
                </div>

                <div className="flex justify-between mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onCropDone}
                        className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                        Done
                    </button>
                </div>
            </div>
        </Dialog>
    );
};

// Helper for crop logic
const getCroppedImg = (imageSrc, cropPixels) =>
    new Promise((resolve, reject) => {
        if (!imageSrc || !cropPixels) {
            reject(new Error("Invalid image or crop area"));
            return;
        }
        const image = new Image();
        image.crossOrigin = "anonymous";
        image.onload = () => {
            try {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                const { x, y, width, height } = cropPixels;
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(image, x, y, width, height, 0, 0, width, height);
                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error("Crop failed"));
                            return;
                        }
                        resolve(URL.createObjectURL(blob));
                    },
                    "image/jpeg",
                    0.92
                );
            } catch (err) {
                reject(err);
            }
        };
        image.onerror = () => reject(new Error("Image load failed"));
        image.src = imageSrc;
    });

export default ImagePreviewModal;
