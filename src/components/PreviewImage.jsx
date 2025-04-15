import { useState } from 'react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';

export default function PreviewImage({ actual, images, onClose }) {
    const [actualImage, setActualImage] = useState(actual); // This is an index

    const handleBackdropClick = (e) => {
        if (e.target.id === 'previewimg-backdrop') {
            onClose();
        }
    }

    const handleImageChange = (direction) => {
        if (direction === 'next') {
            setActualImage((prev) => (prev + 1) % images.length);
        } else if (direction === 'prev') {
            setActualImage((prev) => (prev - 1 + images.length) % images.length);
        }
    }

    return (
        <section id="previewimg-backdrop" onClick={handleBackdropClick} className="fixed top-0 left-0 bg-black/60 h-dvh w-dvw flex items-center justify-center z-50 animate-fade animate-duration-[200ms]">
            <div className='flex flex-col items-center justify-center'>
                {/* Close button */}
                <button onClick={onClose} className="absolute top-4 right-4 border border-white/5 rounded-sm text-white text-xl z-50 cursor-pointer">
                    <X className='w-8 h-8' />
                </button>
                <div className='flex items-center justify-center relative mb-2.5'>
                    {/* Controls */}
                    { images.length > 1 && (
                        <div className='z-50 absolute w-[90%] flex items-center justify-between'>
                            <button type="button" className='cursor-pointer' onClick={() => handleImageChange('prev')}>
                                <ChevronLeft className='bg-black/40 rounded-sm w-8 h-8' />
                            </button>
                            <button type="button" className='cursor-pointer' onClick={() => handleImageChange('next')}>
                                <ChevronRight className='bg-black/40 rounded-sm w-8 h-8' />
                            </button>
                        </div>
                    )}
                    <a href={images[actualImage]} target='_blank' rel='noopener noreferrer'>
                        <img src={images[actualImage]} alt={`Previewing image with index ${actualImage}`} className='w-80 max-w-80 h-80 max-h-80 object-contain rounded-md' />
                    </a>
                </div>
                {/* Image list*/}
                { images.length > 1 && (
                    <div className='max-w-lg flex items-center space-x-1 md:space-x-2'>
                        {
                            images.map((image, index) => (
                                <img key={index} src={image} alt={`Image ${index}`} className={`w-20 h-20 object-cover rounded-md cursor-pointer hover:scale-105 transition-all ${index === actualImage ? 'border-2 border-blue-500' : ''}`} onClick={() => { setActualImage(index) }} />
                            ))
                        }
                    </div>
                )}
            </div>
        </section>
    );
}