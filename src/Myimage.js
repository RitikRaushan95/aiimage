import React, { createRef, useState } from 'react';
import { createFileName, useScreenshot } from 'use-react-screenshot';

function Myimage() {
    const [input, setInput] = useState('');
    const [imageUrl, setImageUrl] = useState(null);

    const passInput = (event) => {
        setInput(event.target.value);
    };

    const token = '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';
    const generateImage = async () => {
        try {
            const response = await fetch(
                "https://api-inference.huggingface.co/models/ZB-Tech/Text-to-Image",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    method: "POST",
                    body: JSON.stringify({ "inputs": input }),
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch image');
            }

            const blob = await response.blob(); 
            const url = URL.createObjectURL(blob);
            setImageUrl(url);
        } catch (error) {
            console.error("Error fetching image:", error);
        }
    };


    const ref = createRef(null);
    const [image, takeScreenShot] = useScreenshot({
    type: "image/jpeg",
    quality: 1.0
  });

    const download = (image, { name = input, extension = "jpg" } = {}) => {
      const a = document.createElement("a");
      a.href = image;
      a.download = createFileName(extension, name);
      a.click();
    };

    const downloadScreenshot = () => takeScreenShot(ref.current).then(download);


    return (
        <>
         <div>
            <form class="max-w-md mx-auto m-10">   
                <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div class="relative">
                <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
                </div>
                <input type="search" id="default-search" class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-gray-600 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-600 dark:focus:border-gray-900" placeholder="Search image for" 
                value={input}
                onChange={passInput}
                required />
                <button type="submit"  class="text-white absolute end-2.5 bottom-2.5 bg-gray-600 hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-gray-600 dark:hover:bg-gray-400 dark:focus:ring-gray-600"
                onClick={(e) => {
                e.preventDefault();
                generateImage();
                setInput('');
            }}>Generate Image</button>
        </div>
    </form>
    </div>

    {imageUrl && (
    <div className='flex flex-col items-center'>
        <div className='flex justify-center'>
            <img ref={ref} src={imageUrl} className='w-80 h-80' alt="AI Pic" />
        </div>
        <div className="mt-4">
            <button type="submit" className="text-white bg-gray-600 hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-gray-600 dark:hover:bg-gray-400 dark:focus:ring-gray-600"
                onClick={(e) => {
                    e.preventDefault();
                    downloadScreenshot();
                }}>
                Download
            </button>
        </div>
    </div>
)}

        </>
    );
}

export default Myimage;
